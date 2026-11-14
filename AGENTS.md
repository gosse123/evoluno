# AGENTS.md — Evoluno

Concours projet: plateforme sociale pour développeurs africains, reliée à GitHub/GitLab.
Docs et specs sont en **français** — suivre ce langage pour specs, comments de feature et documents.

## Structure du repo

- Racine = gouvernance SDD uniquement : `specs/`, `design/`, `.specify/`, `README.md`.
- **L'app Next.js vit dans `evoluno/`** — toutes les commandes npm s'exécutent depuis ce répertoire.
- `evoluno/src/app/` est le point d'entrée App Router. Alias `@/*` → `evoluno/src/` (structure `src/` conforme au plan 001 §5 : `src/app`, `src/lib`, `src/components`).

## Commandes (depuis `evoluno/`)

```bash
npm run dev        # serveur dev (Turbopack)
npm run lint       # eslint uniquement
npx next typegen   # types Next générés (LayoutProps…) — requis avant tsc sur clone frais
npx tsc --noEmit   # typecheck — pas de script npm dédié
npm test           # tests unitaires (vitest)
npm run build      # vérification finale
```

- **Ordre de vérif : `lint → next typegen → tsc --noEmit → npm test → build`.** Piège : `tsc` échoue sur un clone frais ou après `rm -rf .next` (types `LayoutProps`/`PageProps` absents) — `npx next typegen` les régénère sans build complet. Tests unitaires Vitest câblés (`src/lib/*.test.ts`) ; Playwright est prévu dans les specs, pas encore câblé.
- **Base de données** : un conteneur Docker `postgres:16` (nom `evoluno-db`, identifiants dev) est requis pour `npx prisma migrate dev` — commande de démarrage dans `.env.example`. Copier `cp .env.example .env` puis y mettre `ENCRYPTION_SECRET_KEY` (`openssl rand -hex 32`) avant le premier lancement.
- Package manager : **npm** (`package-lock.json`). Les specs disent `pnpm` — le lockfile a raison.
- Pas de CI, pas de pre-commit. La vérification locale est tout ce qui existe.
- Stack actuelle : Next.js **16.4.6** (le root README dit « Next.js 15 » — faux), React 19.3, Tailwind **v4**, TS strict, ESLint 9 flat config, **Prisma 6** (ligne stable — `npm latest` pointe vers un RC 8), Vitest 5.
- Node : **22 via nvm** (`source ~/.nvm/nvm.sh`) — Next 16 exige ≥ 20.9, le Node système est en 18.

## Next.js 16 : lire avant d'écrire du code

- `evoluno/AGENTS.md` contient un bloc auto-généré (règles agent + docs) réécrit par `next dev` : **le conserver dans les diffs**, ne pas le supprimer.
- Docs de la version installée : `evoluno/node_modules/next/dist/docs/` — les APIs Next 16 diffèrent de ce que tu connais. Lire le guide concerné avant d'écrire une route/server action.
- `next.config.ts` active `cacheComponents` + `partialPrefetching`, et charge Tailwind via une règle Turbopack (`@tailwindcss/turbopack`).
- Tailwind v4 = config **CSS-first** : pas de `tailwind.config`, tout dans `app/globals.css` (`@import "tailwindcss"` + `@theme inline`).

## SDD : la spec est la source de vérité

- Chaque feature = `specs/NNN-nom/{spec.md, plan.md, tasks.md}`. Le code doit correspondre au spec + plan validés ; avancer sur les cases `tasks.md` et cocher `[x]`.
- **La Constitution lie** (`.specify/memory/constitution.md`) — écarts à justifier en PR/commit. Contraintes non négociables qui surprennent le plus :
  - **Article I** : ne jamais dupliquer GitHub/GitLab — pas d'éditeur de code, pas de tickets, pas de création de PR/forks, pas de stockage de code (métadonnées publiques seulement).
  - **Article II** : OAuth **read-only** ; zéro publication sans consentement — les célébrations d'activité restent brouillons (`status: draft`, `is_published`) jusqu'à validation utilisateur ; dépôts privés jamais exposés sans autorisation explicite.
  - **Article III** : chaque carte de projet/appel à contributeur affiche la **politique IA du mainteneur** (champ obligatoire).
  - **Article VI** : tous les tokens OAuth chiffrés **AES-256-GCM** (futur `lib/crypto.ts`), clé en env vars ; révocation + suppression compte en un clic.
  - **Article VII** : monolithe modulaire, pas de microservices ni d'abstractions spéculatives.
  - TDD exigé pour les modules critiques (crypto, adaptateurs, calculs).
- Enveloppe attendue : mobile-first, bundle léger (Article V) — cible 360px / connexions lentes.

## Design

- Maquettes : `design/preview.html` (29 écrans, ouvrir dans un navigateur), logos dans `design/assets/`. Suivre ces écrans plutôt qu'inventer une UI.
