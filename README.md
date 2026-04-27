# Ori

Design system de l'administration de la Polynésie française.

`Ori` est un design system **multi-framework** (React, Angular, HTML pur) bâti autour d'une source unique de design tokens. La même apparence visuelle est garantie sur toutes les cibles.

## Architecture

Monorepo pnpm organisé autour de trois axes : **tokens**, **styles**, **composants**.

```
Ori/
├── packages/
│   ├── tokens/              # Source de vérité : JSON DTCG (W3C)
│   ├── tailwind-preset/     # Preset Tailwind généré depuis les tokens
│   ├── css/                 # ds.css statique (livrable drop-in)
│   ├── react/               # Composants React / Next.js
│   ├── angular/             # Composants Angular 20 standalone
│   └── docs/                # Doc transverse MDX partagée par les 2 Storybooks
└── apps/
    ├── storybook-react/     # Storybook React   (port 6006)
    ├── storybook-angular/   # Storybook Angular (port 6008)
    ├── playground-static/   # Démo HTML pur du ds.css (port 4173)
    └── playground-angular/  # SPA Angular consommatrice (port 4200)
```

## Chaîne de production

```
tokens/*.json (DTCG)
        │
        ├──► Style Dictionary ──► tailwind-preset/   (preset Tailwind + plugin .ori-*)
        │                          │
        │                          ├──► react/       (composants TSX)
        │                          ├──► angular/     (composants ng-packagr)
        │                          └──► css/         (ds.css statique)
        │
        └──► CSS variables ──► tokens/build/css/tokens.css  + tokens/src/dark.css
```

## Composants disponibles

Parité totale React ↔ Angular pour les 5 composants fondateurs :

| Composant |                React                |                     Angular                      | Description                                                  |
| --------- | :---------------------------------: | :----------------------------------------------: | ------------------------------------------------------------ |
| Button    |             ✓ `Button`              |                 ✓ `<ori-button>`                 | 4 variantes, 3 tailles, full width, disabled                 |
| Input     |              ✓ `Input`              |                 ✓ `<ori-input>`                  | label / hint / error, ARIA complet, 3 tailles                |
| Card      | ✓ `Card` + `CardHeader/Body/Footer` | ✓ `<ori-card>` + `<ori-card-header/body/footer>` | 3 variantes (default / elevated / flat)                      |
| Alert     |              ✓ `Alert`              |                 ✓ `<ori-alert>`                  | 4 sévérités (info / success / warning / danger), dismissible |
| Dialog    |         ✓ `Dialog` (Radix)          |                 ✓ `<ori-dialog>`                 | Modal avec backdrop, ESC, focus trap (React)                 |

Le **thème sombre** est supporté nativement : un attribut `data-theme="dark"` sur `<html>` bascule automatiquement tous les composants.

## Livrables

| Cible                         | Package                                             | Comment ça se consomme                    |
| ----------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Next.js / React               | `@govpf/ori-react` + `@govpf/ori-tailwind-preset`   | `npm install`, import composants + preset |
| Angular ≥ 20                  | `@govpf/ori-angular` + `@govpf/ori-tailwind-preset` | idem, composants standalone               |
| Site statique / GLPI / emails | `@govpf/ori-css`                                    | `<link rel="stylesheet" href="ds.css">`   |

## Prérequis

- **Node.js** ≥ 20.11
- **pnpm** ≥ 9 (testé avec 10.29)
- **just** (optionnel mais recommandé - alternative cross-platform à `make`)

### Installer `just`

`just` est un runner de commandes simple qui remplace `make` et fonctionne nativement sur Windows, macOS et Linux.

| OS                    | Commande                                                        |
| --------------------- | --------------------------------------------------------------- |
| Windows               | `winget install Casey.Just` &nbsp;ou&nbsp; `scoop install just` |
| macOS                 | `brew install just`                                             |
| Linux (Debian/Ubuntu) | `sudo apt install just` (≥ 22.10) ou `cargo install just`       |
| Linux (Arch)          | `pacman -S just`                                                |
| Tous (via Rust)       | `cargo install just`                                            |

Vérifier : `just --version`.

> Si tu ne peux pas installer `just`, toutes les recettes délèguent à `pnpm` - tu peux toujours utiliser les commandes `pnpm` équivalentes (colonne de droite du tableau ci-dessous).

## Commandes

Depuis la racine `Ori/`.

```bash
just              # liste toutes les recettes disponibles
just setup        # setup initial complet (install + build)
just storybook-react    # Storybook React  : http://localhost:6006
just storybook-angular  # Storybook Angular : http://localhost:6008
```

### Référence complète

#### Installation & nettoyage

| Recette            | Équivalent pnpm              | Description                                                     |
| ------------------ | ---------------------------- | --------------------------------------------------------------- |
| `just install`     | `pnpm install`               | Installer toutes les dépendances                                |
| `just clean`       | `pnpm clean`                 | Supprimer `node_modules`, `dist`, `build`, `.angular`           |
| `just clean-cache` | `pnpm clean:cache`           | Purger les caches Vite / Webpack / Angular CLI (sans réinstall) |
| `just fresh`       | `pnpm clean && pnpm install` | Réinstallation complète depuis zéro                             |

#### Builds

| Recette               | Équivalent pnpm                                           | Description                                             |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `just build`          | `pnpm build`                                              | Tout compiler (tokens → preset → css → react → angular) |
| `just build-tokens`   | `pnpm build:tokens`                                       | Régénérer les tokens (CSS, SCSS, JS, preset Tailwind)   |
| `just build-css`      | `pnpm build:css`                                          | Compiler `ds.css` + `ds.min.css` + `tokens.css`         |
| `just build-react`    | `pnpm build:react`                                        | Compiler les composants React                           |
| `just build-angular`  | `pnpm build:angular`                                      | Compiler la lib Angular (ng-packagr)                    |
| `just rebuild-tokens` | `pnpm build:tokens && pnpm build:css && pnpm clean:cache` | Régénération + purge des caches après modif tokens      |

#### Storybook

| Recette                        | Équivalent pnpm                | Description                               |
| ------------------------------ | ------------------------------ | ----------------------------------------- |
| `just storybook-react`         | `pnpm storybook:react`         | Storybook React (http://localhost:6006)   |
| `just storybook-angular`       | `pnpm storybook:angular`       | Storybook Angular (http://localhost:6008) |
| `just build-storybook-react`   | `pnpm build:storybook:react`   | Storybook React → site statique           |
| `just build-storybook-angular` | `pnpm build:storybook:angular` | Storybook Angular → site statique         |

#### Playgrounds

| Recette                   | Équivalent pnpm           | Description                            |
| ------------------------- | ------------------------- | -------------------------------------- |
| `just playground-static`  | `pnpm playground:static`  | Démo HTML pure (http://localhost:4173) |
| `just playground-angular` | `pnpm playground:angular` | SPA Angular (http://localhost:4200)    |

#### Modes watch

| Recette            | Description              |
| ------------------ | ------------------------ |
| `just watch-css`   | Rebuild CSS à la volée   |
| `just watch-react` | Rebuild React à la volée |

#### Qualité

| Recette       | Description                      |
| ------------- | -------------------------------- |
| `just format` | Formater tout le code (prettier) |
| `just lint`   | Linter tous les packages         |

#### Raccourcis composés

| Recette      | Description                               |
| ------------ | ----------------------------------------- |
| `just setup` | Setup initial : install + build           |
| `just all`   | Cycle complet : fresh + build + storybook |

## Conventions

### Tokens

- Format **W3C Design Tokens Community Group** (DTCG) - fichiers `packages/tokens/src/*.json`.
- Deux fichiers : `core.json` (primitives - palettes, échelles) et `semantic.json` (alias - `brand.primary`, `surface.base`…).
- **Règle d'or** : un composant ne consomme **jamais** un token primitif (`color.primary.500`) : toujours un alias sémantique (`color.brand.primary`). Cela permet de changer de palette ou de basculer en thème sombre sans toucher au code des composants.

### Composants

- Stylés via **classes sémantiques** (`.ori-btn`, `.ori-card`…) définies dans `packages/tailwind-preset/src/plugin-components.js`.
- Les classes consomment des **variables CSS** (`var(--color-brand-primary)`), pas des hex résolus → bascule de thème dynamique sans recompilation.
- **Aucun utilitaire Tailwind inline** dans le JSX/template du DS. Les utilitaires restent disponibles pour la mise en page applicative dans les projets consommateurs.
- React : composants standards avec `forwardRef`, `clsx` pour les classes.
- Angular : composants `standalone`, `ChangeDetectionStrategy.OnPush`, `ViewEncapsulation.None`, `@Input()` (décorateur classique pour compatibilité large avec Storybook Angular).

### Versions Angular

Toutes les dépendances `@angular/*` sont **forcées sur une version unique** via `pnpm.overrides` dans le `package.json` racine. Sans cette règle, pnpm peut installer plusieurs versions mineures côte à côte (ex: 20.3.18 + 20.3.19), ce qui provoque des erreurs runtime cryptiques (`Cannot read properties of null` dans `ɵɵprojectionDef`) parce que les composants sont compilés contre une version et exécutés contre une autre.

## Structure d'un composant

### React

```
packages/react/src/components/Button/
├── Button.tsx           # implémentation React
├── Button.stories.tsx   # story Storybook
└── index.ts             # ré-export
```

### Angular

```
packages/angular/src/components/button/
├── button.component.ts  # composant standalone + ChangeDetection.OnPush
├── button.stories.ts    # story Storybook Angular
└── index.ts             # ré-export
```

Les classes CSS associées (`.ori-btn`, `.ori-btn--primary`…) sont définies **une seule fois** dans `packages/tailwind-preset/src/plugin-components.js`. Les implémentations React et Angular les appliquent identiquement → **parité visuelle garantie**.

## Ajouter un nouveau composant

1. Définir les classes `.ori-<composant>` dans `packages/tailwind-preset/src/plugin-components.js`
2. Implémentation React : `packages/react/src/components/<Name>/<Name>.tsx` + story + export
3. Implémentation Angular : `packages/angular/src/components/<name>/<name>.component.ts` + story + export
4. Ajouter aux barrels `packages/{react,angular}/src/index.ts` (ou `public-api.ts`)
5. `just rebuild-tokens` pour régénérer les CSS, puis `just storybook` / `just storybook-angular` pour valider

## Workflow typique

```bash
# Premier clone
just setup

# Développement courant - choisir la cible
just storybook-react        # React
just storybook-angular      # Angular
just playground-static      # HTML pur (démo intégrateur)
just playground-angular     # SPA Angular (démo consommateur)

# Mode watch en parallèle (terminal séparé) si tu modifies le plugin CSS
just watch-css

# Après avoir modifié un token
just rebuild-tokens
# (relancer Storybook s'il tournait - le cache a été purgé)

# Avant de committer
just format
just build
```

## Thème sombre

Le DS supporte light/dark via une seule règle CSS : ajouter `data-theme="dark"` (ou la classe `.dark-theme`) sur `<html>`. Compatible aussi avec `prefers-color-scheme: dark` automatiquement.

```html
<!-- Light (par défaut) -->
<html data-theme="light">
  …
</html>

<!-- Dark -->
<html data-theme="dark">
  …
</html>
```

Côté Storybook, un toggle dans la barre d'outils bascule en live grâce à `@storybook/addon-themes`. Côté playgrounds, un bouton `(click)="toggleTheme()"` switche l'attribut.

## Pièges connus

| Symptôme                                                                    | Cause                                                        | Fix                                                                                                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Storybook affiche les anciens tokens après modif                            | Cache Vite / Webpack / Angular CLI persistant                | `just clean-cache`, puis relancer Storybook                                                                                     |
| Storybook Angular : `Cannot read properties of null` dans `ɵɵprojectionDef` | Plusieurs versions d'`@angular/core` co-installées           | Vérifier `pnpm.overrides` dans `package.json` racine ; réinstaller fresh (`rm -rf node_modules pnpm-lock.yaml && pnpm install`) |
| Storybook Angular : NG0203 sur `input()`                                    | `useDefineForClassFields` non explicite                      | Forcer `false` dans `tsconfig.json`                                                                                             |
| `serve` choisit un port aléatoire                                           | Mauvaise option CLI                                          | Utiliser `http-server -p 4173` plutôt que `serve -p 4173`                                                                       |
| Tailwind n'émet pas les classes `.ori-*` dynamiques (template literals)     | Le scanner de Tailwind ne détecte que les classes littérales | `safelist: [{ pattern: /^ds-/ }]` dans la config Tailwind                                                                       |
