# dev-all

Orchestrateur dev local : lance les 7 apps Ori en parallèle avec live-reload natif et un dashboard HTML pour voir leurs URLs et leur statut.

## Pourquoi

Avant ce script, vérifier visuellement une modif côté DS demandait :

1. push une PR
2. attendre que la CI passe (~3 min)
3. merger
4. attendre le déploiement Pages (~5 min)
5. faire un hard refresh sur le navigateur pour purger le cache CDN

Total : 8 à 10 minutes par itération, et le risque de découvrir un bug visuel après merge plutôt qu'avant.

Avec `dev-all`, toutes les apps tournent en local avec le hot-reload natif de leur framework. Une modif sur un composant DS dans `packages/react/src/components/Button/Button.tsx` recharge **immédiatement** la story Button du Storybook React, l'apparition du Button dans la démo portail, et le rendu du Button dans le playground React. Aucun push, aucun cache.

## Usage

Depuis la racine du repo :

```bash
pnpm dev:all
```

Ouvre <http://localhost:3000> pour voir le dashboard et accéder à chaque app. Ctrl+C arrête toutes les apps.

## Apps lancées

| Port | App                       | Live-reload    |
| ---- | ------------------------- | -------------- |
| 3000 | Dashboard                 | -              |
| 4173 | Playground statique       | non (statique) |
| 4200 | Playground Angular        | ng serve       |
| 4321 | Site Astro (`ori.gov.pf`) | Astro dev      |
| 5173 | Playground React          | Vite           |
| 5174 | Demo portail              | Vite           |
| 6006 | Storybook React           | Storybook HMR  |
| 6008 | Storybook Angular         | Storybook HMR  |

## Architecture

- `dev.mjs` : script orchestrateur. Génère `dashboard/apps.json` puis lance `concurrently` sur les 7 commandes.
- `serve-dashboard.mjs` : mini serveur HTTP qui sert `dashboard/` sur le port 3000.
- `dashboard/` : page HTML statique qui charge `apps.json` et pinge chaque app toutes les 3 s pour afficher son statut up / starting / down.

## Limites assumées

- **Premier démarrage** : la première fois qu'une app boot, le bundling Vite/Webpack/Storybook prend 30 s à 2 min selon la machine. Le dashboard montre « démarrage… » pendant ce temps.
- **Conflit de port** : si un port est déjà occupé (autre process lancé manuellement), l'app concernée plantera au démarrage. Le dashboard la marquera « indisponible ».
- **Mémoire** : 7 apps en parallèle = beaucoup de Node + Webpack + Vite. Compter ~6 à 8 Go de RAM occupée au repos. Sur une machine modeste, tu peux préférer lancer seulement 2 ou 3 apps via `pnpm storybook:react` + `pnpm demo:portail`.
- **Windows + WSL2** : le hot-reload natif fonctionne, mais peut être plus lent que sur Linux/macOS sur des arborescences profondes (`node_modules`).

## Pour lancer une seule app

Si tu n'as besoin que d'une app, utilise les scripts ciblés du root `package.json` :

```bash
pnpm storybook:react       # Storybook React, port 6006
pnpm storybook:angular     # Storybook Angular, port 6008
pnpm demo:portail          # Demo portail, port 5174
pnpm playground:react      # Playground React, port 5173
pnpm playground:angular    # Playground Angular, port 4200
pnpm playground:static     # Playground statique, port 4173
```
