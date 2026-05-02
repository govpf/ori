# dev-all

Orchestrateur dev local : lance les 7 apps Ori en parallèle avec live-reload natif et un dashboard HTML pour voir leurs URLs et leur statut.

Deux modes au choix :

| Mode       | Commande          | Quand l'utiliser                                                                           |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------ |
| **Natif**  | `pnpm dev:all`    | Itération rapide, machine puissante, pas de souci de zombies pnpm/node                     |
| **Docker** | `pnpm dev:docker` | Kill global propre garanti (`docker compose down`), environnement reproductible, isolation |

## Pourquoi

Avant cet outil, vérifier visuellement une modif côté DS demandait :

1. push une PR
2. attendre que la CI passe (~3 min)
3. merger
4. attendre le déploiement Pages (~5 min)
5. faire un hard refresh pour purger le cache Cloudflare

Total : 8 à 10 minutes par itération. Avec `dev-all`, toutes les apps tournent en local avec hot reload : une modif sur `packages/react/src/components/Button/Button.tsx` recharge **immédiatement** la story Button du Storybook, son apparition dans la démo portail, et son rendu dans le playground React.

## Mode natif

```bash
pnpm dev:all
```

Lance 7 process Node directement sur la machine via [`concurrently`](https://github.com/open-cli-tools/concurrently). Ouvre <http://localhost:3000> pour le dashboard.

`Ctrl+C` propage en théorie aux 7 process enfants. Sur Windows en pratique, certains process pnpm/node peuvent rester orphelins. Solutions :

- Si quelques process subsistent, identifier les ports occupés (`netstat -ano | findstr :6006`) et les kill (`taskkill /PID <pid> /F`).
- Ou basculer sur le mode Docker (cf. ci-dessous), qui garantit le kill global.

## Mode Docker

```bash
pnpm dev:docker            # premier lancement : build l'image + boot
                           # lancements suivants : reboot direct
pnpm dev:docker:down       # arrêt propre (équivalent Ctrl+C)
pnpm dev:docker:rebuild    # rebuild sans cache (après modif Dockerfile)
```

Architecture :

- `Dockerfile` (Node 24 + pnpm 10.29.3, mêmes versions que la CI)
- `docker-compose.yml` avec un service unique qui run `pnpm dev:all` à l'intérieur
- Bind mount du repo en `/workspace` avec `chokidar` en mode polling pour le live-reload
- Volumes nommés pour `node_modules` et le store pnpm (évite les conflits FS Windows et préserve l'install entre rebuilds)

Le premier `pnpm dev:docker` prend 3 à 5 min (build de l'image + `pnpm install` dans le volume). Les lancements suivants sont rapides (~30 s).

`pnpm dev:docker:down` tue le conteneur d'un coup propre. Pas de zombies, pas de ports orphelins.

## Apps lancées

| Port | App                    | Tech                       | Cas d'usage                                                       |
| ---- | ---------------------- | -------------------------- | ----------------------------------------------------------------- |
| 3000 | Dashboard              | HTML statique              | Index des apps avec statuts en temps réel                         |
| 4173 | Example landing        | HTML pur + `ds.css`        | Landing institutionnelle (Direction du Patrimoine)                |
| 4174 | Example mires Keycloak | HTML pur + `ds.css`        | Référence des 7 écrans d'authentification (login, register, OTP…) |
| 4321 | Site Astro             | Astro + `ori-react`        | Documentation principale (`ori.gov.pf`)                           |
| 5173 | Example agent          | React + Vite + `ori-react` | Back-office d'instruction de dossiers (pendant agent du portail)  |
| 5174 | Demo portail           | React + Vite + `ori-react` | Démo end-to-end portail usager                                    |
| 6006 | Storybook React        | Storybook HMR              | Catalogue interactif des composants React                         |
| 6008 | Storybook Angular      | Storybook HMR              | Catalogue interactif des composants Angular                       |

## Architecture du mode natif

- `dev.mjs` : invoque `concurrently` via son API JS pour éviter les pièges de quoting des `pnpm --filter X dev` sur Windows. Génère `dashboard/apps.json` au démarrage.
- `serve-dashboard.mjs` : mini serveur HTTP Node natif qui sert `dashboard/` sur le port 3000.
- `dashboard/index.html` + `style.css` + `app.js` : page HTML statique qui charge `apps.json` puis ping chaque app toutes les 3 s via `fetch` no-cors. Statut up / starting / down avec délai de grâce de 60 s pour les bundlers en cold start.

## Architecture du mode Docker

- `Dockerfile` : image Node 24 + pnpm 10.29.3 + outils utilitaires.
- `entrypoint.sh` : run `pnpm install --frozen-lockfile` au premier boot (si node_modules vide), puis `exec pnpm dev:all`. Le `exec` remplace le shell par Node pour que SIGTERM Docker arrive directement à concurrently.
- `docker-compose.yml` : 1 service unique, ports exposés, volumes pour code source (bind mount) et node_modules (volume nommé).

## Limites assumées

- **Premier démarrage** : 30 s à 5 min selon le mode (Vite + Webpack + Angular CLI + Storybook bundlent en parallèle, c'est lourd au cold start).
- **Conflit de port** : si un port est déjà occupé sur l'host, l'app concernée plante. Le dashboard la marque « indisponible ». Tuer le process responsable et relancer.
- **Mémoire** : 7 apps en parallèle = ~6 à 8 Go de RAM occupée au repos. Sur une machine modeste, lancer seulement 2 ou 3 apps via les scripts ciblés (cf. ci-dessous).
- **Windows + Docker** : le HMR via bind mount + polling ajoute ~1 s de latence vs natif. Acceptable pour la plupart des modifs ; si tu veux du HMR instantané, basculer en mode natif.

## Pour lancer une seule app

Si tu n'as besoin que d'une app en particulier, utilise les scripts ciblés du root `package.json` :

```bash
pnpm storybook:react       # Storybook React, port 6006
pnpm storybook:angular     # Storybook Angular, port 6008
pnpm demo:portail          # Demo portail (usager), port 5174
pnpm example:agent         # Example agent (back-office), port 5173
pnpm example:landing       # Example landing institutionnelle, port 4173
pnpm example:keycloak      # Example mires Keycloak, port 4174
```
