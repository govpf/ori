import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./src/**/*.{css,html}'],
  // safelist : garantit que TOUTES les classes sémantiques .ori-* apparaissent
  // dans ori.css même si aucun HTML ne les référence (c'est le principe du bundle
  // statique drop-in - il doit être self-contained).
  safelist: [{ pattern: /^ori-/ }],
};
