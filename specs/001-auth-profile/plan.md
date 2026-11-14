# Technical Implementation Plan: Authentification et Profil Vivant

**Spec Reference**: `specs/001-auth-profile/spec.md`  
**Feature ID**: `001-auth-profile`  
**Status**: Approved  

---

## 1. Summary of Changes & Architecture

Mise en place de l'infrastructure socle du projet :
- Initialisation du projet Next.js 15 (App Router, TypeScript, Tailwind CSS).
- Configuration de la base de données PostgreSQL via Prisma ORM.
- Implémentation du système d'authentification avec Auth.js (NextAuth v5) supportant les providers GitHub et GitLab.
- Service de synchronisation asynchrone des métadonnées publiques GitHub (`Octokit`).
- Module de chiffrement cryptographique sécurisé pour les jetons OAuth.
- Composants d'onboarding express pour les développeurs juniors (« Profil vide »).

---

## 2. Technical Stack & Dependencies

- **Framework** : Next.js 15.x (React 19, App Router, Server Actions)
- **Langage** : TypeScript 5.x (mode strict)
- **Base de données** : PostgreSQL 16+ avec Prisma ORM
- **Authentification** : `@auth/prisma-adapter`, `next-auth@beta`
- **Clients API** : `octokit` (GitHub API v3), `axios` ou `fetch` natif (GitLab API v4)
- **Chiffrement** : Node.js `crypto` (`aes-256-gcm`)
- **UI & Style** : Tailwind CSS, `lucide-react`, `@radix-ui/react-*` (accessible et léger)

---

## 3. Data Model & Schema Changes

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(uuid())
  name          String?
  email         String?        @unique
  emailVerified DateTime?
  image         String?
  username      String         @unique
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  accounts      Account[]
  sessions      Session[]
  profile       Profile?
  techInterests UserTech[]
  
  following     Follow[]       @relation("UserFollows")
  followers     Follow[]       @relation("UserFollowedBy")

  @@index([username])
}

model Account {
  id                String   @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?  @db.Text
  access_token      String?  @db.Text // Chiffré en AES-256-GCM
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?  @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum CareerStatus {
  STUDENT
  JUNIOR
  MID_LEVEL
  SENIOR
  AI_ENTHUSIAST
  OTHER
}

model Profile {
  id              String       @id @default(uuid())
  userId          String       @unique
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName     String
  bio             String?      @db.Text
  locationCity    String?
  locationCountry String?      // ex: "Burkina Faso", "Côte d'Ivoire", "Sénégal"
  careerStatus    CareerStatus @default(JUNIOR)
  openToWork      Boolean      @default(false)
  githubUrl       String?
  gitlabUrl       String?
  portfolioUrl    String?
  
  // Cache JSON des données publiques récupérées
  githubStats     Json?        // { topLanguages: [...], publicReposCount: 3, highlights: [...] }
  lastSyncedAt    DateTime?
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([locationCountry])
  @@index([careerStatus])
}

model UserTech {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String   // ex: "Python", "TypeScript", "Flutter"
  level       String   @default("learning") // "learning", "practicing", "proficient"
  
  @@unique([userId, name])
  @@index([name])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower    User     @relation("UserFollows", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("UserFollowedBy", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}
```

---

## 4. API Contracts & Server Actions

### Server Actions
- `auth.actions.ts`:
  - `loginWithProvider(provider: 'github' | 'gitlab')`
  - `disconnectProvider(provider: string)`
  - `deleteUserAccount()`
- `profile.actions.ts`:
  - `updateProfile(data: ProfileUpdateInput): Promise<ActionResult>`
  - `completeEmptyProfileOnboarding(data: OnboardingInput): Promise<ActionResult>`
  - `syncExternalStats(): Promise<SyncResult>`
  - `toggleFollow(targetUserId: string): Promise<{ following: boolean }>`

### Security Module: Token Encryption (`src/lib/crypto.ts`)
```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY!, 'hex'); // 32 bytes

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 5. Component Design & File Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx             # Écran d'accueil et CTA OAuth
│   ├── (platform)/
│   │   ├── [username]/page.tsx        # Vue publique du profil vivant
│   │   ├── onboarding/page.tsx        # Assistant onboarding « profil vide »
│   │   └── settings/profile/page.tsx  # Paramètres & révocation
│   └── api/
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── profile/
│   │   ├── profile-header.tsx         # Avatar, bio, statut, localisation
│   │   ├── tech-badges.tsx            # Langages étudiés/utilisés
│   │   ├── github-summary-card.tsx    # Projets phares et stats GitHub
│   │   └── follow-button.tsx          # Bouton s'abonner avec optimistic update
│   └── onboarding/
│       └── empty-profile-wizard.tsx   # Questionnaire express 3 clics
├── lib/
│   ├── auth.ts                        # Configuration Auth.js
│   ├── crypto.ts                      # Chiffrement AES-256-GCM
│   ├── prisma.ts                      # Client Prisma singleton
│   └── github/
│       └── client.ts                  # Fetcher Octokit avec cache TTL
```

---

## 6. Risk Analysis & Mitigation

| Risque | Impact | Stratégie d'Atténuation |
| :--- | :--- | :--- |
| **Dépassement du Rate Limit GitHub** | Élevé | Cache des profils et stats publiques en DB avec TTL de 6h. Rafraîchissement manuel limité à 1x/jour par l'utilisateur. |
| **Fuite de jetons OAuth** | Critique | Jetons systématiquement chiffrés en base de données avec AES-256-GCM ; scopes limités au strict nécessaire (lecture seule). |
| **Frustration de l'utilisateur débutant** | Moyen | Détection automatique d'un compte avec 0 repo et affichage immédiat de l'assistant onboarding valorisant. |

---

## 7. Verification & Testing Strategy

- **Tests unitaires (`vitest`)** :
  - `src/lib/crypto.test.ts` : Validation du cycle chiffrement/déchiffrement et détection de falsification d'AuthTag.
  - `src/lib/profile-score.test.ts` : Calcul de complétion du profil sans dépôts.
- **Tests d'intégration (`Playwright`)** :
  - Flux d'authentification mockée OAuth.
  - Sauvegarde et affichage d'un profil junior après onboarding.
  - Action follow/unfollow avec vérification des compteurs.
