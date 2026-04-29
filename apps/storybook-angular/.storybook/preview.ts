import type { Preview } from '@storybook/angular';

/**
 * Synchronisation manuelle du thème (cf. preview.ts du Storybook React).
 * `withThemeByDataAttribute` ne posait pas l'attribut sur `<html>` du
 * preview iframe dans cette version - on remplace par un decorator
 * manuel + un init au chargement.
 *
 * Limite acceptée pour les pages MDX (JSX inline) : le toggle ne bascule
 * pas en live. Workaround : passer par une story d'abord, puis revenir
 * vers le MDX - l'attribut sur `<html>` est conservé.
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
      // imports dans cette config). Synchronisé avec le preview React.
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
            'Validation accessibilité',
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
    (storyFn, context) => {
      const theme = (context.globals['theme'] as string | undefined) ?? 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      return storyFn();
    },
  ],
};

export default preview;
