import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Configuration Astro pour le prototype Ori.
// - output: static (pas de SSR), généré à 100% au build → déployable sur GitHub Pages
// - base: /ori (le site sera servi sous https://govpf.github.io/ori/)
// - integrations: React activé pour les îlots interactifs
//
// NOTE prototype : on garde `base: '/'` pour le dev local, à passer à `/ori`
// au moment du déploiement GitHub Pages.
export default defineConfig({
  output: 'static',
  base: '/',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
