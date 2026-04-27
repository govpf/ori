import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` doit correspondre au chemin où l'app est servie. En production,
// on déploie sur ori.gov.pf/demo/ via le workflow GitHub Pages composé
// (cf. .github/workflows/deploy.yml). En dev, on reste à la racine.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/demo/' : '/',
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
}));
