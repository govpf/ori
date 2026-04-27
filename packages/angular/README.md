# @govpf/ori-angular

Composants Angular 20 (standalone) du design system Ori.

## Installation

```bash
pnpm add @govpf/ori-angular
```

## Configuration Tailwind du projet consommateur

Le composant applique les classes `.ori-btn`, `.ori-btn--primary`… mais ne
ship aucune feuille de style. Le projet consommateur doit charger soit :

- **`@govpf/ori-css/dist/ds.css`** - bundle statique drop-in (le plus simple)
- ou **`@govpf/ori-tailwind-preset`** dans son propre `tailwind.config.js`

```js
// tailwind.config.js de l'app Angular
import pfDsPreset from '@govpf/ori-tailwind-preset';

export default {
  presets: [pfDsPreset],
  content: ['./src/**/*.{html,ts}', './node_modules/@govpf/ori-angular/**/*.{js,mjs}'],
};
```

## Usage

```ts
import { Component } from '@angular/core';
import { OriButtonComponent } from '@govpf/ori-angular';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [OriButtonComponent],
  template: ` <ori-button variant="primary" (click)="onClick()">Envoyer</ori-button> `,
})
export class DemoComponent {
  onClick() {}
}
```

## Principe de style

Les composants n'embarquent aucune feuille de style locale. Ils appliquent
uniquement des classes sémantiques (`ds-btn`, `ds-btn--primary`) définies dans
`@govpf/ori-tailwind-preset`. Cela garantit la parité visuelle exacte entre :

- les composants Angular
- les composants React (`@govpf/ori-react`)
- les sites statiques qui chargent `@govpf/ori-css`
