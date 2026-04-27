/** @type {import('tailwindcss').Config} */
import preset from '@govpf/ori-tailwind-preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    '../../packages/react/src/**/*.{ts,tsx}',
  ],
};
