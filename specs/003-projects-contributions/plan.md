# Technical Implementation Plan: Cartes de Projets et Appels à Contributeurs

**Spec Reference**: `specs/003-projects-contributions/spec.md`  
**Feature ID**: `003-projects-contributions`  
**Status**: Approved  

---

## 1. Summary of Changes & Architecture

Implémentation du système de catalogage et d'exposition des projets open source :
- Service d'inspection et d'extraction d'URL GitHub et GitLab (avec parseur d'URL normalisé).
- Table `Project` servant de cache persistant des métadonnées des dépôts avec rafraîchissement périodique (TTL 12h).
- Modèle `ContributorCall` lié aux publications de type `CONTRIBUTOR_CALL`.
- Composant carte de projet riche `ProjectCard` intégrant la politique IA et l'accès direct aux tickets.
- Modale et Server Action « Je veux aider » avec traçabilité de l'intention et guidage du junior.

---

## 2. Technical Stack & Dependencies

- **API GitHub** : `octokit` pour les dépôts GitHub publics (`GET /repos/{owner}/{repo}`).
- **API GitLab** : API REST GitLab v4 (`GET /api/v4/projects/:id`).
- **Validation** : Schémas `zod` pour les URLs et options d'appel à contributeurs.
- **Cache** : Table PostgreSQL `Project` avec champ `cachedAt` et indexation sur `repoFullName`.

---

## 3. Data Model & Schema Changes

```prisma
// Extension prisma/schema.prisma

enum ExperienceLevel {
  BEGINNER_FRIENDLY
  INTERMEDIATE
  ADVANCED
}

enum AiContributionPolicy {
  PROHIBITED          // Contributions IA strictement interdites
  ALLOWED_WITH_REVIEW // Acceptées sous condition de relecture et tests complets
  OPEN                // IA bienvenue sans restriction particulière
}

model Project {
  id              String            @id @default(uuid())
  provider        String            // "github" | "gitlab"
  repoFullName    String            @unique // ex: "moussa/afri-pay-utils"
  repoUrl         String
  ownerLogin      String
  ownerAvatarUrl  String?
  name            String
  description     String?           @db.Text
  primaryLanguage String?
  starsCount      Int               @default(0)
  forksCount      Int               @default(0)
  openIssuesCount Int               @default(0)
  lastCommitAt    DateTime?
  cachedAt        DateTime          @default(now())
  
  contributorCalls ContributorCall[]

  @@index([provider, repoFullName])
  @@index([primaryLanguage])
}

model ContributorCall {
  id               String               @id @default(uuid())
  postId           String               @unique
  post             Post                 @relation(fields: [postId], references: [id], onDelete: Cascade)
  projectId        String
  project          Project              @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  experienceLevel  ExperienceLevel      @default(BEGINNER_FRIENDLY)
  contributionTypes String[]            // ["DOCS", "TESTS", "BUG_FIX", "FEATURE", "UI"]
  aiPolicy         AiContributionPolicy @default(ALLOWED_WITH_REVIEW)
  targetIssuesUrl  String?
  isActive         Boolean              @default(true)
  
  intents          ContributionIntent[]
  createdAt        DateTime             @default(now())

  @@index([experienceLevel])
  @@index([aiPolicy])
}

model ContributionIntent {
  id           String          @id @default(uuid())
  callId       String
  call         ContributorCall @relation(fields: [callId], references: [id], onDelete: Cascade)
  userId       String
  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  message      String?         @db.Text
  createdAt    DateTime        @default(now())

  @@unique([callId, userId])
  @@index([userId])
}
```

---

## 4. API Contracts & Server Actions

### Parseur d'URL de Dépôt (`src/lib/git-url-parser.ts`)
```typescript
export interface ParsedRepoUrl {
  provider: 'github' | 'gitlab';
  owner: string;
  repo: string;
}

export function parseGitRepoUrl(url: string): ParsedRepoUrl | null {
  const ghMatch = url.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (ghMatch) return { provider: 'github', owner: ghMatch[1], repo: ghMatch[2].replace(/\.git$/, '') };

  const glMatch = url.match(/gitlab\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (glMatch) return { provider: 'gitlab', owner: glMatch[1], repo: glMatch[2].replace(/\.git$/, '') };

  return null;
}
```

### Server Actions (`src/actions/project.actions.ts`)
- `inspectGitRepository(url: string): Promise<ActionResult<ProjectPreviewDto>>` :
  - Vérifie le cache local. Si manquant ou expiré (> 12h), appelle l'API GitHub/GitLab publique.
- `publishContributorCall(input: CreateContributorCallInput): Promise<ActionResult<PostDto>>` :
  - Crée la publication de type `CONTRIBUTOR_CALL` et lie le `ContributorCall`.
- `registerContributionIntent(callId: string, introMessage?: string): Promise<ActionResult<void>>` :
  - Enregistre l'intérêt du junior, génère un commentaire automatique de bienvenue et notifie le mainteneur.

---

## 5. Component Design & File Structure

```text
src/
├── components/projects/
│   ├── git-url-input.tsx           # Saisie d'URL avec détection en temps réel et preview
│   ├── project-card.tsx            # Carte riche d'affichage du dépôt (langages, stars, forks)
│   ├── ai-policy-badge.tsx         # Badge visuel explicite de la politique IA
│   ├── contributor-call-form.tsx   # Formulaire étiquettes (niveau, type d'aide, issues)
│   └── help-intent-modal.tsx       # Modale d'accueil et d'orientation vers GitHub
├── lib/
│   ├── git-url-parser.ts           # Parseur sécurisé d'URLs Git
│   └── github/
│       └── repo-fetcher.ts         # Récupérateur de métadonnées avec gestion d'erreurs
```

---

## 6. Risk Analysis & Mitigation

| Risque | Impact | Stratégie d'Atténuation |
| :--- | :--- | :--- |
| **Abus d'appels à contributeurs fantômes** | Moyen | Validation préalable que le compte publiant est bien contributeur ou propriétaire du dépôt sur GitHub/GitLab. |
| **Piratage ou URLs malveillantes** | Élevé | Validation stricte des noms de domaine autorisés (`github.com`, `gitlab.com`) ; aucune exécution de script distant. |
| **Afflux de contributions IA non désirées** | Élevé | Affichage très proéminent du badge `AiContributionPolicy` sur la carte pour prévenir les PR non sollicitées. |

---

## 7. Verification & Testing Strategy

- **Tests unitaires (`vitest`)** :
  - `src/lib/git-url-parser.test.ts` : Tests sur différents formats d'URLs (avec/sans `.git`, sous-dossiers, query params).
- **Tests d'intégration (`Playwright`)** :
  - Mock de l'API Octokit pour simuler la récupération des métadonnées d'un projet.
  - Test du formulaire de publication d'appel à contributeurs et clic sur « Je veux aider ».
