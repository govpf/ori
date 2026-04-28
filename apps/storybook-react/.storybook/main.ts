import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    // Doc transverse partagée : on liste les sous-dossiers explicitement
    // pour pouvoir exclure le dossier `angular/` (doc d'usage spécifique
    // à l'autre framework, cf. décision K.2).
    '../../../packages/docs/src/*.mdx',
    '../../../packages/docs/src/tokens/*.mdx',
    '../../../packages/docs/src/functional/*.mdx',
    '../../../packages/docs/src/react/*.mdx',
    // Stories de composants React
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
    '../../../packages/react/src/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    // remark-gfm active GitHub Flavored Markdown dans les MDX (tableaux,
    // strikethrough, todo lists, etc.). Sans ça, Storybook utilise CommonMark
    // qui ignore les tableaux.
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Sert le dossier d'assets partagés (logo, favicon, etc.) sur /assets/.
  // La source de vérité est packages/docs/assets, mutualisée avec storybook-angular.
  staticDirs: [{ from: '../../../packages/docs/assets', to: '/assets' }],
  typescript: {
    check: false,
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
