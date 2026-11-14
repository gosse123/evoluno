# Implementation Tasks: Fil Social, Publications et Interactions

**Design Documents**:
- Specification: `specs/002-social-feed-posts/spec.md`
- Technical Plan: `specs/002-social-feed-posts/plan.md`

## Task Execution Guidelines
- Priorité à la performance mobile et à la sécurité (sanitisation stricte).
- Exécution des tâches de manière séquentielle par phase.

---

## Phase 1 : Modèles & Migrations Base de Données
- [ ] T101: Étendre le schéma Prisma avec `Post`, `Comment`, `Reaction`, `Tag`, `PostTag`, `Notification`.
- [ ] T102: Créer et exécuter la migration de base de données.
- [ ] T103: Ajouter des index optimisés pour la pagination par curseur et le filtrage des abonnements.

## Phase 2 : Logique Métier & Algorithme de Flux
- [ ] T104: Implémenter le service de sanitisation et de parsing Markdown (`src/lib/markdown.ts`) avec tests unitaires de sécurité.
- [ ] T105: Développer la Server Action `createPost` avec détection automatique des hashtags et mentions `@username`.
- [ ] T106: Développer le service de flux `getFeed` (pagination par curseur, filtres `following` vs `discovery`).
- [ ] T107: Développer la logique de réaction `togglePostReaction` avec transaction pour incrémenter `reactionsCount`.
- [ ] T108: Implémenter l'ajout de commentaires imbriqués et la création automatique de notifications.

## Phase 3 : Composants UI & Expérience Utilisateur
- [ ] T109: Construire le composant `PostComposer` avec onglet d'aperçu Markdown et sélecteur de snippets de code.
- [ ] T110: Développer le composant de carte de publication `PostCard` avec actions sociales et états optimistes.
- [ ] T111: Créer le composant `CommentSection` avec support des réponses directes aux commentaires.
- [ ] T112: Implémenter la page principale du fil (`src/app/(platform)/feed/page.tsx`) avec les onglets Abonnements/Découverte et infinite scroll.
- [ ] T113: Créer la page de notifications (`src/app/(platform)/notifications/page.tsx`) et le badge de notification dans la barre de navigation.

## Phase 4 : Modération & Signalement
- [ ] T114: Ajouter le bouton et la modal de signalement de publication abusive.
- [ ] T115: Configurer le rate limiting sur les actions de publication et de commentaire.

## Phase 5 : Tests & Vérification
- [ ] T116: Écrire les tests unitaires pour l'extraction des mentions et hashtags.
- [ ] T117: Écrire le test E2E Playwright pour le cycle de vie d'un post (création, like, commentaire, réponse).
- [ ] T118: Valider le score d'accessibilité et la conformité aux exigences de faible consommation réseau.
