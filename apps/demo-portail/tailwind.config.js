import preset from '@govpf/ori-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', './index.html', '../../packages/react/src/**/*.{ts,tsx}'],
  safelist: [{ pattern: /^ori-/ }],
};
