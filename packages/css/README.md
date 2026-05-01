# @govpf/ori-css

Bundle CSS statique Ori. Livrable autonome pour tout contexte qui n'embarque pas Tailwind.

## Contenu de `dist/`

| Fichier      | Taille cible | Usage                                             |
| ------------ | ------------ | ------------------------------------------------- |
| `ds.css`     | ~30-50 Ko    | Bundle complet (reset + tokens + classes .ori-\*) |
| `ds.min.css` | ~15-25 Ko    | Version minifiée pour production                  |
| `tokens.css` | ~3-5 Ko      | Variables CSS seules (si tu veux styler toi-même) |

## Usage - site statique

```html
<link rel="stylesheet" href="https://cdn.example.org/Ori/ds.min.css" />
<button class="ori-button ori-button--primary">Envoyer</button>
```

## Usage - GLPI 11 (via plugin de thème)

Le fichier `tokens.css` expose toutes les variables CSS (`--pf-color-brand-primary`…). Tu peux soit :

- **Option A** - copier `ds.css` tel quel et le charger via un hook GLPI sur `Html::includeHeader`
- **Option B** - ne prendre que `tokens.css` et surcharger les variables SCSS Tabler/Bootstrap de GLPI dans un SCSS de plugin

## Génération

```bash
pnpm build
```

Compile `src/ds.css` avec Tailwind + le preset `@govpf/ori-tailwind-preset`. La `safelist` dans `tailwind.config.js` garantit que **toutes** les classes `.ori-*` définies dans le plugin sont présentes dans la sortie, même sans HTML de référence.
