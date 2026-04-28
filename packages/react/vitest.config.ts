import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest est utilisé pour les tests unitaires de logique des composants
// React (callbacks, états, transitions, branches conditionnelles). Les
// tests d'accessibilité (axe-core) tournent ailleurs, dans les Storybooks
// via @storybook/test-runner. Voir CONTRIBUTING.md pour le partage des
// rôles entre les deux couches.
//
// L'environnement jsdom suffit ici : les composants Ori ne dépendent pas
// d'API navigateur exotiques (canvas, IntersectionObserver custom, etc.).
// Si un composant à venir en a besoin, basculer ce composant en
// happy-dom ou ajouter le polyfill au setup.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
