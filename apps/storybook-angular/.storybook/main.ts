import type { StorybookConfig } from '@storybook/angular';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    // Doc transverse partagée : on liste les sous-dossiers explicitement
    // pour pouvoir exclure le dossier `react/` (doc d'usage spécifique
    // à l'autre framework, cf. décision K.2).
    '../../../packages/docs/src/*.mdx',
    '../../../packages/docs/src/tokens/*.mdx',
    '../../../packages/docs/src/functional/*.mdx',
    '../../../packages/docs/src/angular/*.mdx',
    // Stories de composants Angular (composants d'app + Publishing)
    '../../../packages/angular/src/**/*.stories.@(ts|mdx)',
    '../../../packages/angular/marketing/**/*.stories.@(ts|mdx)',
    '../../../packages/angular/docs/**/*.stories.@(ts|mdx)',
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
    name: '@storybook/angular',
    options: {},
  },
  // Sert le dossier d'assets partagés (logo, favicon, etc.) sur /assets/.
  // La source de vérité est packages/docs/assets, mutualisée avec storybook-react.
  staticDirs: [{ from: '../../../packages/docs/assets', to: '/assets' }],
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
  },
};

export default config;
