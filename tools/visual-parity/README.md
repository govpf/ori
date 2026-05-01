# Visual parity React ↔ Angular

Outil interne de test de parité visuelle entre les Storybook React et Angular d'Ori. Pour chaque story qui existe dans les deux frameworks (clé `title + name`), capture le `#storybook-root` côté React et côté Angular, puis compare pixel-à-pixel.

## Pourquoi

Les deux frameworks consomment les mêmes tokens et les mêmes classes CSS `.ori-*`. Sauf bug de templating, les rendus doivent être identiques. La discipline de revue ne suffit pas à attraper tous les drifts (cf. l'incident SearchBar/PhoneInput de 2026-05-01).

## Usage local

Prérequis : avoir buildé les deux Storybooks au préalable.

```bash
# Build des packages, puis des deux Storybooks
pnpm -r --filter "./packages/*" build
pnpm --filter @govpf/ori-storybook-react build
pnpm --filter @govpf/ori-storybook-angular build

# Servir les deux storybooks (terminaux distincts ou en arrière-plan)
npx http-server apps/storybook-react/storybook-static -p 6006 -s &
npx http-server apps/storybook-angular/storybook-static -p 6008 -s &

# Installer les deps de l'outil et exécuter
pnpm --filter @govpf/ori-tools-visual-parity install
pnpm exec playwright install chromium
node tools/visual-parity/compare.mjs
```

Sortie dans `tools/visual-parity/output/` :

- `report.html` : rapport visuel (ouvrir directement dans un navigateur)
- `results.json` : résultats bruts pour usage CI
- `images/<story-id>/{react,angular,diff}.png` : captures et diff par story

## Variables d'env

| Var               | Default                           | Effet                                                           |
| ----------------- | --------------------------------- | --------------------------------------------------------------- |
| `REACT_URL`       | `http://localhost:6006`           | URL du Storybook React                                          |
| `ANGULAR_URL`     | `http://localhost:6008`           | URL du Storybook Angular                                        |
| `THRESHOLD`       | `0.01`                            | Tolérance globale (1 % de pixels divergents par story)          |
| `PIXEL_THRESHOLD` | `0.1`                             | Sensibilité de pixelmatch par pixel (0 = strict, 1 = permissif) |
| `VIEWPORT_WIDTH`  | `1280`                            | Largeur du viewport                                             |
| `VIEWPORT_HEIGHT` | `800`                             | Hauteur du viewport                                             |
| `SETTLE_MS`       | `500`                             | Attente après render avant capture                              |
| `SKIP_TAGS`       | `skip-visual,docs-only,test-only` | Tags Storybook à exclure                                        |

## Comment exclure une story

Ajouter le tag `skip-visual` dans le `meta.tags` de la story concernée :

```ts
const meta = {
  title: 'Primitives/...',
  component: ...,
  tags: ['autodocs', 'skip-visual'],
};
```

À justifier par un commentaire (animations qui ne stabilisent pas, snapshot non déterministe, etc.).

## Codes de sortie

- `0` : toutes les paires sont en parité
- `1` : au moins une story diverge ou erreur d'exécution

## Usage CI

Workflow déclenché à la demande, non bloquant pour l'instant. Voir `.github/workflows/visual-parity.yml`.

Triggers :

- `workflow_dispatch` : bouton "Run workflow" dans l'UI Actions, ou `gh workflow run visual-parity.yml --ref ma-branche`
- Label `visual-test` posé sur une PR : déclenche automatiquement le job

Le rapport HTML + les images sont uploadés en artifact CI (rétention 14 jours).

## Roadmap

1. **Phase d'observation** (actuelle) : déclenchement à la demande, ajustement des thresholds, identification des stories instables.
2. **Phase de stabilisation** : tournage automatique sur toutes les PR avec `continue-on-error: true`.
3. **Phase de gating** : retrait de `continue-on-error` + ajout du check à la branch protection.

Chaque transition se fait en modifiant `.github/workflows/visual-parity.yml`.
