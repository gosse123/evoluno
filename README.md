# Evoluno — Plateforme d'échange africaine pour les développeurs

> **Thème du concours :** *« Construire la plateforme d'échange africaine, pour les devs, par les devs »*  
> **Méthodologie :** **Specification-Driven Development (SDD)** via [GitHub Spec Kit](https://github.com/github/spec-kit)  
> **Statut du projet :** Spécifications validées — Prêt pour l'implémentation (Phase 1)

---

## 💡 En une phrase

Un réseau social pour les développeurs africains, relié à GitHub et GitLab.

> **« GitHub et GitLab sont l'endroit où l'on travaille. Evoluno est l'endroit où l'on se montre, où l'on se retrouve et où l'on se fait reconnaître. »**

---

## 🎯 Vision & Positionnement

Les étudiants et développeurs juniors d'Afrique francophone (Burkina Faso et pays voisins) manquent souvent de réseau, de visibilité et d'opportunités formelles. Paradoxalement, ils travaillent ou apprennent sur GitHub sans que leur travail ne soit valorisé localement.

**Ce qu'Evoluno apporte :**
* **Une vitrine sociale vivante** au-dessus de GitHub/GitLab, sans concurrencer les outils de travail.
* **L'accueil des débutants** : un profil valorisant dès l'inscription, même avec peu ou pas de dépôts (« gestion du profil vide »).
* **Des appels à contributeurs clairs** : pour savoir enfin sur quel projet faire ses premières armes, avec un affichage obligatoire de la politique vis-à-vis du code assisté par IA.
* **La reconnaissance des contributions** : célébration publique et consentie dès qu'une Pull Request est fusionnée.
* **Le réseau et les opportunités réelles** : diffusion de stages/missions et recommandations directes vérifiées entre pairs.

**Ce qu'Evoluno n'est PAS :**
* ❌ Pas d'éditeur de code web (chacun code dans son IDE avec ses outils et son IA).
* ❌ Pas de gestionnaire de tickets ni de stockage de code (délégué à GitHub/GitLab).
* ❌ Pas de création de forks ou de PRs à la place de l'utilisateur.

---

## 🛠 Stack Technique Cible

| Domaine | Technologie | Justification |
| :--- | :--- | :--- |
| **Framework Fullstack** | **Next.js 15 (App Router, React 19, TypeScript)** | Performance optimale, Server Actions, SEO et expérience mobile fluide. |
| **Styling & UI** | **Tailwind CSS + Radix UI / Lucide Icons** | Interface ultra-légère, accessible et économe en bande passante mobile. |
| **Base de données** | **PostgreSQL 16+** | Modèle relationnel robuste (profils, posts, réactions, relations sociales). |
| **ORM** | **Prisma ORM** | Typage TypeScript de bout en bout et migrations sécurisées. |
| **Authentification** | **Auth.js (NextAuth v5)** | OAuth natif GitHub et GitLab avec sessions sécurisées HttpOnly. |
| **Sécurité des Tokens** | **Node.js Crypto (AES-256-GCM)** | Chiffrement symétrique au repos de tous les jetons OAuth stockés. |
| **Intégration Git** | **Octokit (GitHub API) + Webhooks HMAC** | Détection en temps réel des PR fusionnées et lecture des métadonnées publiques. |

---

## 🎨 Design System, Logo & Maquettes FigCraft (`design/`)

Le projet dispose d'une identité visuelle complète et de maquettes pour tous les écrans dans [`design/`](design/) :
* **Logo & Icône Vectoriels** : [`design/assets/logo.svg`](design/assets/logo.svg) & [`design/assets/logo-icon.svg`](design/assets/logo-icon.svg).
* **Visuels de Marque & Illustration Hero** : [`design/assets/evoluno-logo-showcase.jpg`](design/assets/evoluno-logo-showcase.jpg) & [`design/assets/evoluno-hero-illustration.jpg`](design/assets/evoluno-hero-illustration.jpg).
* **Fichier FigCraft Natif** : [`design/evoluno.figcraft`](design/evoluno.figcraft) (arbre complet de nœuds `document.json` avec 29 écrans importable dans FigCraft).
* **Aperçu Web Interactif** : Ouvrez simplement [`design/preview.html`](design/preview.html) dans votre navigateur pour tester les **29 écrans du workflow complet** répartis en 9 phases (mode Canvas global et mode Écran par Écran avec navigation au clavier).

---

## 📋 Méthodologie SDD & Spécifications (`specs/`)

Le projet est régi par une **Constitution** stricte ([.specify/memory/constitution.md](.specify/memory/constitution.md)) et découpé en 5 spécifications complètes comprenant chacune sa spécification métier (`spec.md`), son plan d'architecture (`plan.md`) et sa checklist de tâches de développement (`tasks.md`) :

| # | Module | Spécification | Plan Technique | Checklist Tâches |
|---|:---|:---|:---|:---|
| **001** | **Auth & Profil Vivant** | [spec.md](specs/001-auth-profile/spec.md) | [plan.md](specs/001-auth-profile/plan.md) | [tasks.md](specs/001-auth-profile/tasks.md) |
| **002** | **Fil Social & Posts** | [spec.md](specs/002-social-feed-posts/spec.md) | [plan.md](specs/002-social-feed-posts/plan.md) | [tasks.md](specs/002-social-feed-posts/tasks.md) |
| **003** | **Cartes Projets & Appels Contribs** | [spec.md](specs/003-projects-contributions/spec.md) | [plan.md](specs/003-projects-contributions/plan.md) | [tasks.md](specs/003-projects-contributions/tasks.md) |
| **004** | **Célébrations d'Activité** | [spec.md](specs/004-activity-celebrations/spec.md) | [plan.md](specs/004-activity-celebrations/plan.md) | [tasks.md](specs/004-activity-celebrations/tasks.md) |
| **005** | **Entraide & Opportunités** | [spec.md](specs/005-help-and-opportunities/spec.md) | [plan.md](specs/005-help-and-opportunities/plan.md) | [tasks.md](specs/005-help-and-opportunities/tasks.md) |

---

## 🚀 C'est quoi la suite ? (Feuille de Route)

Le cadrage et les spécifications étant terminés, le projet entre en **phase de réalisation technique** selon les étapes suivantes :

### Étape 1 : Initialisation du socle applicatif *(Immédiat)*
* Initialiser l'application Next.js 15 avec TypeScript et Tailwind CSS dans le répertoire.
* Configurer le fichier de variables d'environnement (`.env.example`).
* Mettre en place Prisma ORM avec le schéma PostgreSQL initial (`User`, `Account`, `Profile`, `UserTech`).
* Implémenter le module de chiffrement AES-256-GCM (`src/lib/crypto.ts`) pour protéger les futurs tokens GitHub.

### Étape 2 : Prototype MVP — Authentification & Profil Vivant *(Module 001)*
* Configurer Auth.js avec le provider GitHub OAuth.
* Créer l'écran de connexion et l'onboarding express pour les débutants au profil vide.
* Afficher la page de profil vivant avec récupération des métadonnées publiques GitHub.

### Étape 3 : Cœur Social & Partage de Projets *(Modules 002 & 003)*
* Mettre en place le fil d'actualité (Abonnements & Découverte).
* Développer le compositeur de post avec prise en charge du Markdown et des snippets de code.
* Intégrer les cartes riches de dépôts GitHub et le formulaire « Je cherche des contributeurs » avec politique IA.

### Étape 4 : Célébrations, Entraide & Démo Concours *(Modules 004 & 005)*
* Configurer la route webhook GitHub pour suggérer automatiquement la célébration des PRs fusionnées.
* Ajouter le formulaire de demande d'aide et les opportunités de stages/missions.
* Préparer les données de démonstration (seed) et le scénario de pitch pour le jury.
