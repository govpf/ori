/**
 * Preset Tailwind Ori.
 *
 * Consomme les tokens générés par @govpf/ori-tokens et expose la configuration
 * `theme.extend` + un plugin qui enregistre les classes sémantiques
 * (.ori-btn, .ori-card, etc.) - ces dernières sont la VRAIE API publique
 * du design system pour garantir la parité avec le CSS statique.
 */
import tokensPreset from '@govpf/ori-tokens/tailwind';
import { componentsPlugin } from './plugin-components.js';

/** @type {import('tailwindcss').Config} */
const preset = {
  ...tokensPreset,
  plugins: [componentsPlugin],
};

export default preset;
