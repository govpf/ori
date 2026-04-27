# @govpf/ori-docs

Documentation transverse de Ori, partagée entre **les deux Storybooks** (React et Angular).

## Pourquoi ce package ?

Storybook 8 rend toujours les pages MDX avec React, **même quand le framework documenté est Angular** (c'est `@storybook/addon-docs` qui s'en charge en interne). Conséquence : un fichier `.mdx` qui ne contient que de la prose + du JSX descriptif est portable entre les deux Storybooks sans modification.

On centralise donc ici tout ce qui n'est pas spécifique à un framework :

- Introduction au design system
- Galerie des tokens (palette, typographie, spacings, radii, shadows)
- Conventions, principes, accessibilité (à venir)

## Comment c'est consommé

Les `main.ts` des deux Storybooks ajoutent ce package à leur `stories` glob :

```ts
stories: [
  '../../../packages/docs/src/**/*.mdx',
  // + stories spécifiques framework
],
```

## Limite à connaître

Les **previews live de composants** (`<Story of={...} />`) ne peuvent pas être mutualisées : elles référencent une story TS/TSX qui appartient à un framework donné. Pour ces blocs, écrire deux versions (une dans `apps/storybook-react`, une dans `apps/storybook-angular`).

Tout le reste (prose + galerie visuelle + tableaux) est mutualisable.
