import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', './index.html', '../../packages/react/src/**/*.{ts,tsx}'],
  // Les classes .ori-* sont parfois construites dynamiquement (ex:
  // `ori-button--${variant}`). Tailwind ne scanne que les classes littérales,
  // donc on force l'émission de tout le namespace via la safelist.
  // Même règle que dans @govpf/ori-css → parité garantie.
  safelist: [{ pattern: /^ori-/ }],
};
