# Feature Specification: Cartes de Projets et Appels à Contributeurs

**Feature ID**: `003-projects-contributions`  
**Created**: 2026-11-14  
**Status**: Approved  
**Priority**: P1 (Prototype Core)  
**Input Reference**: [Constitution](../../.specify/memory/constitution.md), [README.md](../../README.md)

---

## 1. Overview & Business Value

Pour résoudre le problème majeur des étudiants et juniors qui **ne savent pas où contribuer ni comment aborder l'open source**, la plateforme transforme le partage de projets en opportunité concrète de collaboration.
Les créateurs de projets peuvent poster un format dédié : **« Je cherche des contributeurs »**, avec des étiquettes claires de niveau (débutant bienvenu, tickets *good first issue*), le type d'aide attendu et la politique explicite vis-à-vis des contributions générées par IA.
Les cartes de projets s'enrichissent automatiquement des données publiques de GitHub/GitLab tout en renvoyant vers ces forges pour le travail effectif.

---

## 2. User Scenarios & Acceptance Criteria *(Mandatory)*

### User Scenario 1 : Moussa publie un appel à contributeurs
- **Acteur** : Moussa (développeur maintenant une librairie de calcul des frais de transfert d'argent en Afrique).
- **Contexte** : A besoin d'aide pour rédiger la documentation et ajouter des tests unitaires en Python.
- **Étapes** :
  1. Clique sur « Nouveau post » et choisit l'option « Chercher des contributeurs ».
  2. Colle l'URL de son dépôt public : `https://github.com/moussa/afri-pay-utils`.
  3. La plateforme extrait automatiquement le nom, la description et le langage principal.
  4. Moussa renseigne :
     - Niveau recherché : *Débutant / Premier pas bienvenu*.
     - Types d'aide recherchés : *Documentation*, *Tests unitaires*.
     - Politique IA : *Contributions assistées par IA acceptées sous condition de relecture et tests*.
     - Lien direct vers un ticket ou label GitHub : `https://github.com/moussa/afri-pay-utils/issues?q=label:good-first-issue`.
  5. Moussa valide la publication.
- **Critères d'acceptation** :
  - **Given** un lien de dépôt GitHub public valide,
  - **When** le mainteneur soumet l'appel,
  - **Then** une carte riche est générée avec les badges de niveau, le label IA clair, et un CTA « Voir les tickets sur GitHub ».

### User Scenario 2 : Aminata découvre le projet et postule pour aider
- **Acteur** : Aminata (étudiante cherchant sa première contribution open source).
- **Contexte** : Parcourt son fil de découverte filtré sur le tag `#python`.
- **Étapes** :
  1. Aminata voit l'appel à contributeurs de Moussa avec le badge vert « Débutant bienvenu ».
  2. Elle constate que la politique IA permet l'utilisation d'assistants de code.
  3. Elle clique sur le bouton « Je veux aider ».
  4. Une boîte de dialogue conviviale s'ouvre :
     - Affiche un conseil d'accueil et les bonnes pratiques de contribution.
     - Propose de laisser un commentaire d'introduction à Moussa sous le post.
     - Propose un bouton direct : « Ouvrir le projet sur GitHub ».
  5. Aminata commente pour se présenter, puis clique pour aller cloner le dépôt et lire le fichier `CONTRIBUTING.md` sur GitHub.
- **Critères d'acceptation** :
  - **Given** une carte d'appel à contributeurs,
  - **When** un junior clique sur « Je veux aider »,
  - **Then** il reçoit des instructions d'accueil sans barrière technique et est dirigé directement vers le dépôt GitHub cible.

---

## 3. Functional Requirements

- **FR-201 (Parseur d'URL GitHub / GitLab)** : Détection automatique des URLs de dépôts valides dans les publications.
- **FR-202 (Génération de Carte Riche)** : Extraction et mise en forme des données clés :
  - Nom du dépôt, propriétaire / organisation, avatar.
  - Description courte.
  - Langage principal et répartition technologique.
  - Nombre d'étoiles (stars), forks, et date du dernier commit public.
- **FR-203 (Formulaire Appel à Contributeurs)** :
  - Sélection du niveau d'accès : `Débutant`, `Intermédiaire`, `Avancé`.
  - Type de contribution souhaitée : `Documentation`, `UI / Design`, `Tests`, `Nouvelle fonctionnalité`, `Correction de bug`.
  - Politique IA déclarée : `IA Interdite`, `IA Acceptée avec relecture stricte`, `IA Libre`.
  - Lien vers les issues ciblées (filtre `good first issue` ou équivalent).
- **FR-204 (Filtres de Découverte de Projets)** : Onglet ou filtre dédié permettant aux membres de rechercher des projets par :
  - Langage (Python, Rust, JavaScript, Dart, Go, etc.).
  - Niveau débutant.
  - Pays du mainteneur (Burkina Faso, Sénégal, Côte d'Ivoire, Cameroun, etc.).
- **FR-205 (Action « Je veux aider »)** : Enregistrement de l'intérêt d'un contributeur, notification au mainteneur et guidage pas-à-pas vers GitHub.
- **FR-206 (Conformité Non-Concurrence)** : Aucun hébergement de code, aucun éditeur en ligne, aucun fork créé par la plateforme.

---

## 4. Non-Functional Requirements & Constraints

- **Mise en cache des métadonnées externes** : Les données d'un dépôt sont mises en cache en base pendant 12 heures pour limiter les appels d'API externes.
- **Temps de rendu de la carte** : Prévisualisation instantanée côté client lors de la saisie de l'URL grâce au cache.
- **Robustesse aux dépôts inexistants ou privés** : Gestion gracieuse d'erreur si l'URL est privée ou invalide (affichage d'un message d'aide sans bloquer).

---

## 5. Key Entities & Domain Models

```mermaid
erDiagram
    PROJECT ||--o{ CONTRIBUTOR_CALL : has
    USER ||--o{ PROJECT : maintains
    POST ||--o|| CONTRIBUTOR_CALL : attaches
    CONTRIBUTOR_CALL ||--o{ CONTRIBUTION_INTENT : receives

    PROJECT {
        uuid id PK
        string repo_provider
        string repo_full_name
        string repo_url
        string description
        string primary_language
        int stars_count
        int forks_count
        datetime last_commit_at
        datetime cached_at
    }

    CONTRIBUTOR_CALL {
        uuid id PK
        uuid post_id FK
        uuid project_id FK
        string experience_level
        string[] contribution_types
        string ai_policy
        string target_issues_url
    }

    CONTRIBUTION_INTENT {
        uuid id PK
        uuid call_id FK
        uuid user_id FK
        string status
        datetime created_at
    }
```

---

## 6. Edge Cases & Clarifications

1. **Dépôt supprimé ou renommé sur GitHub** : La carte affiche le dernier état connu avec une mention discrète « Informations archivées » si l'API renvoie 404.
2. **Mainteneur non inscrit sur la plateforme** : N'importe quel membre peut partager la carte d'un projet open source public avec respect de la licence, mais seuls les propriétaires déclarés peuvent publier un « Appel à contributeurs » certifié.
