# Implementation Tasks: Célébration des Contributions et Activité Automatisée

**Design Documents**:
- Specification: `specs/004-activity-celebrations/spec.md`
- Technical Plan: `specs/004-activity-celebrations/plan.md`

## Task Execution Guidelines
- Priorité absolue au respect du consentement utilisateur (Article II de la Constitution).
- Vérification cryptographique systématique des webhooks entrants.

---

## Phase 1 : Schéma & Infrastructure Webhook
- [ ] T301: Ajouter le modèle `ActivityEvent` dans Prisma et exécuter la migration.
- [ ] T302: Développer et tester unitairement la fonction de vérification cryptographique HMAC SHA-256 (`src/lib/github/webhook-validator.ts`).
- [ ] T303: Créer la route handler API `src/app/api/webhooks/github/route.ts` avec gestion des headers bruts.

## Phase 2 : Traitement d'Événements & Moteur de Brouillons
- [ ] T304: Implémenter le parseur d'événements GitHub (`pull_request.closed`, `release.published`).
- [ ] T305: Implémenter le service de génération de suggestions bienveillantes (`src/lib/celebration-templates.ts`).
- [ ] T306: Développer la logique d'idempotence et de mise à jour du compteur de contributions de l'utilisateur.

## Phase 3 : Interface Utilisateur & Modale de Validation
- [ ] T307: Créer le composant `CelebrationBanner` affichant les propositions en attente en haut du fil d'actualité.
- [ ] T308: Développer la modale `CelebrationModal` avec champ d'édition de texte, prévisualisation de la carte de projet et boutons « Publier » / « Ignorer ».
- [ ] T309: Implémenter les Server Actions `publishCelebration` et `dismissCelebration`.

## Phase 4 : Rendu du Post de Célébration
- [ ] T310: Créer le style visuel distinctif pour les publications de type `CELEBRATION` (confettis discrets, badge succès).
- [ ] T311: Mettre à jour l'affichage du profil pour mettre en avant les badges de PRs acceptées.

## Phase 5 : Tests & Sécurité
- [ ] T312: Écrire des tests unitaires pour le rejet des dépôts privés et des signatures corrompues.
- [ ] T313: Écrire un test d'intégration pour le flux complet : réception webhook -> notification -> modale -> post publié.
