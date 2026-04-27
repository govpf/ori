import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,html}',
    // Important : scanner aussi le code de @govpf/ori-angular pour que les classes
    // .ori-* utilisées par les composants soient présentes dans le bundle CSS.
    '../../packages/angular/src/**/*.{ts,html}',
  ],
  // Safelist du namespace .ori-* : sécurité supplémentaire si certains composants
  // construisent leurs classes dynamiquement.
  safelist: [{ pattern: /^ori-/ }],
};
