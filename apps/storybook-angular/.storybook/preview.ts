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
      // Ordre de la sidebar : doit être inline (Storybook 8 ne suit pas les imports
      // dans cette config). Si on modifie, penser à synchroniser le preview React.
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
          'Angular',
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
