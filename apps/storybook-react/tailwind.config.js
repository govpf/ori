import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './.storybook/**/*.{ts,tsx,mdx}',
    '../../packages/react/src/**/*.{ts,tsx,mdx}',
  ],
  // Les classes .ori-* sont parfois construites dynamiquement dans les composants
  // (ex: `ori-btn--${variant}`). Tailwind ne scanne que les classes littérales,
  // donc on force l'émission de tout le namespace .ori-* via la safelist.
  // Même règle que dans @govpf/ori-css → parité garantie.
  safelist: [{ pattern: /^ori-/ }],
};
