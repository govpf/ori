import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Configuration Astro pour le site documentaire Ori.
// - output: static (généré à 100% au build, déployable sur GitHub Pages)
// - site: URL canonique de production (utilisée pour OG tags, sitemap, etc.)
// - base: '/' car servi à la racine du custom domain ori.gov.pf
// - mdx() permet d'écrire les pages de documentation en .mdx (Markdown
//   + JSX) et de réutiliser le contenu rédigé pour les Storybooks.
export default defineConfig({
  output: 'static',
  site: 'https://ori.gov.pf',
  base: '/',
  trailingSlash: 'always',
  integrations: [mdx(), react()],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
