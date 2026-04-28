# Build & release

Ce document décrit comment Ori est construit, dans quel ordre, ce qui
est régénéré quand on touche à quoi, et comment une PR finit par sortir
en version publiée sur npm.

Cible : un nouveau contributeur qui doit builder en local ou comprendre
ce que fait la CI.

Pour le **comment contribuer** (workflow PR, conventions de commit,
ajout d'un changeset), voir plutôt [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Ordre topologique des packages

```
tokens
  └─> tailwind-preset
        └─> css
              ├─> (consommateurs externes via @govpf/ori-css)
              ├─> ori-react ─┐
              └─> ori-angular ┘
                    └─> consommé par les apps internes
                        (ori-site, demo-portail, storybooks, playgrounds)
```

| Package           | Outil de build                    | Sortie                                  | Re-build quand on change...                                 |
| ----------------- | --------------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| `tokens`          | Style Dictionary (`build.js`)     | `build/{css,scss,js,json}`              | `src/{core,semantic}.json`, `src/dark.css`, `src/fonts.css` |
| `tailwind-preset` | Aucun (passthrough)               | `src/index.js` exporté direct           | `src/plugin-components.js`, `src/index.js`                  |
| `css`             | Tailwind CLI + recopie tokens.css | `dist/{ori.css,ori.min.css,tokens.css}` | tout ce qui touche `tokens` ou `tailwind-preset`            |
| `react`           | tsc                               | `dist/`                                 | composants `src/components/**`, marketing, docs sub-paths   |
| `angular`         | ng-packagr                        | `dist/`                                 | `src/**`, marketing, docs sub-paths                         |

`pnpm -r --filter "./packages/*" build` respecte l'ordre topologique et
parallélise ce qui peut l'être (ex: `react` et `angular` se buildent en
parallèle, après `css`).

## Que régénérer après quoi

| Ce qui change                                           | À rebuilder                                                      | Rationale                                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Un token (`packages/tokens/src/*`)                      | tout                                                             | les valeurs propagent en cascade jusqu'à `ori.css` et aux variables CSS consommées par les apps               |
| Le preset Tailwind (`plugin-components.js`)             | `css` puis tester les apps                                       | aucune contrainte de rebuild côté `react` / `angular` (ils consomment les classes au runtime, pas à la build) |
| Un composant React (`packages/react/src/components/**`) | `react` uniquement                                               | les Storybook React et demo-portail utilisent le `dist/` via `workspace:*`                                    |
| Un composant Angular                                    | `angular` uniquement                                             | idem                                                                                                          |
| Une story (`*.stories.ts(x)`)                           | aucun rebuild package                                            | les stories sont dans le sources, lues directement par le Storybook (Vite/webpack)                            |
| Une icône Lucide ajoutée                                | aucun (`lucide-react` / `lucide-angular` sont des deps externes) |                                                                                                               |
| Le code de `ori-site` (Astro)                           | `pnpm --filter @govpf/ori-site build`                            | rebuild statique des 25+ pages                                                                                |

Pour voir si le rebuild est nécessaire avant de tester une app
consommatrice :

```bash
# Build minimal en cas de doute
pnpm -r --filter "./packages/*" build
```

## Caches qui peuvent vous piéger

- `apps/*/node_modules/.vite` : cache Vite. Si une story a l'air figée
  malgré un changement de composant, `pnpm clean:cache` puis relancer.
- `apps/*/.angular` : cache Angular CLI. Idem en cas d'incohérence
  Angular.
- `apps/storybook-*/storybook-static` : artefact des builds CI a11y.
  Régénéré à chaque `pnpm --filter ... build`.
- `node_modules/.pnpm` : store pnpm. Ne jamais `rm -rf` à la main, c'est
  partagé entre les workspaces. Pour repartir propre : `pnpm clean` (qui
  nettoie tous les `node_modules` du repo) puis `pnpm install`.

## Apps consommatrices et ce qu'elles font

| App                       | Rôle                                       | Comment elle consomme les packages                                                 |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `apps/ori-site`           | Site documentaire public (ori.gov.pf)      | Astro 6 + MDX, intègre des composants React via `@astrojs/react`                   |
| `apps/storybook-react`    | Atelier React (port 6006)                  | importe `@govpf/ori-react` et le preset Tailwind                                   |
| `apps/storybook-angular`  | Atelier Angular (port 6008)                | idem côté `@govpf/ori-angular`                                                     |
| `apps/demo-portail`       | Démo end-to-end portail usager (port 5174) | composition complète avec `@govpf/ori-react`, demo des patterns Auth/Legal/ChatBot |
| `apps/playground-react`   | Sanity check React (port 5173)             | rendu minimal pour valider que le bundle fonctionne hors Storybook                 |
| `apps/playground-angular` | Sanity check Angular                       | idem côté Angular                                                                  |
| `apps/playground-static`  | Démo HTML pure                             | consomme `@govpf/ori-css` sans framework JS, validation drop-in                    |

Les apps sont toutes en `private: true` : elles **ne sont pas publiées
sur npm**. Seuls les 5 packages publiables le sont.

## Pipeline CI

À chaque PR sur `main`, le workflow `CI` (`.github/workflows/ci.yml`)
exécute en parallèle :

1. **Install dependencies** — base réutilisée par tous les jobs
2. **Format check (Prettier)** — bloquant
3. **Build packages** — bloquant, archive les `dist/` en artifact
4. **Build Storybook React** — bloquant
5. **Build Storybook Angular** — bloquant
6. **Build site Astro** — bloquant
7. **Build demo-portail** — bloquant
8. **A11y Storybook React** — axe-core sur 213 stories, fail sur
   `serious` ou `critical`
9. **A11y Storybook Angular** — axe-core sur 193 stories, idem
10. **Security audit (pnpm audit)** — bloquant sur `critical`
11. **Security audit (published packages)** — tolérance zéro sur tout
    advisory dans `packages/*` (cf. [SECURITY.md](../../SECURITY.md))

Tous ces checks doivent être verts avant qu'une PR puisse être mergée.
La règle est posée dans le ruleset `protect-main` du repo
(`.github/rulesets/protect-main.json`).

## Pipeline release

À chaque push sur `main`, le workflow `Release npm packages`
(`.github/workflows/release.yml`) :

1. Build tous les `packages/*`
2. Lance `changesets/action@v1` qui :
   - Si des `.changeset/*.md` sont pendants : ouvre / met à jour la PR
     `chore(release): version packages` (qui consume les changesets,
     bumpe les `package.json` concernés et met à jour les `CHANGELOG`)
   - Sinon : publie sur npm les versions locales qui ne sont pas déjà
     publiées, en ordre topologique, via `pnpm publish` (résout les
     `workspace:*` en versions concrètes), avec `--provenance --access
public`. Authentification via OIDC Trusted Publisher (pas de token
     manuel).

Aucun `git tag v*` n'est nécessaire : le bot s'en charge.

Pour le détail du flux Changesets côté contributeur (quand ajouter un
changeset, comment choisir le bump), voir
[CONTRIBUTING.md → 6. Versioning et release](../../CONTRIBUTING.md#6-versioning-et-release-changesets).

## Hooks Git locaux

Les hooks Husky sont installés automatiquement par `pnpm install` (via
le script `prepare` du `package.json` racine) :

- **`pre-commit`** : lance `lint-staged` qui exécute `prettier --write`
  uniquement sur les fichiers stagés. Évite l'aller-retour CI rouge ->
  `pnpm format` -> push qui était systématique avant.
- **`commit-msg`** : lance `commitlint` (preset Conventional Commits).
  Refuse un message qui ne respecte pas la convention (`feat`, `fix`,
  `chore`, etc. + sujet en minuscule).

Pour bypasser exceptionnellement (par exemple un commit WIP que vous
allez squash) : `git commit --no-verify`. À ne pas faire systématiquement,
c'est précisément ce que les hooks empêchent.

## Checklist : ajouter un nouveau composant

1. Créer le composant React dans `packages/react/src/components/<Nom>/`
   (un dossier par composant, fichiers `<Nom>.tsx`, `<Nom>.stories.tsx`,
   `index.ts`)
2. Créer son équivalent Angular dans
   `packages/angular/src/components/<nom>/` (kebab-case côté Angular,
   PascalCase côté React)
3. Si du CSS partagé est nécessaire : ajouter la classe `.ori-<nom>`
   dans `packages/tailwind-preset/src/plugin-components.js`. Seuls les
   tokens sémantiques (`feedback-*`, `surface-*`, `text-*`, etc.) sont
   autorisés - jamais les primitives palette (`*-500`, etc.) car elles
   ne respectent pas le thème dark.
4. Exporter depuis les `index.ts` / `public-api.ts` racines des deux
   packages
5. Ajouter au moins une story par variant visuel (couvre l'a11y CI
   automatiquement)
6. `pnpm -r --filter "./packages/*" build` pour vérifier que tout
   compile
7. `pnpm storybook:react` et `pnpm storybook:angular` pour vérification
   visuelle (clair + sombre, mobile + desktop)
8. `pnpm --filter @govpf/ori-storybook-react test:a11y:ci` et idem
   Angular pour vérifier qu'aucune violation a11y n'est introduite
9. Ajouter un changeset (`pnpm changeset`) avec le bump approprié
   (`minor` pour un nouveau composant) et les packages concernés
10. Ouvrir la PR. Cf. CONTRIBUTING pour le reste du flux.
