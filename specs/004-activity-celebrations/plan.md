# Technical Implementation Plan: Célébration des Contributions et Activité Automatisée

**Spec Reference**: `specs/004-activity-celebrations/spec.md`  
**Feature ID**: `004-activity-celebrations`  
**Status**: Approved  

---

## 1. Summary of Changes & Architecture

Mise en place du pipeline d'ingestion d'événements et de transformation en publications consenties :
- Route API Webhook sécurisée (`POST /api/webhooks/github`) validant la signature HMAC SHA-256 de GitHub.
- Modèle `ActivityEvent` pour tracer les événements reçus de manière idempotente.
- Moteur de génération de brouillons de célébration (`CelebrationTemplateService`).
- Système de notification et interface modale d'approbation permettant à l'utilisateur de réviser et publier.

---

## 2. Technical Stack & Dependencies

- **Cryptographie Webhook** : Node.js `crypto` pour le calcul HMAC SHA-256 (`crypto.createHmac('sha256', secret)`).
- **Formatage & Templating** : Fonctions TypeScript pures de génération de texte multilingue.
- **Base de données** : PostgreSQL avec Prisma ORM pour le stockage des événements et l'idempotence.

---

## 3. Data Model & Schema Changes

```prisma
// Extension prisma/schema.prisma

enum ActivityType {
  PR_MERGED
  NEW_RELEASE
  NEW_PUBLIC_REPO
}

enum EventStatus {
  PENDING_USER_APPROVAL
  PUBLISHED
  DISMISSED
}

model ActivityEvent {
  id           String       @id @default(uuid())
  userId       String
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  provider     String       // "github" | "gitlab"
  type         ActivityType
  externalId   String       @unique // ex: "gh_pr_12345678" pour éviter les doublons
  
  repoFullName String       // ex: "moussa/afri-pay-utils"
  repoUrl      String
  title        String       // Titre de la PR ou de la Release
  metadata     Json         // Détails bruts utiles (PR number, additions, deletions, release tag)
  
  status       EventStatus  @default(PENDING_USER_APPROVAL)
  suggestedText String      @db.Text
  
  publishedPostId String?   @unique
  detectedAt   DateTime     @default(now())
  resolvedAt   DateTime?

  @@index([userId, status])
  @@index([externalId])
}
```

---

## 4. API Contracts & Webhook Architecture

### Validation Cryptographique du Webhook (`src/lib/github/webhook-validator.ts`)
```typescript
import crypto from 'crypto';

export function verifyGithubWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
}
```

### Route Handler Webhook (`src/app/api/webhooks/github/route.ts`)
- Reçoit le payload brut (Raw Body).
- Vérifie `X-Hub-Signature-256`.
- Identifie l'utilisateur via `sender.id` ou `pull_request.user.id` lié à `Account.providerAccountId`.
- Vérifie que le dépôt est public (`repository.private === false`).
- Crée un enregistrement `ActivityEvent` avec statut `PENDING_USER_APPROVAL`.
- Déclenche une notification in-app à l'utilisateur.
- Répond immédiatement `HTTP 200 OK`.

### Server Actions Utilisateur (`src/actions/celebration.actions.ts`)
- `getPendingCelebrations(): Promise<ActivityEventDto[]>`
- `publishCelebration(eventId: string, customizedText: string): Promise<ActionResult<PostDto>>` :
  - Crée la publication de type `CELEBRATION`.
  - Met à jour `ActivityEvent.status = 'PUBLISHED'`.
  - Incrémente les statistiques de contributions reconnues sur le profil.
- `dismissCelebration(eventId: string): Promise<ActionResult<void>>` :
  - Passe le statut à `DISMISSED`.

---

## 5. Component Design & File Structure

```text
src/
├── app/
│   └── api/
│       └── webhooks/
│           └── github/route.ts       # Endpoint de réception GitHub
├── components/celebrations/
│   ├── celebration-banner.tsx        # Bannière incitative en haut du fil si un draft existe
│   ├── celebration-modal.tsx         # Modale de prévisualisation, modification et publication
│   └── celebration-badge.tsx         # Badge visuel spécial sur le post final
└── lib/
    ├── github/
    │   └── webhook-validator.ts      # Validation HMAC sécurisée
    └── celebration-templates.ts      # Générateur de formulations valorisantes
```

---

## 6. Risk Analysis & Mitigation

| Risque | Impact | Stratégie d'Atténuation |
| :--- | :--- | :--- |
| **Attaque par rejeu / fausses PRs** | Critique | Validation stricte de la signature HMAC de GitHub et vérification d'unicité sur `externalId`. |
| **Pollution du fil par spam de micro-commits** | Élevé | Seules les **PRs fusionnées** (et non chaque commit individuel) et les releases officielles déclenchent des célébrations. |
| **Exposition involontaire de code privé** | Critique | Vérification systématique du booléen `repository.private === false` ; exclusion stricte des dépôts privés. |

---

## 7. Verification & Testing Strategy

- **Tests unitaires (`vitest`)** :
  - `src/lib/github/webhook-validator.test.ts` : Validation de signature valide, invalide, ou en-tête manquant.
  - `src/lib/celebration-templates.test.ts` : Vérification des textes générés pour PR, release et nouveau repo.
- **Tests d'intégration (`Playwright` & `supertest`)** :
  - Simulation de webhook GitHub avec signature HMAC valide.
  - Connexion de l'utilisateur, ouverture de la modal de célébration, édition du texte et vérification de la publication dans le fil.
