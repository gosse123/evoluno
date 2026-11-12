# 05 — Intégration GitHub / GitLab

## Principes

1. **Lecture d'abord.** La plateforme lit l'activité, elle n'écrit pas dans les dépôts.
2. **Public par défaut.** Seuls les projets publics sont utilisés par défaut.
3. **Consentement.** Aucune publication automatique sans accord de l'utilisateur, qui peut la modifier ou la refuser.
4. **Pas de stockage du code.**
5. **Le travail se fait sur GitHub/GitLab**, avec les outils et l'IA habituels de l'utilisateur.

## Cas d'usage

1. **Connexion et profil vivant** : connexion avec GitHub ou GitLab, profil alimenté par les projets, langages et activité.
2. **Publications automatiques** : quand un projet est publié, qu'une version sort ou qu'une contribution est acceptée, la plateforme propose une publication prête à poster. Cela réduit le problème du fil vide.
3. **Cartes riches** : un lien GitHub/GitLab collé dans une publication devient une carte (nom, langage, description, activité récente, politique IA si indiquée, bouton « Voir sur GitHub »).
4. **Appel à contributeurs** : le propriétaire d'un projet publie un appel avec étiquettes et lien vers les tickets sur GitHub. Les membres répondent ou cliquent sur « Je veux aider », puis travaillent sur GitHub.
5. **Reconnaissance des contributions** : quand une PR est acceptée, elle apparaît sur le profil et peut devenir une publication de célébration.
6. **Demande de retours** : publication avec carte du projet ou lien vers la PR. Les relecteurs commentent sur la plateforme et, s'ils le souhaitent, sur GitHub.
7. **Politique IA du projet** : champ affiché sur la carte du projet pour éviter l'envoi de PR à un projet qui l'interdit.

## Notes techniques

### GitHub App plutôt qu'OAuth App
D'après la documentation GitHub, les GitHub Apps sont préférées : permissions fines, contrôle sur les dépôts accessibles, jetons à courte durée de vie. Elles peuvent aussi agir au nom d'un utilisateur. Une OAuth App doit demander le droit large « repo » pour accéder aux tickets et PR.
Source : https://docs.github.com/en/enterprise-server@3.16/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps
(Documentation GitHub Enterprise Server : à recouper avec la documentation de github.com.)

### À vérifier par l'équipe technique
- Événements de webhook pour détecter une PR fusionnée, une nouvelle version, un dépôt rendu public (GitHub et GitLab).
- Côté GitLab : OAuth2 avec scopes limités et webhooks. Non vérifié dans cette phase.
- Quotas des API et impact sur le nombre d'utilisateurs.
- Comment détecter ou déclarer la politique IA d'un projet (champ déclaratif par le propriétaire, lecture du fichier de contribution, ou les deux).

### Sécurité
- Chiffrer les jetons stockés.
- Permettre la révocation et la suppression des données à la déconnexion.
- Demander le minimum de permissions.

## Pourquoi la plateforme ne crée pas de PR

Les mainteneurs font face à un afflux de contributions générées par IA et de mauvaise qualité :
- Une enquête de la Linux Foundation (20 octobre 2026) estime à 25 % la part de PR de mauvaise qualité générées par IA, 31 % dans les gros projets. Ce sont des estimations de mainteneurs.
  Source : https://www.linuxfoundation.org/blog/navigating-open-source-software-development-in-the-generative-ai-era-balancing-velocity-and-community-health
- Des projets ont restreint ou fermé les contributions externes (Ghostty, tldraw).
  Sources : https://dev.to/pickuma/why-open-source-maintainers-are-rejecting-ai-generated-pull-requests-12ac et https://www.telerik.com/blogs/is-ai-overwhelming-open-source
- GitHub aurait donné aux mainteneurs de nouveaux contrôles pour limiter les PR externes (août 2026). Source secondaire, à confirmer sur une source officielle GitHub : https://cryptobriefing.com/github-restricts-pull-requests-ai-slop/

Notre plateforme ne doit pas amplifier ce problème. Sa valeur est de rendre les contributions **visibles et valorisées**, sans gérer le processus.

## Risques propres à l'intégration

- Dépendance aux API et aux règles de GitHub et GitLab, qui peuvent changer.
- Garde des jetons d'accès : responsabilité de sécurité.
- Projets privés exclus par défaut.
