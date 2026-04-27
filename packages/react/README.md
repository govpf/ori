# @govpf/ori-react

Composants React / Next.js de Ori.

## Installation

```bash
pnpm add @govpf/ori-react @govpf/ori-tailwind-preset
```

## Configuration Tailwind (projet consommateur)

```js
// tailwind.config.js
import pfDsPreset from '@govpf/ori-tailwind-preset';

export default {
  presets: [pfDsPreset],
  content: ['./src/**/*.{ts,tsx}', './node_modules/@govpf/ori-react/dist/**/*.js'],
};
```

## Usage

```tsx
import { Button } from '@govpf/ori-react';

export default function Page() {
  return <Button variant="primary">Envoyer</Button>;
}
```

## Principe de style

Les composants **n'inlinent aucune classe utilitaire Tailwind** dans leur JSX. Ils appliquent uniquement des classes sémantiques (`ds-btn`, `ds-btn--primary`) définies dans `@govpf/ori-tailwind-preset`. Cela garantit que :

- un site statique qui charge `@govpf/ori-css` rend **exactement** le même visuel qu'un composant React
- changer une valeur de token régénère `ds.css` ET met à jour les composants React sans toucher au JSX
