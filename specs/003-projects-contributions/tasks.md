# Implementation Tasks: Cartes de Projets et Appels à Contributeurs

**Design Documents**:
- Specification: `specs/003-projects-contributions/spec.md`
- Technical Plan: `specs/003-projects-contributions/plan.md`

## Task Execution Guidelines
- Validation systématique des URLs externes.
- Strict respect de l'Article I de la Constitution (pas d'émulation de forge logicielle).

---

## Phase 1 : Schéma de Données & Parseur
- [ ] T201: Définir et migrer les tables `Project`, `ContributorCall`, `ContributionIntent` dans Prisma.
- [ ] T202: Implémenter et tester unitairement le parseur d'URL Git (`src/lib/git-url-parser.ts`).
- [ ] T203: Développer le service de récupération des métadonnées publiques GitHub (`src/lib/github/repo-fetcher.ts`).

## Phase 2 : Logique Métier & Server Actions
- [ ] T204: Implémenter l'action `inspectGitRepository` avec mise en cache DB (TTL 12 heures).
- [ ] T205: Implémenter la Server Action `publishContributorCall` associant un post et son appel.
- [ ] T206: Développer `registerContributionIntent` avec notification temps réel au mainteneur.

## Phase 3 : Composants Visuels
- [ ] T207: Créer le composant visuel `AiPolicyBadge` (interdit, sous revue, libre).
- [ ] T208: Développer le composant de carte riche `ProjectCard` (affichage mobile-friendly, étoiles, dernier commit).
- [ ] T209: Construire le formulaire interactif `ContributorCallForm` dans le compositeur de post.
- [ ] T210: Développer la modale d'accueil `HelpIntentModal` guidant le junior vers les tickets GitHub.

## Phase 4 : Filtres & Recherche de Projets
- [ ] T211: Créer la page d'exploration des projets (`src/app/(platform)/projects/page.tsx`).
- [ ] T212: Ajouter les filtres de recherche par langage, niveau débutant et pays du mainteneur.

## Phase 5 : Vérification
- [ ] T213: Écrire les tests unitaires pour la détection des politiques IA et le parsing.
- [ ] T214: Écrire les tests E2E pour le parcours de Moussa (publication de l'appel) et d'Aminata (clic pour aider).
