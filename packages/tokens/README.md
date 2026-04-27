# @govpf/ori-tokens

Source de vérité des design tokens de Ori, au format [W3C Design Tokens Community Group](https://design-tokens.github.io/community-group/format/).

## Structure

- `src/core.json` - tokens primitifs (palette brute, échelles typo/spacing…). **Ne pas utiliser directement.**
- `src/semantic.json` - aliases sémantiques (`color.brand.primary`, `color.surface.base`…). **C'est ce que consomment les composants.**

## Génération

```bash
pnpm build
```

Produit dans `build/` :

| Fichier                  | Usage                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| `css/tokens.css`         | Variables CSS (`--pf-color-brand-primary`…) pour sites statiques, GLPI, emails |
| `scss/_tokens.scss`      | Variables SCSS pour builds SCSS classiques                                     |
| `js/tokens.js` + `.d.ts` | Import ESM typé pour du code TS/JS                                             |
| `js/tailwind.js`         | Preset Tailwind (consommé par `@govpf/ori-tailwind-preset`)                    |
| `json/tokens.json`       | JSON aplati (intégrations tierces : Figma plugins, etc.)                       |

## Règle d'or

Un composant **n'importe jamais** un token primitif (`color.lagoon.600`). Il passe toujours par un alias sémantique (`color.brand.primary`). Cela permet de changer de palette sans toucher au code des composants.
