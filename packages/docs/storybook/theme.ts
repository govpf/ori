import { create } from '@storybook/theming';

/**
 * Thème Storybook partagé pour les deux instances (React et Angular).
 *
 * Les valeurs sont alignées avec les tokens de `@govpf/ori-tokens` (palette `primary`,
 * `neutral`, etc.). On les duplique ici en dur plutôt que de les importer
 * dynamiquement, parce que :
 *
 *   - le bundle "manager" de Storybook est minimal (esbuild) et n'aime pas
 *     les imports de packages workspace dans une config ;
 *   - les couleurs de la chrome Storybook ne changent pas tous les jours.
 *
 * Si un token change, mettre à jour la valeur en miroir ici. Convention :
 * laisser en commentaire le nom du token correspondant.
 *
 * API utilisée : `create()` de `@storybook/theming`. C'est l'API publique
 * stable, garantie compatible entre versions majeures de Storybook.
 *
 * @param frameworkLabel  Étiquette du framework documenté (REACT ou ANGULAR).
 *                        Affichée à côté du logo dans la sidebar.
 *
 * Note : on n'utilise PAS `brandImage` parce que dans Storybook 8, quand
 * brandImage est défini il REMPLACE le brandTitle visuellement. Pour avoir
 * le logo ET le texte côte à côte, on injecte les deux en HTML directement
 * dans brandTitle (qui supporte le HTML inline).
 */
export const buildTheme = (frameworkLabel: string) =>
  create({
    base: 'light',

    // ─── Branding ──────────────────────────────────────────────────────────
    // HTML inline : logo PF + label framework. Le SVG est servi par staticDirs
    // (cf. main.ts) sur /assets/.
    brandTitle: `
      <span style="display:inline-flex; align-items:center; gap:10px;">
        <img src="./assets/logo-pf.svg" alt="Polynésie française" style="height:32px; width:auto;" />
        <span style="font-weight:600; color:#18181b; white-space:nowrap;">
          Design System
          <span style="color:#073CA5;">- ${frameworkLabel}</span>
        </span>
      </span>
    `,
    brandUrl: '#',
    brandTarget: '_self',

    // ─── Couleurs de marque ─────────────────────────────────────────────────
    colorPrimary: '#073CA5', // color.primary.500 (bleu roi PF)
    colorSecondary: '#062F88', // color.primary.600

    // ─── Surfaces ──────────────────────────────────────────────────────────
    appBg: '#fafafa', // color.neutral.50  - fond de la chrome
    appContentBg: '#ffffff', // color.surface.base
    appPreviewBg: '#ffffff',
    appBorderColor: '#e4e4e7', // color.neutral.200
    appBorderRadius: 8, // radius.lg

    // ─── Texte ─────────────────────────────────────────────────────────────
    textColor: '#18181b', // color.text.primary (neutral.900)
    textInverseColor: '#fafafa',
    textMutedColor: '#71717a', // color.neutral.500

    // ─── Toolbar ───────────────────────────────────────────────────────────
    barTextColor: '#52525b', // color.neutral.600
    barSelectedColor: '#073CA5',
    barHoverColor: '#062F88',
    barBg: '#ffffff',

    // ─── Form (controls panel) ─────────────────────────────────────────────
    inputBg: '#ffffff',
    inputBorder: '#d4d4d8', // color.neutral.300
    inputTextColor: '#18181b',
    inputBorderRadius: 6, // radius.md

    // ─── Typo ──────────────────────────────────────────────────────────────
    fontBase: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    fontCode: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
  });
