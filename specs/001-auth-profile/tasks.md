# Implementation Tasks: Authentification et Profil Vivant

**Design Documents**:
- Specification: `specs/001-auth-profile/spec.md`
- Technical Plan: `specs/001-auth-profile/plan.md`

## Task Execution Guidelines
- Respecter scrupuleusement la Constitution (`.specify/memory/constitution.md`).
- Développer avec l'approche Test-Driven (TDD) pour les modules critiques (crypto, adaptateurs, calculs de complétion).
- Cocher les cases `[x]` à mesure de l'avancement.

---

## Phase 1 : Initialisation & Schéma de Données
- [x] T001: Initialiser le projet Next.js 15 avec TypeScript et Tailwind CSS (`pnpm create next-app`).
- [x] T002: Configurer Prisma ORM et PostgreSQL (variables d'environnement, client singleton `src/lib/prisma.ts`).
- [x] T003: Définir et exécuter la migration initiale pour `User`, `Account`, `Session`, `Profile`, `UserTech`, `Follow`.
- [x] T004: Créer et valider par test unitaire le module de chiffrement AES-256-GCM (`src/lib/crypto.ts`).

## Phase 2 : Authentification & Sécurité OAuth
- [ ] T005: Configurer Auth.js (NextAuth v5) avec PrismaAdapter et le provider GitHub OAuth.
- [ ] T006: Ajouter le provider GitLab OAuth avec permissions restreintes en lecture seule.
- [ ] T007: Intercepter le callback OAuth pour chiffrer l'access_token avant persistance en base.
- [ ] T008: Créer la Server Action de révocation de liaison et de suppression de compte utilisateur (droit à l'oubli).

## Phase 3 : Synchronisation GitHub & Profil Débutant
- [ ] T009: Implémenter le service d'extraction des métadonnées publiques GitHub via Octokit avec gestion de cache.
- [ ] T010: Développer le composant et la Server Action de l'assistant d'onboarding express (« Profil vide »).
- [ ] T011: Implémenter l'action de mise à jour du profil et des technologies étudiées (`UserTech`).
- [ ] T012: Implémenter l'action `toggleFollow` avec mise à jour optimiste et contrôle d'idempotence.

## Phase 4 : Interface Utilisateur & Responsive Views
- [ ] T013: Créer la page d'accueil d'authentification (`src/app/(auth)/login/page.tsx`).
- [ ] T014: Créer la vue publique du profil vivant (`src/app/(platform)/[username]/page.tsx`).
- [ ] T015: Intégrer les cartes de résumé GitHub (`github-summary-card.tsx`) et badges d'apprentissage (`tech-badges.tsx`).
- [ ] T016: Tester l'affichage responsive sur formats mobiles (360px) avec connexion 3G simulée.

## Phase 5 : Vérification & Tests E2E
- [ ] T017: Écrire les tests unitaires pour l'extraction de profil et le calcul de complétion.
- [ ] T018: Écrire un test d'intégration Playwright pour le parcours complet d'inscription d'un junior sans repo.
- [ ] T019: Vérifier la conformité totale avec l'Article I, II et IV de la Constitution.
