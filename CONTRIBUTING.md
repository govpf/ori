# Contribuer à Ori

Merci de l'intérêt porté à Ori, le design system des services
administratifs de la Polynésie française.

Ori est principalement développé par et pour l'administration PF, mais
les contributions externes sont les bienvenues, en particulier sur les
sujets transverses (accessibilité, performance, documentation,
correctifs de bugs).

## Avant de contribuer

### Niveau de support

Ori est maintenu en mode **best-effort, sans engagement de SLA**. Les
contributions sont filtrées par les besoins des services PF qui
consomment le DS. Une demande qui ne sert pas un usage administratif
polynésien peut être refusée même si techniquement valide.

### Avant d'ouvrir une PR significative

Pour toute contribution autre qu'un correctif évident (typo, lien
cassé, classe CSS oubliée), **ouvrir une issue d'abord** pour discuter
du besoin. Cela évite de produire du code qui ne sera pas mergé pour
des raisons de design ou de stratégie.

Le repo embarque [4 templates d'issues](./.github/ISSUE_TEMPLATE/) :
composant manquant, bug a11y, pattern applicatif, question d'usage.
À choisir dès la création d'une issue.

### Roadmap publique

Le suivi des chantiers est visible sur le **[GitHub Project Ori roadmap](https://github.com/orgs/govpf/projects/3)** :

- 4 colonnes : `Backlog` (items reconnus), `Up next` (1-2 sprints à venir),
  `In progress` (PR ouverte), `Done` (livré)
- Filtres par `Catégorie` (Composant / Pattern / A11y / DX / Doc /
  Écosystème / Gouvernance / Sécu), `Size` (effort estimé),
  `Source` (Feedback externe / Roadmap interne / Bug remonté /
  Décision tranchée)

Avant d'ouvrir un nouveau ticket, vérifier que l'item n'est pas
déjà dans la roadmap. Si oui, commenter sur la card concernée.

### Code de conduite

Ce projet suit le [Contributor Covenant](./CODE_OF_CONDUCT.md).
Toute interaction avec le projet (issues, PR, discussions) y est
soumise.

## Mise en place de l'environnement

### Prérequis

- **Node.js 20.11+** (recommandé : Node 24 LTS, comme la CI)
- **pnpm 10.29+** (gestionnaire de paquets - `corepack enable && corepack prepare pnpm@latest --activate`)
- **Git**
- **Docker** (optionnel, pour tester la CI en local via `act`)

### Installation

```bash
git clone https://github.com/govpf/ori.git
cd ori
pnpm install
```

`pnpm install` installe aussi les hooks Git locaux (Husky) :

- **`pre-commit`** : Prettier sur les fichiers stagés via `lint-staged`.
  Plus besoin de penser à `pnpm format` avant chaque commit.
- **`commit-msg`** : commitlint vérifie que le message suit la
  convention Conventional Commits (cf. section "4. Conventions de
  commits").

Pour bypasser un hook ponctuellement (commit WIP qui sera squash) :
`git commit --no-verify`. À ne pas faire systématiquement.

### Builds des packages

Tous les packages doivent être buildés avant de pouvoir lancer les
applications consommatrices (Storybooks, demo-portail, site Astro) :

```bash
pnpm -r --filter "./packages/*" build
```

### Lancer les apps en développement

```bash
pnpm storybook:react       # Storybook React, port 6006
pnpm storybook:angular     # Storybook Angular, port 6008
pnpm demo:portail          # Demo end-to-end portail usager, port 5174
pnpm playground:static     # HTML pur consommant ori-css, port 4173
```

### Tester la CI en local

Le repo embarque un wrapper Docker pour exécuter les workflows GitHub
Actions sans les pousser :

```bash
./tools/act/run.sh push                  # tout le pipeline
./tools/act/run.sh push -j format        # un job spécifique
```

Voir [tools/act/README.md](./tools/act/README.md) pour le détail.

## Process de contribution

### 1. Fork et branche

```bash
gh repo fork govpf/ori --clone
cd ori
git checkout -b feat/nom-court-explicite
```

Conventions de nommage de branche :

- `feat/...` : nouvelle fonctionnalité
- `fix/...` : correction de bug
- `docs/...` : documentation seule
- `refactor/...` : refactor sans changement de comportement
- `chore/...` : maintenance, deps, build

### 2. Coder en respectant les principes

Ori suit quelques règles de fond, documentées dans la page
**Décisions de design** du Storybook :

- **RGAA AA est la baseline obligatoire** (a11y vérifiée à chaque PR)
- **Préférer le HTML natif** quand il couvre le besoin
- **Bundle minimal** : chaque dépendance ajoutée doit être justifiée
- **Généricité institutionnelle** : pas de domaine métier hardcodé
- **Aucun design trompeur** (faux compteurs d'urgence, opt-out cachés, etc.)

Pour toute modification d'un composant DS (`packages/react/`,
`packages/angular/`, `packages/tailwind-preset/`) :

- La modification doit être appliquée **en miroir** côté React et
  côté Angular (sauf si volontairement single-framework, dans ce cas
  justifier dans la PR)
- Les classes CSS `.ori-*` doivent rester cohérentes entre les deux
- Les stories doivent être mises à jour dans les deux Storybooks

### 3. Vérifier localement avant push

```bash
# Format Prettier
pnpm format:check

# Build de tous les packages
pnpm -r --filter "./packages/*" build

# Build des apps consommatrices
pnpm --filter @govpf/ori-storybook-react build
pnpm --filter @govpf/ori-storybook-angular build
pnpm --filter @govpf/ori-site build
pnpm --filter @govpf/ori-demo-portail build

# Tests unitaires (Vitest sur les composants React à logique non triviale)
pnpm --filter @govpf/ori-react test

# Tests d'accessibilité automatisés (axe-core sur chaque story)
pnpm --filter @govpf/ori-storybook-react test:a11y:ci
pnpm --filter @govpf/ori-storybook-angular test:a11y:ci
```

#### Tests d'accessibilité automatisés

Chaque story devient automatiquement un test de non-régression a11y.
À l'intérieur de l'iframe de la story, le test-runner injecte
`axe-core` et fait échouer le job dès qu'une violation `serious` ou
`critical` est remontée. Tags axe testés : `wcag2a`, `wcag2aa`,
`wcag21a`, `wcag21aa`, `best-practice`.

Conséquences pratiques pour qui ajoute ou modifie un composant :

- **Ajouter au moins une story par variant.** La couverture a11y est
  proportionnelle à la couverture stories. Variants visuels (size,
  color, state) sans story ne sont pas testés.
- **Render statique uniquement.** Le test-runner par défaut visite la
  page de la story et exécute axe-core sur le rendu initial. Pour
  tester un état après interaction (modal ouverte, dropdown déployé),
  utiliser une `play()` function dans la story.
- **Hors-scope** : focus order, navigation clavier, contraste sur
  hover/focus, lecteurs d'écran. axe-core ne couvre que les checks
  statiques. Ces points-là restent à vérifier manuellement (cf.
  méthode RGAA).
- **Opt-out** : si une story ne peut pas passer (cas pédagogique
  démontrant un anti-pattern, par exemple), ajouter le tag `skip-a11y`
  dans les `tags` de la story.

Pour exécuter contre un Storybook qui tourne déjà en local
(`pnpm --filter ... storybook`), utiliser `test:a11y` au lieu de
`test:a11y:ci`.

#### Tests unitaires (Vitest)

Côté React, **Vitest + @testing-library/react** sont configurés dans
`packages/react`. Le runner couvre la **logique** des composants
(callbacks, transitions d'état, navigation clavier, validations) que
les tests a11y et les stories ne couvrent pas.

```bash
pnpm --filter @govpf/ori-react test           # CI : run + exit
pnpm --filter @govpf/ori-react test:watch     # dev : re-run on change
```

Convention : un fichier de test par composant, à côté du composant.

```
packages/react/src/components/Button/
├── Button.tsx
├── Button.stories.tsx
├── Button.test.tsx          ← ici
└── index.ts
```

Cibles prioritaires (ce qui mérite un test unitaire) :

- **logique métier** : calcul de pages dans Pagination, validation
  type/taille dans FileUpload, timer auto-dismiss du Toast
- **transitions d'état** : ouverture/fermeture, sélection, focus
- **navigation clavier** : Arrow keys dans Tabs, Home/End
- **branches conditionnelles** : disabled, loading, error
- **régressions identifiées** : tout bug corrigé devrait gagner un
  test pour empêcher le retour (cf. cas Highlight `query=""` qui
  surlignait tout)

Ce qui **n'a pas besoin** d'un test unitaire :

- composants de présentation pure (Tag, Card, Avatar, Skeleton...) :
  les stories suffisent comme galerie + a11y
- wrapping triviaux d'une lib externe (Dialog → Radix) : tester la
  lib externe est hors-scope ; couvrir les stories suffit

Côté Angular, **aucun runner unitaire** n'est branché aujourd'hui.
Décision parquée (cf. Décisions à prendre, point C.4) : Jest et
Vitest+Analog ont tous deux été tentés et bloquent sur des
incompatibilités ESM / TypeScript de l'écosystème Angular 20 + pnpm.
Karma reste fonctionnel mais en EOL annoncé.

La couverture des composants Angular repose pour l'instant sur les
tests a11y axe-core (193 stories) et sur le fait que la logique est
miroir de la version React (71 tests Vitest). À ré-évaluer à chaque
release Angular ou Vitest majeure.

### 4. Conventions de commits

Format **Conventional Commits** :

```
<type>(<scope optionnel>): <description courte>

<corps optionnel>

<footer optionnel>
```

Types courants :

- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `docs` : documentation
- `refactor` : refactor sans changement comportemental
- `perf` : amélioration de performance
- `test` : ajout ou modification de tests
- `chore` : maintenance, build, deps
- `ci` : workflows CI/CD

Exemples :

```
feat(react): add FileCard component
fix(angular): correct Tooltip aria-describedby on focus
docs(storybook): document the Statistic.trend.positive prop
```

### 5. Ouvrir la pull request

Le repo a un [template de PR](./.github/PULL_REQUEST_TEMPLATE.md)
qui rappelle les checks attendus :

- Cross-framework (React + Angular)
- Accessibilité
- Tests manuels (clair/sombre, mobile/desktop)
- Documentation à jour

La CI doit être verte sur tous les jobs avant qu'une PR puisse être
mergée. Les status checks requis sont configurés dans le ruleset
`protect-main` du repo.

### 6. Versioning et release (Changesets)

Toute PR qui modifie un package publishable (`packages/{tokens,
tailwind-preset,css,react,angular}`) doit embarquer un changeset qui
décrit l'impact pour les consommateurs.

#### Ajouter un changeset

```bash
pnpm changeset
```

Le CLI demande :

1. Quels packages sont touchés ?
2. Pour chacun, quel type de bump ? (`patch` / `minor` / `major`)
3. Le résumé (ce qui apparaîtra dans le `CHANGELOG.md` du package)

Le résumé est lu par les consommateurs : être clair et concis. Préférer
le présent à l'impératif (« corrige le focus trap dans Dialog »
plutôt que « corriger... »).

Le fichier généré dans `.changeset/<nom-aleatoire>.md` est commité avec
la PR. Plusieurs changesets peuvent cohabiter : un par sujet logique,
même si tout est dans la même PR.

#### Choix du bump

Conventions calées sur Conventional Commits :

| Commit                                             | Bump                               |
| -------------------------------------------------- | ---------------------------------- |
| `fix(...)`                                         | `patch`                            |
| `feat(...)`                                        | `minor`                            |
| `feat!` ou `BREAKING CHANGE` dans le corps         | `major`                            |
| `chore`, `docs`, `refactor`, `test`, `ci`, `style` | **pas de bump** (pas de changeset) |

#### Politique semver pré-1.0

Tant que le DS est en `0.x` (phase de bootstrap), la règle est :

| Bump  | Format  | Sémantique                                                                                             |
| ----- | ------- | ------------------------------------------------------------------------------------------------------ |
| Patch | `0.x.y` | Compatibilité ascendante garantie. Bug fixes uniquement.                                               |
| Minor | `0.x.0` | **Breaking changes autorisés**. Nouvelles fonctionnalités, modifications d'API publique, suppressions. |
| Major | `1.0.0` | Sortira après stabilisation par X apps PF en production.                                               |

**Pour les consommateurs** : verrouiller la version exacte d'Ori en
`dependencies` (`"@govpf/ori-react": "0.3.2"`, pas `"^0.3.2"`). Lire
le `CHANGELOG.md` de chaque package avant tout bump minor.

**Pour les contributeurs Ori** : tout changement d'API publique doit
embarquer un changeset minor avec un résumé clair. Si le changement
est breaking, le résumé doit lister explicitement « Breaking : ... »
avec un exemple `avant` / `après` quand c'est court.

À partir de `1.0`, tout breaking deviendra `major` (sémantique semver
classique).

Voir aussi la décision tranchée [C.5 dans Décisions à prendre](https://ori.gov.pf/) du Storybook.

#### Que se passe-t-il après merge ?

Le workflow `Release npm packages` détecte les `.changeset/*.md`
pendants sur `main` et ouvre / met à jour automatiquement une PR
**`chore(release): version packages`**. Cette PR :

- consume les changesets pendants
- bumpe les `package.json` des packages concernés
- met à jour les `CHANGELOG.md` correspondants

Quand cette PR est mergée à son tour, le même workflow publie les
versions bumpées sur npm via OIDC Trusted Publisher (provenance
signée), package par package, en respectant l'ordre topologique
(`tokens` -> `tailwind-preset` -> `css` -> `react` / `angular`).

Aucun `git tag v*` à pousser à la main : le bot s'en charge.

#### Cas où un changeset n'est pas requis

- PRs qui ne touchent que les `apps/*` (privées, non publiées)
- PRs `chore` / `docs` / `refactor` / `test` / `ci` qui ne modifient
  pas le code distribué d'un package
- PRs sur la doc Storybook (`packages/docs/`) sans impact sur les
  composants

En cas de doute : ajouter un changeset. Mieux vaut un patch superflu
qu'un consommateur surpris par un changement non documenté.

## Architecture du monorepo

```
ori/
├── packages/
│   ├── tokens/              # Source : design tokens (Style Dictionary)
│   ├── tailwind-preset/     # Preset Tailwind généré depuis les tokens
│   ├── css/                 # Bundle ori.css drop-in
│   ├── react/               # Composants React (@govpf/ori-react)
│   ├── angular/             # Composants Angular (@govpf/ori-angular)
│   └── docs/                # MDX transverse partagé entre les Storybooks
└── apps/
    ├── ori-site/            # Site documentaire (Astro)
    ├── storybook-react/     # Storybook test React
    ├── storybook-angular/   # Storybook test Angular
    ├── playground-static/   # Démo HTML pur du livrable CSS
    ├── playground-react/    # Démo Vite + React
    ├── playground-angular/  # Démo Angular CLI
    └── demo-portail/        # Démo end-to-end portail usager
```

## Mainteneurs

Le DS est maintenu par l'équipe Design des services administratifs PF.
Pour identifier les mainteneurs actifs et le statut courant, consulter
le [graphe des contributeurs](https://github.com/govpf/ori/graphs/contributors)
sur GitHub.

Pour les sujets institutionnels (gouvernance, partenariats, demandes
spécifiques d'administrations), écrire à `design@administration.gov.pf`.

## Questions

Pour toute question qui ne relève pas d'une issue, ouvrir une
**[Discussion](https://github.com/govpf/ori/discussions)** sur le repo.
