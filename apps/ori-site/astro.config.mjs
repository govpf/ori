import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkGfm from 'remark-gfm';

// Configuration Astro pour le site documentaire Ori.
// - output: static (généré à 100% au build, déployable sur GitHub Pages)
// - site: URL canonique de production (utilisée pour OG tags, sitemap, etc.)
// - base: '/' car servi à la racine du custom domain ori.gov.pf
// - mdx() permet d'écrire les pages de documentation en .mdx (Markdown
//   + JSX) et de réutiliser le contenu rédigé pour les Storybooks.
// - remark-gfm active GitHub Flavored Markdown : tableaux, task lists
//   (`- [x]` rendu en checkbox), autolink literals, strikethrough.
//   Depuis Astro 7, le processeur Markdown par défaut est Sätteri ; on
//   garde le pipeline unified (@astrojs/markdown-remark) pour conserver
//   les plugins remark. MDX hérite de markdown.processor.
// - compressHTML: true conserve le comportement d'Astro 6 (la valeur par
//   défaut 'jsx' d'Astro 7 supprime les espaces entre éléments inline).
export default defineConfig({
  output: 'static',
  site: 'https://ori.gov.pf',
  base: '/',
  trailingSlash: 'always',
  compressHTML: true,
  markdown: {
    processor: unified({ remarkPlugins: [remarkGfm] }),
  },
  integrations: [mdx(), react()],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
    // Dépendances internes d'Astro 7 que le bundle de prérendu importe
    // par nom nu depuis dist/.prerender : avec l'isolation pnpm, elles ne
    // sont pas résolvables depuis apps/ori-site, on les embarque donc.
    environments: {
      prerender: {
        resolve: { noExternal: ['cookie', 'picomatch', 'zod'] },
      },
    },
  },
});
