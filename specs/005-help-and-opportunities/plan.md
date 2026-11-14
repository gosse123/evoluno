# Technical Implementation Plan: Entraide Humaine et Opportunités par Recommandation

**Spec Reference**: `specs/005-help-and-opportunities/spec.md`  
**Feature ID**: `005-help-and-opportunities`  
**Status**: Approved  

---

## 1. Summary of Changes & Architecture

Implémentation des modules à fort impact économique et communautaire :
- Modèles Prisma `HelpDetails`, `OpportunityDetails` et `Recommendation`.
- Système de marquage de solution acceptée sur les publications d'entraide.
- Moteur de génération de candidature éclair « Postuler avec mon profil » (export profil vivant au format standard).
- Flux d'approbation asynchrone des recommandations entre pairs avec liaison vers les projets/contributions.

---

## 2. Technical Stack & Dependencies

- **Base de données** : PostgreSQL avec Prisma ORM (relations polymorphes associées à la table `Post`).
- **Validation** : Schémas `zod` pour les critères d'offres d'emploi et de demandes d'aide.
- **Sécurité & Modération** : Filtres anti-spam sur les demandes de recommandations massives.

---

## 3. Data Model & Schema Changes

```prisma
// Extension prisma/schema.prisma

enum ContractType {
  INTERNSHIP      // Stage
  APPRENTICESHIP  // Alternance
  FREELANCE       // Mission freelance
  FULL_TIME       // CDI / Temps plein
  PART_TIME       // Temps partiel
}

enum RemotePolicy {
  ON_SITE
  HYBRID
  FULL_REMOTE
}

enum RecommendationStatus {
  PENDING
  ACCEPTED
  DECLINED
}

model HelpDetails {
  id                String    @id @default(uuid())
  postId            String    @unique
  post              Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  isResolved        Boolean   @default(false)
  resolvedCommentId String?
  
  resolvedAt        DateTime?

  @@index([isResolved])
}

model OpportunityDetails {
  id              String        @id @default(uuid())
  postId          String        @unique
  post            Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  companyName     String
  roleTitle       String
  contractType    ContractType  @default(INTERNSHIP)
  locationCity    String?
  locationCountry String?       // ex: "Burkina Faso"
  remotePolicy    RemotePolicy  @default(HYBRID)
  compensation    String?       // ex: "Indemnité mensuelle : 150 000 FCFA" ou "Bénévole"
  applyUrl        String?
  applyEmail      String?
  isFilled        Boolean       @default(false)

  @@index([contractType])
  @@index([locationCountry])
  @@index([isFilled])
}

model Recommendation {
  id               String               @id @default(uuid())
  authorId         String
  author           User                 @relation("RecommendationsGiven", fields: [authorId], references: [id], onDelete: Cascade)
  recipientId      String
  recipient        User                 @relation("RecommendationsReceived", fields: [recipientId], references: [id], onDelete: Cascade)
  
  relatedProjectId String?
  testimony        String               @db.Text
  relationship     String               // ex: "Mainteneur open-source", "Collègue de projet d'études"
  status           RecommendationStatus @default(PENDING)
  
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  @@index([recipientId, status])
  @@index([authorId])
}
```

---

## 4. API Contracts & Server Actions

### Server Actions (`src/actions/ecosystem.actions.ts`)
```typescript
// Entraide
export async function publishHelpRequest(input: CreateHelpRequestInput): Promise<ActionResult<PostDto>>
export async function markHelpSolution(postId: string, commentId: string): Promise<ActionResult<void>>

// Opportunités
export async function publishOpportunity(input: CreateOpportunityInput): Promise<ActionResult<PostDto>>
export async function markOpportunityFilled(postId: string): Promise<ActionResult<void>>

// Recommandations
export async function requestRecommendation(recipientId: string, message: string, projectId?: string): Promise<ActionResult<void>>
export async function respondRecommendation(recommendationId: string, testimony: string, accept: boolean): Promise<ActionResult<void>>
```

---

## 5. Component Design & File Structure

```text
src/
├── app/(platform)/
│   └── opportunities/
│       ├── page.tsx                  # Tableau de bord des opportunités (stages & missions)
│       └── [id]/page.tsx             # Fiche détaillée de l'offre
├── components/
│   ├── help/
│   │   ├── help-request-card.tsx     # Affichage avec badge statut « Résolu » ou « En attente »
│   │   └── solution-badge.tsx        # Encadré visuel sur le commentaire gagnant
│   ├── opportunities/
│   │   ├── opportunity-card.tsx      # Carte d'offre claire avec badges contrat / remote
│   │   └── apply-modal.tsx           # Synthèse profil à transmettre au recruteur
│   └── recommendations/
│       ├── recommendation-list.tsx   # Témoignages affichés sur le profil vivant
│       └── request-rec-modal.tsx     # Formulaire de sollicitation de recommandation
```

---

## 6. Risk Analysis & Mitigation

| Risque | Impact | Stratégie d'Atténuation |
| :--- | :--- | :--- |
| **Fausses offres d'emploi / arnaques** | Élevé | Obligation pour les annonceurs de valider leur profil avec GitHub ou email professionnel vérifié ; bouton de signalement dédié. |
| **Questions d'entraide triviales encombrant le fil** | Moyen | Rappel bienveillant dans le formulaire : « As-tu déjà interrogé la doc ou une IA ? Qu'as-tu obtenu ? » pour encourager les questions qualifiées. |
| **Spam de demandes de recommandation** | Moyen | Quota maximum de 3 demandes de recommandation en attente par utilisateur à tout moment. |

---

## 7. Verification & Testing Strategy

- **Tests unitaires (`vitest`)** :
  - Validation du droit exclusif de l'auteur du post à marquer la solution validée.
  - Test des règles d'intégrité sur les transitions d'état des recommandations (`PENDING` -> `ACCEPTED` / `DECLINED`).
- **Tests d'intégration (`Playwright`)** :
  - Cycle complet de demande de recommandation, notification, acceptation et affichage sur le profil public.
