# Ori

[![CI](https://github.com/govpf/ori/actions/workflows/ci.yml/badge.svg)](https://github.com/govpf/ori/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Design system mutualisé des services administratifs de la Polynésie française.

Ori est un design system **multi-framework** (React, Angular, HTML pur) bâti
autour d'une source unique de design tokens. La même apparence visuelle est
garantie sur toutes les cibles, quel que soit l'outil consommateur.

## Architecture

Monorepo pnpm organisé autour de trois axes : **tokens**, **styles**, **composants**.

```
ori/
├── packages/
│   ├── tokens/              # Source : design tokens (W3C DTCG via Style Dictionary)
│   ├── tailwind-preset/     # Preset Tailwind généré depuis les tokens
│   ├── css/                 # Bundle ori.css drop-in (statique)
│   ├── react/               # Composants React / Next.js
│   ├── angular/             # Composants Angular standalone
│   └── docs/                # MDX transverse partagé entre les Storybooks
└── apps/
    ├── ori-site/            # Site documentaire public (Astro)
    ├── storybook-react/     # Storybook test interactif React
    ├── storybook-angular/   # Storybook test interactif Angular
    ├── playground-static/   # Démo HTML pur (intégration GLPI, emails)
    ├── playground-react/    # Démo Vite + React
    ├── playground-angular/  # Démo Angular CLI
    └── demo-portail/        # Démo end-to-end portail usager
```

### Chaîne de production

```
tokens/*.json (DTCG)
        │
        ├──► Style Dictionary ──► tailwind-preset/   (preset Tailwind + plugin .ori-*)
        │                          │
        │                          ├──► react/       (composants TSX)
        │                          ├──► angular/     (composants ng-packagr)
        │                          └──► css/         (ori.css statique)
        │
        └──► CSS variables ──► tokens/build/css/tokens.css  +  tokens/src/dark.css
```

## Livrables publishables

| Cible                         | Package                                             | Comment ça se consomme                    |
| ----------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Next.js / React / Vite        | `@govpf/ori-react` + `@govpf/ori-tailwind-preset`   | `npm install`, import composants + preset |
| Angular ≥ 20                  | `@govpf/ori-angular` + `@govpf/ori-tailwind-preset` | idem, composants standalone               |
| Site statique / GLPI / emails | `@govpf/ori-css`                                    | `<link rel="stylesheet" href="ori.css">`  |

Tous publiés sous le scope `@govpf/`. Voir le site documentaire pour la liste
complète des composants disponibles et leurs API.

## Documentation

- **Site documentaire** (à venir) : <https://ori.gov.pf>
- **Storybooks de test interactif** : déployés en sous-chemins du site documentaire
- **Décisions de design** et **stratégie d'ouverture** : pages MDX dans `packages/docs/`
- **Roadmap publique** : <https://github.com/orgs/govpf/projects/3> (Backlog, Up next, In progress, Done ; filtres par catégorie, effort, source)

## Démarrer

### Prérequis

- **Node.js** ≥ 20.11 (la CI tourne en Node 24 LTS)
- **pnpm** ≥ 9 (testé avec 10.29 - `corepack enable && corepack prepare pnpm@latest --activate`)
- **just** (optionnel mais recommandé - alternative cross-platform à `make`)

### Installer `just`

`just` est un runner de commandes simple qui remplace `make` et fonctionne
nativement sur Windows, macOS et Linux.

| OS                    | Commande                                                        |
| --------------------- | --------------------------------------------------------------- |
| Windows               | `winget install Casey.Just` &nbsp;ou&nbsp; `scoop install just` |
| macOS                 | `brew install just`                                             |
| Linux (Debian/Ubuntu) | `sudo apt install just` (≥ 22.10) ou `cargo install just`       |
| Linux (Arch)          | `pacman -S just`                                                |
| Tous (via Rust)       | `cargo install just`                                            |

> Si tu ne peux pas installer `just`, toutes les recettes délèguent à `pnpm` -
> tu peux toujours utiliser les commandes `pnpm` équivalentes (colonne de
> droite des tableaux ci-dessous).

### Premier setup

```bash
git clone https://github.com/govpf/ori.git
cd ori
just setup        # ou : pnpm install && pnpm -r --filter "./packages/*" build
```

### Lancer les apps en développement

```bash
just storybook-react       # Storybook React,   http://localhost:6006
just storybook-angular     # Storybook Angular, http://localhost:6008
just demo-portail          # Demo portail end-to-end, http://localhost:5174
just site                  # Site Astro, http://localhost:4321
```

## Commandes

Depuis la racine `ori/`. `just` liste les recettes disponibles avec un simple
`just`. Référence concise :

#### Installation et nettoyage

| Recette            | Équivalent pnpm    | Description                                           |
| ------------------ | ------------------ | ----------------------------------------------------- |
| `just install`     | `pnpm install`     | Installer toutes les dépendances                      |
| `just clean`       | `pnpm clean`       | Supprimer `node_modules`, `dist`, `build`, `.angular` |
| `just clean-cache` | `pnpm clean:cache` | Purger les caches Vite / Webpack / Angular CLI        |
| `just fresh`       |                    | Réinstallation complète depuis zéro                   |

#### Builds

| Recette               | Équivalent pnpm      | Description                                             |
| --------------------- | -------------------- | ------------------------------------------------------- |
| `just build`          | `pnpm build`         | Tout compiler (tokens → preset → css → react → angular) |
| `just build-tokens`   | `pnpm build:tokens`  | Régénérer les tokens (CSS, SCSS, JS, preset Tailwind)   |
| `just build-css`      | `pnpm build:css`     | Compiler `ori.css` + `ori.min.css` + `tokens.css`       |
| `just build-react`    | `pnpm build:react`   | Compiler les composants React                           |
| `just build-angular`  | `pnpm build:angular` | Compiler la lib Angular (ng-packagr)                    |
| `just rebuild-tokens` |                      | Régénération + purge des caches après modif tokens      |

#### Storybooks et démos

| Recette                        | Équivalent pnpm                | Description                               |
| ------------------------------ | ------------------------------ | ----------------------------------------- |
| `just storybook-react`         | `pnpm storybook:react`         | Storybook React (http://localhost:6006)   |
| `just storybook-angular`       | `pnpm storybook:angular`       | Storybook Angular (http://localhost:6008) |
| `just build-storybook-react`   | `pnpm build:storybook:react`   | Storybook React → site statique           |
| `just build-storybook-angular` | `pnpm build:storybook:angular` | Storybook Angular → site statique         |

#### Qualité

| Recette             | Équivalent pnpm     | Description                      |
| ------------------- | ------------------- | -------------------------------- |
| `just format`       | `pnpm format`       | Formater tout le code (Prettier) |
| `just format-check` | `pnpm format:check` | Vérifier le format sans modifier |

## Conventions

### Tokens

- Format **W3C Design Tokens Community Group** (DTCG) - fichiers `packages/tokens/src/*.json`.
- Deux fichiers : `core.json` (primitives - palettes, échelles) et `semantic.json` (alias - `brand.primary`, `surface.base`…).
- **Règle d'or** : un composant ne consomme **jamais** un token primitif (`color.primary.500`) - toujours un alias sémantique (`color.brand.primary`). Cela permet de changer de palette ou de basculer en thème sombre sans toucher au code des composants.

### Composants

- Stylés via **classes sémantiques** (`.ori-btn`, `.ori-card`…) définies dans `packages/tailwind-preset/src/plugin-components.js`.
- Les classes consomment des **variables CSS** (`var(--color-brand-primary)`) - bascule de thème dynamique sans recompilation.
- **Aucun utilitaire Tailwind inline** dans le JSX/template du DS. Les utilitaires restent disponibles pour la mise en page applicative dans les projets consommateurs.
- React : composants standards avec `forwardRef`, `clsx` pour les classes.
- Angular : composants `standalone`, `ChangeDetectionStrategy.OnPush`, `ViewEncapsulation.None`.

### Versions Angular

Toutes les dépendances `@angular/*` sont **forcées sur une version unique**
via `pnpm.overrides` dans le `package.json` racine. Sans cette règle, pnpm
peut installer plusieurs versions mineures côte à côte, ce qui provoque des
erreurs runtime cryptiques parce que les composants sont compilés contre une
version et exécutés contre une autre.

## Thème sombre

Le DS supporte light/dark via une seule règle CSS : ajouter `data-theme="dark"`
(ou la classe `.dark-theme`) sur `<html>`.

```html
<html data-theme="light">
  ...
</html>
<!-- clair (défaut) -->
<html data-theme="dark">
  ...
</html>
<!-- sombre -->
```

Côté Storybook, un toggle dans la barre d'outils bascule en live. Côté
playgrounds et demo-portail, un bouton dédié switche l'attribut.

## Tester la CI localement

Le repo embarque un wrapper Docker pour exécuter les workflows GitHub Actions
sans les pousser :

```bash
./tools/act/run.sh push                  # tout le pipeline CI
./tools/act/run.sh push -j format        # un seul job
```

Voir [tools/act/README.md](./tools/act/README.md) pour les détails.

## Contribuer

Les contributions sont les bienvenues, en particulier sur les sujets
transverses (accessibilité, performance, documentation, correctifs de bugs).

- [Guide du contributeur](./CONTRIBUTING.md)
- [Code de conduite](./CODE_OF_CONDUCT.md)
- [Politique de sécurité](./SECURITY.md)

## Licence

[MIT](./LICENSE) - Copyright © 2026 Gouvernement de la Polynésie française.
