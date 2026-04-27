/**
 * Données de fondations pour les pages de doc.
 *
 * Source de vérité : packages/tokens/build/css/tokens.css.
 * Ce fichier duplique les valeurs pour pouvoir les afficher (les .mdx ne
 * peuvent pas lire le CSS au build pour en extraire les valeurs hex).
 *
 * Si un token change dans tokens.css, il faut le synchroniser ici.
 */

export interface Shade {
  shade: string;
  hex: string;
  rgb?: string;
}

export interface Palette {
  family: string;
  description: string;
  shades: Shade[];
}

export const palettes: Palette[] = [
  {
    family: 'primary',
    description: 'Couleur de marque Ori (bleu administratif PF).',
    shades: [
      { shade: '50', hex: '#e9eeff' },
      { shade: '100', hex: '#c5d1ff' },
      { shade: '200', hex: '#a1b4ff' },
      { shade: '300', hex: '#7d96ff' },
      { shade: '400', hex: '#5980ff' },
      { shade: '500', hex: '#073ca5' },
      { shade: '600', hex: '#062f88' },
      { shade: '700', hex: '#05236b' },
      { shade: '800', hex: '#04184e' },
      { shade: '900', hex: '#030d31' },
      { shade: '950', hex: '#02071f' },
    ],
  },
  {
    family: 'neutral',
    description: 'Échelle de gris pour textes, surfaces, bordures.',
    shades: [
      { shade: '0', hex: '#ffffff' },
      { shade: '50', hex: '#fafafa' },
      { shade: '100', hex: '#f4f4f5' },
      { shade: '200', hex: '#e4e4e7' },
      { shade: '300', hex: '#d4d4d8' },
      { shade: '400', hex: '#a1a1aa' },
      { shade: '500', hex: '#71717a' },
      { shade: '600', hex: '#52525b' },
      { shade: '700', hex: '#3f3f46' },
      { shade: '800', hex: '#27272a' },
      { shade: '900', hex: '#18181b' },
      { shade: '950', hex: '#09090b' },
    ],
  },
  {
    family: 'danger',
    description: "Erreurs critiques, suppressions, états bloquants.",
    shades: [
      { shade: '50', hex: '#fff1f2' },
      { shade: '100', hex: '#fbd2d7' },
      { shade: '200', hex: '#f6a9b3' },
      { shade: '300', hex: '#ef7f8d' },
      { shade: '400', hex: '#dd324f' },
      { shade: '500', hex: '#cf0921' },
      { shade: '600', hex: '#a8071b' },
      { shade: '700', hex: '#820515' },
      { shade: '800', hex: '#5c030f' },
      { shade: '900', hex: '#360208' },
      { shade: '950', hex: '#210105' },
    ],
  },
  {
    family: 'success',
    description: 'Confirmations, validations, succès.',
    shades: [
      { shade: '50', hex: '#e6f9ef' },
      { shade: '100', hex: '#b8edd0' },
      { shade: '200', hex: '#7cd9a6' },
      { shade: '400', hex: '#2ec97d' },
      { shade: '500', hex: '#0bb25a' },
      { shade: '600', hex: '#089048' },
      { shade: '700', hex: '#066d36' },
    ],
  },
  {
    family: 'warning',
    description: 'Avertissements, points de vigilance.',
    shades: [
      { shade: '50', hex: '#fff7ed' },
      { shade: '100', hex: '#ffedd5' },
      { shade: '200', hex: '#fed7aa' },
      { shade: '400', hex: '#fb923c' },
      { shade: '500', hex: '#f97316' },
      { shade: '600', hex: '#ea580c' },
      { shade: '700', hex: '#c2410c' },
    ],
  },
];

export interface SemanticToken {
  name: string;
  varName: string;
  hint?: string;
  resolvesTo: string;
}

export interface SemanticGroup {
  category: string;
  description: string;
  tokens: SemanticToken[];
}

export const semanticGroups: SemanticGroup[] = [
  {
    category: 'Marque',
    description: "Couleur primaire et ses déclinaisons d'état.",
    tokens: [
      { name: 'brand / primary', varName: '--color-brand-primary', resolvesTo: '--color-primary-500' },
      { name: 'brand / primary-hover', varName: '--color-brand-primary-hover', resolvesTo: '--color-primary-600' },
      { name: 'brand / primary-active', varName: '--color-brand-primary-active', resolvesTo: '--color-primary-700' },
      { name: 'brand / primary-subtle', varName: '--color-brand-primary-subtle', resolvesTo: '--color-primary-50' },
      { name: 'brand / on-primary', varName: '--color-brand-on-primary', hint: 'texte sur fond primary', resolvesTo: '--color-neutral-0' },
    ],
  },
  {
    category: 'Surfaces',
    description: 'Fonds des conteneurs (page, cartes, sections).',
    tokens: [
      { name: 'surface / base', varName: '--color-surface-base', hint: 'fond principal de la page', resolvesTo: '--color-neutral-0' },
      { name: 'surface / muted', varName: '--color-surface-muted', hint: 'sections atténuées', resolvesTo: '--color-neutral-50' },
      { name: 'surface / subtle', varName: '--color-surface-subtle', hint: 'séparation discrète', resolvesTo: '--color-neutral-100' },
      { name: 'surface / inverse', varName: '--color-surface-inverse', hint: 'fond sombre (banner, code)', resolvesTo: '--color-neutral-900' },
    ],
  },
  {
    category: 'Texte',
    description: 'Hiérarchie de couleurs pour le texte.',
    tokens: [
      { name: 'text / primary', varName: '--color-text-primary', hint: 'corps de texte', resolvesTo: '--color-neutral-900' },
      { name: 'text / secondary', varName: '--color-text-secondary', hint: 'titres secondaires, métadonnées', resolvesTo: '--color-neutral-600' },
      { name: 'text / muted', varName: '--color-text-muted', hint: 'aide, légendes', resolvesTo: '--color-neutral-500' },
      { name: 'text / inverse', varName: '--color-text-inverse', hint: 'sur fond sombre', resolvesTo: '--color-neutral-0' },
      { name: 'text / disabled', varName: '--color-text-disabled', hint: 'éléments désactivés', resolvesTo: '--color-neutral-400' },
      { name: 'text / link', varName: '--color-text-link', hint: 'liens hypertexte', resolvesTo: '--color-primary-500' },
    ],
  },
  {
    category: 'Bordures',
    description: 'Lignes de séparation et contours.',
    tokens: [
      { name: 'border / subtle', varName: '--color-border-subtle', hint: 'séparation discrète', resolvesTo: '--color-neutral-200' },
      { name: 'border / default', varName: '--color-border-default', hint: 'bordure standard (input, card)', resolvesTo: '--color-neutral-300' },
      { name: 'border / strong', varName: '--color-border-strong', hint: 'bordure marquée', resolvesTo: '--color-neutral-500' },
      { name: 'border / focus', varName: '--color-border-focus', hint: 'anneau de focus', resolvesTo: '--color-primary-500' },
    ],
  },
  {
    category: 'Feedback',
    description: 'Couleurs sémantiques pour les états applicatifs.',
    tokens: [
      { name: 'feedback / success', varName: '--color-feedback-success', resolvesTo: '--color-success-500' },
      { name: 'feedback / warning', varName: '--color-feedback-warning', resolvesTo: '--color-warning-500' },
      { name: 'feedback / danger', varName: '--color-feedback-danger', resolvesTo: '--color-danger-500' },
      { name: 'feedback / info', varName: '--color-feedback-info', resolvesTo: '--color-info-500' },
    ],
  },
];

export interface FontSize {
  name: string;
  varName: string;
  rem: string;
  px: string;
  usage?: string;
}

export const fontSizes: FontSize[] = [
  { name: '4xl', varName: '--font-size-4xl', rem: '2.25rem', px: '36px', usage: 'Titres de page (h1)' },
  { name: '3xl', varName: '--font-size-3xl', rem: '1.875rem', px: '30px', usage: 'Titres de section (h2)' },
  { name: '2xl', varName: '--font-size-2xl', rem: '1.5rem', px: '24px', usage: 'Sous-titres (h3)' },
  { name: 'xl', varName: '--font-size-xl', rem: '1.25rem', px: '20px', usage: 'Titres de carte' },
  { name: 'lg', varName: '--font-size-lg', rem: '1.125rem', px: '18px', usage: 'Texte mis en valeur' },
  { name: 'base', varName: '--font-size-base', rem: '1rem', px: '16px', usage: 'Corps de texte par défaut' },
  { name: 'sm', varName: '--font-size-sm', rem: '0.875rem', px: '14px', usage: 'Texte secondaire, formulaires' },
  { name: 'xs', varName: '--font-size-xs', rem: '0.75rem', px: '12px', usage: 'Légendes, badges, labels' },
];

export interface FontWeight {
  name: string;
  varName: string;
  weight: number;
  usage?: string;
}

export const fontWeights: FontWeight[] = [
  { name: 'regular', varName: '--font-weight-regular', weight: 400, usage: 'Corps de texte courant' },
  { name: 'medium', varName: '--font-weight-medium', weight: 500, usage: 'Légère emphase, libellés' },
  { name: 'semibold', varName: '--font-weight-semibold', weight: 600, usage: 'Titres et boutons' },
  { name: 'bold', varName: '--font-weight-bold', weight: 700, usage: 'Emphase forte, h1' },
];

export interface LineHeight {
  name: string;
  varName: string;
  value: string;
  usage?: string;
}

export const lineHeights: LineHeight[] = [
  { name: 'tight', varName: '--font-line-height-tight', value: '1.25', usage: 'Titres, libellés courts' },
  { name: 'normal', varName: '--font-line-height-normal', value: '1.5', usage: 'Corps de texte courant' },
  { name: 'relaxed', varName: '--font-line-height-relaxed', value: '1.75', usage: 'Texte long, lecture longue' },
];

export interface Spacing {
  shade: string;
  varName: string;
  rem: string;
  px: string;
  usage?: string;
}

export const spacings: Spacing[] = [
  { shade: '0', varName: '--spacing-0', rem: '0', px: '0px' },
  { shade: '1', varName: '--spacing-1', rem: '0.25rem', px: '4px', usage: 'Gap minimal entre icône et texte' },
  { shade: '2', varName: '--spacing-2', rem: '0.5rem', px: '8px', usage: 'Padding compact, gap intra-composant' },
  { shade: '3', varName: '--spacing-3', rem: '0.75rem', px: '12px' },
  { shade: '4', varName: '--spacing-4', rem: '1rem', px: '16px', usage: 'Padding standard de carte' },
  { shade: '5', varName: '--spacing-5', rem: '1.25rem', px: '20px' },
  { shade: '6', varName: '--spacing-6', rem: '1.5rem', px: '24px', usage: 'Padding ample, gap entre cartes' },
  { shade: '8', varName: '--spacing-8', rem: '2rem', px: '32px' },
  { shade: '10', varName: '--spacing-10', rem: '2.5rem', px: '40px' },
  { shade: '12', varName: '--spacing-12', rem: '3rem', px: '48px' },
  { shade: '16', varName: '--spacing-16', rem: '4rem', px: '64px', usage: 'Section de page' },
  { shade: '20', varName: '--spacing-20', rem: '5rem', px: '80px' },
  { shade: '24', varName: '--spacing-24', rem: '6rem', px: '96px' },
];

export interface Radius {
  name: string;
  varName: string;
  value: string;
  usage?: string;
}

export const radii: Radius[] = [
  { name: 'none', varName: '--radius-none', value: '0', usage: 'Carré (tableaux, cellules)' },
  { name: 'sm', varName: '--radius-sm', value: '0.25rem', usage: 'Étiquettes, badges' },
  { name: 'md', varName: '--radius-md', value: '0.375rem', usage: 'Boutons, inputs (par défaut)' },
  { name: 'lg', varName: '--radius-lg', value: '0.5rem', usage: 'Cartes, dialogs' },
  { name: 'xl', varName: '--radius-xl', value: '0.75rem', usage: 'Surfaces larges' },
  { name: '2xl', varName: '--radius-2xl', value: '1rem', usage: 'Hero, sections marketing' },
  { name: 'full', varName: '--radius-full', value: '9999px', usage: 'Pastilles, avatars' },
];

export interface Shadow {
  name: string;
  varName: string;
  usage?: string;
}

export const shadows: Shadow[] = [
  { name: 'sm', varName: '--shadow-sm', usage: 'Élévation légère (carte au repos)' },
  { name: 'md', varName: '--shadow-md', usage: 'Bouton flottant, dropdown' },
  { name: 'lg', varName: '--shadow-lg', usage: 'Popover, tooltip étendu' },
  { name: 'xl', varName: '--shadow-xl', usage: 'Dialog modale, drawer' },
];
