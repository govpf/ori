import type { Preview } from '@storybook/react';
import './preview.css';

/**
 * Synchronisation manuelle du thème.
 *
 * Constat : `withThemeByDataAttribute` (de @storybook/addon-themes) ne posait
 * pas l'attribut `data-theme` sur le `<html>` du preview iframe dans cette
 * version. On remplace par un decorator manuel + un init au chargement.
 *
 * Limite acceptée : pour les pages MDX (avec JSX inline), le toggle de la
 * toolbar ne bascule pas le rendu en live. Workaround : cliquer le toggle
 * dans une story d'abord, puis naviguer vers le MDX - l'attribut posé sur
 * `<html>` est conservé entre navigations.
 */
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', 'light');
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Thème de la palette Ori',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Clair', icon: 'sun' },
          { value: 'dark', title: 'Sombre', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    layout: 'centered',
    options: {
      // Ordre de la sidebar. Doit être inline (Storybook 8 ne suit pas les
      // imports dans cette config). Synchronisé avec le preview Angular.
      storySort: {
        order: [
          'Introduction',
          [
            'Bienvenue',
            'Installation React',
            'Installation Angular',
            'Patterns React',
            'Patterns Angular',
            'Différences React ↔ Angular',
          ],
          'Fondations',
          [
            'Iconographie',
            'Tokens',
            ['Palette', 'Sémantique', 'Typographie', 'Spacing', 'Radii', 'Shadows'],
          ],
          'Composants',
          [
            'Actions',
            ['Button', 'Link', 'AuthButton', 'LanguageSwitcher'],
            'Saisie',
            [
              'Input',
              'Textarea',
              'Select',
              'Checkbox',
              'Radio',
              'Switch',
              'DatePicker',
              'FileUpload',
            ],
            'Affichage',
            [
              'Card',
              'Tag',
              'Avatar',
              'Logo',
              'Highlight',
              'Skeleton',
              'Progress',
              'Statistic',
              'FileCard',
              'ErrorPage',
            ],
            'Feedback',
            ['Alert', 'Notification', 'Toast', 'Dialog', 'Tooltip'],
            'Navigation',
            [
              'Header',
              'Footer',
              'MainNavigation',
              'SideMenu',
              'Breadcrumb',
              'Tabs',
              'Steps',
              'Pagination',
            ],
            'Données',
            ['Table', 'Timeline'],
            'Mise en page',
            ['Accordion', 'Legal'],
          ],
          'Patterns',
          [
            'Marketing',
            ['Hero', 'FeatureGrid'],
            'Documentation',
            ['Callout', 'CodeBlock', 'Toc'],
            'Fonctionnels',
            [
              'Keycloak',
              [
                'AuthLogin',
                'AuthRegister',
                'AuthResetPassword',
                'AuthUpdatePassword',
                'AuthOtp',
                'AuthSessionExpired',
                'AuthError',
              ],
            ],
          ],
          'Décisions',
          ['Décisions de design', 'Décisions à prendre', "Stratégie d'ouverture"],
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals['theme'] as string | undefined) ?? 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      return Story(context);
    },
  ],
  // autodocs activé au cas-par-cas (dans chaque story meta) plutôt que
  // globalement : les composants à portail (Dialog) plantent en mode docs
  // automatique. Mieux vaut être explicite.
};

export default preview;
