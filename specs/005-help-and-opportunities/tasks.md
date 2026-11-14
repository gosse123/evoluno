# Implementation Tasks: Entraide Humaine et Opportunités par Recommandation

**Design Documents**:
- Specification: `specs/005-help-and-opportunities/spec.md`
- Technical Plan: `specs/005-help-and-opportunities/plan.md`

## Task Execution Guidelines
- Priorité à la clarté pour les étudiants en quête de stages.
- Protection stricte contre le spam de recommandations.

---

## Phase 1 : Schéma & Migration
- [ ] T401: Ajouter `HelpDetails`, `OpportunityDetails` et `Recommendation` dans Prisma.
- [ ] T402: Exécuter la migration Prisma et générer le client TypeScript mis à jour.
- [ ] T403: Écrire les fonctions utilitaires de validation Zod pour les formulaires d'entraide et d'opportunités.

## Phase 2 : Entraide Humaine (« J'ai besoin d'aide »)
- [ ] T404: Développer la Server Action `publishHelpRequest` créant le post et son enregistrement `HelpDetails`.
- [ ] T405: Développer la Server Action `markHelpSolution` avec vérification des droits de l'auteur.
- [ ] T406: Créer les composants UI `HelpRequestCard` et `SolutionBadge` avec coloration dédiée.

## Phase 3 : Opportunités & Recommandations de Pairs
- [ ] T407: Implémenter la Server Action `publishOpportunity` avec gestion des types de contrat et salaires.
- [ ] T408: Créer la page d'exploration des offres (`src/app/(platform)/opportunities/page.tsx`).
- [ ] T409: Implémenter le flux de recommandation (`requestRecommendation` et `respondRecommendation`).
- [ ] T410: Créer les composants `RecommendationList` sur la page de profil et la modale `ApplyModal`.

## Phase 4 : Filtres & Recherche
- [ ] T411: Ajouter un filtre d'onglets rapides sur le fil d'accueil : Tous / Projets / Entraide / Opportunités.
- [ ] T412: Mettre en place un indicateur visuel de réputation basé sur les recommandations validées.

## Phase 5 : Tests & Validation
- [ ] T413: Écrire les tests unitaires pour la logique de marquage de solution et permissions.
- [ ] T414: Écrire le test E2E Playwright pour le dépôt d'une offre et la candidature via profil.
