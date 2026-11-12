# 06 — Parcours utilisateur

> Statut : **proposition à valider par l'équipe.** Les critères de réussite sont des objectifs à vérifier lors des tests, pas des faits.

## Personnages

- **Aminata** : étudiante en informatique, junior, peu de projets sur GitHub.
- **Karim** : passionné qui construit avec l'IA, utilise très peu git.
- **Moussa** : développeur qui maintient un projet open source.
- **Fatou** : développeuse expérimentée, active sur la plateforme.

---

## 1. Connexion et profil

**Situation :** Aminata découvre la plateforme.

1. Elle clique sur « Se connecter avec GitHub » (ou GitLab).
2. Elle voit une page d'autorisation en français, lecture seule.
3. Son profil est pré-rempli : projets, langages, activité.
4. Son profil est presque vide : la plateforme lui propose de choisir niveau, centres d'intérêt et langue.
5. Elle voit des personnes et des publications à suivre.

**Objectif :** profil utile en moins de 2 minutes, même avec peu d'activité.
**Cas particulier :** autorisation refusée → profil manuel, sans données GitHub.

## 2. Publier, commenter, liker, s'abonner

**Situation :** Aminata veut participer.

1. Elle suit quelques personnes depuis les suggestions.
2. Son fil affiche leurs publications.
3. Elle like et commente une publication de Fatou.
4. Elle publie un message sur ce qu'elle apprend.
5. Fatou reçoit une notification et répond.

**Objectif :** une première interaction (like, commentaire ou abonnement) dans les premières minutes.

## 3. Publication automatique depuis l'activité

**Situation :** Karim publie un projet sur GitHub.

1. La plateforme détecte le nouveau projet public.
2. Elle propose une publication prête à poster.
3. Karim la modifie ou la refuse.
4. S'il l'accepte, elle apparaît dans le fil avec une carte du projet.

**Objectif :** l'utilisateur comprend que rien n'est publié sans son accord.

## 4. Appel à contributeurs

**Situation :** Moussa cherche de l'aide pour son projet ; Aminata veut contribuer.

1. Moussa publie « Je cherche des contributeurs », avec carte du projet, étiquettes (langage, niveau, type d'aide) et lien vers les tickets GitHub.
2. Aminata voit la publication dans son fil ou dans la découverte.
3. Elle clique sur « Je veux aider » : un commentaire ou un échange s'ouvre avec Moussa.
4. Elle clique sur « Ouvrir sur GitHub » et travaille avec ses outils habituels, y compris son IA.
5. Elle ouvre sa PR sur GitHub.

**Objectif :** trouver un projet adapté et passer à l'action en moins de 2 minutes.
**Cas particulier :** le projet indique qu'il n'accepte pas les contributions assistées par IA → la carte l'affiche clairement avant le clic.

## 5. Contribution acceptée

**Situation :** la PR d'Aminata est fusionnée.

1. La plateforme détecte la fusion (compte GitHub lié).
2. Elle propose à Aminata une publication de célébration.
3. Si elle accepte, la publication apparaît avec la carte du projet.
4. Des membres like et commentent.
5. La contribution s'ajoute à son profil.

**Objectif :** la contribution devient visible et valorisante sans que la plateforme gère le processus.

## 6. Demander de l'aide

**Situation :** Aminata est bloquée.

1. Elle publie « J'ai besoin d'aide », avec la carte du projet si besoin.
2. Des membres commentent.
3. Elle marque une réponse comme utile.

**Objectif :** une première réponse humaine dans un délai raisonnable (à définir avec les testeurs).

## 7. Opportunité et recommandation

**Situation :** une entreprise partage un stage ; Aminata veut postuler.

1. Fatou (ou un recruteur) publie une opportunité.
2. Aminata la voit, clique sur « Je suis intéressée », son profil est joint.
3. Elle demande une recommandation à un membre qui connaît son travail.
4. Ce membre accepte ou refuse.
5. La recommandation apparaît sur son profil.

**Objectif :** le principe de recommandation est compris et jugé utile.
**Cas particulier :** refus de recommandation → message neutre, sans pénalité.

## 8. Partager son projet

**Situation :** Karim a construit une application avec l'IA et veut des retours.

1. Il clique sur « Partager un projet » et colle le lien GitHub/GitLab.
2. Il précise ce pour quoi il cherche de l'aide.
3. Le projet apparaît dans le fil avec une carte.
4. Des membres commentent ou proposent leur aide.

**Objectif :** Karim reçoit au moins un retour utile d'un autre membre.
