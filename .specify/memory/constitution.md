# Constitution du Projet : Plateforme d'Échange Africaine pour Développeurs (Evoluno)

> **Version:** 1.0.0  
> **Date de Ratification:** 14 novembre 2026  
> **Statut:** En vigueur  
> **Source de référence:** [README.md](../../README.md)

---

## Préambule

Ce document définit les principes directeurs fondamentaux et non négociables pour la conception, l'architecture et le développement de la plateforme. Toute spécification (`spec.md`), plan technique (`plan.md`) ou tâche (`tasks.md`) doit respecter scrupuleusement ces articles.

---

## Principes Fondamentaux

### Article I : Complémentarité Absolue avec GitHub & GitLab (Règle d'or)
La plateforme est un **réseau social et un espace de reconnaissance professionnelle**, pas un outil de développement.
1. **Aucun éditeur de code en ligne** : La plateforme n'héberge aucun environnement d'exécution ni éditeur de code. Les développeurs travaillent dans leur IDE local ou leur environnement habituel.
2. **Aucune gestion de tickets** : La plateforme ne crée ni ne gère de système de tickets (issues). Elle référence et redirige vers les tickets hébergés sur GitHub/GitLab.
3. **Aucune création unilatérale de PR ou Fork** : La plateforme ne génère pas de Pull Requests ou de branches à la place de l'utilisateur. Le travail collaboratif s'effectue directement sur les forges logicielles d'origine.
4. **Pas de stockage de code source** : Seules les métadonnées publiques (nom du dépôt, description, langages, commits récents, statut des PR) sont lues et mises en cache temporaire.

*Application & Contrôle : Rejet strict en revue de toute fonctionnalité tentant de dupliquer les fonctionnalités natives de GitHub ou GitLab.*

---

### Article II : Lecture d'Abord et Souveraineté du Consentement
La protection de la vie privée et le contrôle par l'utilisateur sont au centre de l'expérience :
1. **Principe du moindre privilège** : Utilisation prioritaire de GitHub Apps (permissions granulaires) ou OAuth avec scopes strictement en lecture seule (`read:user`, `repo:status`, métadonnées publiques).
2. **Zéro publication sans accord** : Les événements d'activité (PR fusionnée, nouveau dépôt, nouvelle release) génèrent des **brouillons de célébration** privés. Aucune publication n'est rendue publique dans le fil sans validation explicite et modifiable par l'utilisateur.
3. **Périmètre public par défaut** : Seuls les dépôts publics sont inspectés par défaut. Les projets privés ne sont jamais exposés sans autorisation spécifique explicite.

*Application & Contrôle : Vérification systématique des formulaires de confirmation et des drapeaux de publication en base de données (`is_published`, `status: draft`).*

---

### Article III : Qualité des Contributions et Transparence IA
Dans un contexte où les mainteneurs open source sont submergés par des contributions automatisées de basse qualité :
1. **Politique IA obligatoire sur les projets** : Chaque carte de projet ou appel à contributeur doit afficher explicitement la politique du mainteneur vis-à-vis du code assisté par IA (*Accepté*, *Sous conditions*, *Interdit*).
2. **Valorisation du résultat validé** : La plateforme valorise en priorité les contributions **acceptées et fusionnées** (merged PRs) par des pairs, plutôt que le volume de commits ou d'activités artificielles.
3. **Entraide humaine ciblée** : La plateforme ne cherche pas à concurrencer les LLM sur les questions de syntaxe élémentaires, mais favorise l'entraide contextuelle, la revue de projet, l'architecture et le mentorat.

---

### Article IV : Inclusion et Gestion du « Profil Vide »
La plateforme s'adresse en premier lieu aux étudiants et développeurs juniors d'Afrique francophone (0 à 3 ans d'expérience) :
1. **Zéro pénalisation des débutants** : Un utilisateur sans historique préalable sur GitHub/GitLab doit disposer d'un profil valorisant dès l'inscription (mise en avant des technologies étudiées, centres d'intérêt, niveau d'apprentissage, objectifs).
2. **Onboarding express (< 2 minutes)** : Si les API GitHub/GitLab renvoient un profil vide ou pauvre, l'interface guide immédiatement l'utilisateur pour qualifier ses compétences et centres d'intérêt sans friction.

---

### Article V : Sobriété Numérique, Performance & Contexte Africain
L'infrastructure et le client web doivent être pensés pour les réalités de connectivité du continent :
1. **Empreinte réseau minimale** : Optimisation poussée du bundle JS, compression d'images, lazy loading systématique, payloads d'API légers.
2. **Tolérance aux connexions instables** : Gestion robuste des coupures réseau, retours visuels clairs lors des chargements, cache client optimiste.
3. **Design Mobile-First** : La consultation et les interactions sociales (likes, commentaires, lecture des flux) doivent offrir une ergonomie irréprochable sur mobile.

---

### Article VI : Sécurité des Données et Chiffrement
1. **Chiffrement des jetons** : Tous les tokens d'accès OAuth (GitHub/GitLab) doivent être chiffrés au repos à l'aide d'un algorithme robuste (AES-256-GCM) avec clé gérée via variables d'environnement sécurisées.
2. **Droit à l'oubli et révocation** : Tout utilisateur peut déconnecter son compte GitHub/GitLab, révoquer l'accès et demander la suppression intégrale de ses données personnelles de la base de données en un clic.

---

### Article VII : Simplicité d'Architecture & Anti-Abstraction
1. **Architecture monolithique modulaire** : Pour le prototype et la phase de lancement, privilégier une stack Fullstack unifiée (Next.js / Node.js avec TypeScript et PostgreSQL) plutôt qu'un éparpillement prématuré en microservices.
2. **Pas de complexité spéculative** : Utiliser les primitives des frameworks et ORM sans créer de couches d'abstraction d'avance.

---

### Article VIII : Specification-Driven Development (SDD) & Qualité
1. **Source unique de vérité** : Tout code produit doit correspondre à une spécification validée dans `specs/[feature]/spec.md` et un plan technique dans `specs/[feature]/plan.md`.
2. **Tâches atomiques et traçables** : Le développement s'exécute selon les tâches checklistées dans `specs/[feature]/tasks.md`.
3. **Tests essentiels** : Couverture par tests unitaires et d'intégration sur les flux critiques (authentification OAuth, détection et signature des webhooks, chiffrement des tokens, filtrage du fil social).

---

## Gouvernance et Amendements

- Toute modification de cette constitution nécessite un consensus au sein de l'équipe et un incrément de version (`major.minor.patch`).
- Tout écart dans une PR ou un commit par rapport à ces articles doit être justifié et documenté.
