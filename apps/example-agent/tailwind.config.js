import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./src/**/*.{ts,html}', '../../packages/angular/src/**/*.{ts,html}'],
  safelist: [{ pattern: /^ori-/ }],
};
