import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Configuration Astro pour le site documentaire Ori.
// - output: static (généré à 100% au build, déployable sur GitHub Pages)
// - site: URL canonique de production (utilisée pour OG tags, sitemap, etc.)
// - base: '/' car servi à la racine du custom domain ori.gov.pf
//   (le CNAME redirige govpf.github.io/ori vers ori.gov.pf, pas besoin
//   de base path)
export default defineConfig({
  output: 'static',
  site: 'https://ori.gov.pf',
  base: '/',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
