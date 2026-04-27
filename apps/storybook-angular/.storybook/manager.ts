import { addons } from '@storybook/manager-api';
import { buildTheme } from '../../../packages/docs/storybook/theme';

/**
 * Personnalisation de l'UI de Storybook (sidebar, header, branding).
 *
 * Le thème (couleurs, typo, radii) est défini dans @govpf/ori-docs et partagé
 * avec storybook-react. Seul le `brandTitle` diffère entre les deux instances.
 *
 * Pour modifier les couleurs : packages/docs/storybook/theme.ts
 * Pour modifier le logo : packages/docs/assets/logo-pf.svg
 */
addons.setConfig({
  theme: buildTheme('ANGULAR'),
});
