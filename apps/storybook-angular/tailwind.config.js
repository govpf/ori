import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,html}',
    './.storybook/**/*.{ts,html}',
    '../../packages/angular/src/**/*.{ts,html}',
  ],
  // Même règle que côté React Storybook : safelist le namespace .ori-* pour
  // que toutes les classes soient présentes même si construites dynamiquement.
  safelist: [{ pattern: /^ori-/ }],
};
