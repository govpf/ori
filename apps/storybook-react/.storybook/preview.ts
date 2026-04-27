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
      // Ordre de la sidebar : doit être inline (Storybook 8 ne suit pas les imports
      // dans cette config). Si on modifie, penser à synchroniser le preview Angular.
      storySort: {
        order: [
          'Documentation générale',
          [
            'Introduction',
            'Décisions de design',
            'Iconographie',
            'Tokens',
            ['Palette', 'Sémantique', 'Typographie', 'Spacing', 'Radii', 'Shadows'],
            'Composants graphiques',
            [
              'Button',
              'Input',
              'Textarea',
              'Select',
              'Checkbox',
              'Radio',
              'Switch',
              'DatePicker',
              'FileUpload',
              'Tabs',
              'Accordion',
              'Breadcrumb',
              'Pagination',
              'Steps',
              'Tag',
              'Avatar',
              'Tooltip',
              'Link',
              'Highlight',
              'Progress',
              'Skeleton',
              'Timeline',
              'Toast',
              'Notification',
              'Table',
              'Logo',
              'Header',
              'Footer',
              'MainNavigation',
              'SideMenu',
              'LanguageSwitcher',
              'Card',
              'Alert',
              'Dialog',
            ],
            'Différences React ↔ Angular',
            'Décisions à prendre',
          ],
          'React',
          ['Installation', 'Patterns'],
          'Composants graphiques',
          [
            'Button',
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'Radio',
            'Switch',
            'DatePicker',
            'FileUpload',
            'Tabs',
            'Accordion',
            'Breadcrumb',
            'Pagination',
            'Steps',
            'Tag',
            'Avatar',
            'Tooltip',
            'Link',
            'Highlight',
            'Progress',
            'Skeleton',
            'Timeline',
            'Toast',
            'Notification',
            'Table',
            'Logo',
            'Header',
            'Footer',
            'MainNavigation',
            'SideMenu',
            'LanguageSwitcher',
            'Card',
            'Alert',
            'Dialog',
          ],
          'Composants fonctionnels',
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
