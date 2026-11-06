// Copie le bundle CSS Ori, la police Inter et le crest officiel PF à côté
// du fascicule pour qu'il se charge en relatif (aperçu et impression,
// y compris hors-ligne). Lancé via les hooks `predev` et `prebuild`.
//
// Arborescence produite :
//   css/ori.min.css          <- packages/css/dist
//   assets/fonts/*.ttf       <- packages/tokens/assets/fonts
//   assets/logo-pf.svg       <- packages/docs/assets
//
// ori.min.css référence ses polices en `../assets/fonts/…` : placer le CSS
// dans css/ et les polices dans assets/fonts/ garantit que Inter est bien
// embarquée (sans elle, le rendu imprimé retombe sur la police système).

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

const cssSrc = path.join(root, 'packages/css/dist');
const fontsSrc = path.join(root, 'packages/tokens/assets/fonts');
const docsAssets = path.join(root, 'packages/docs/assets');

mkdirSync(path.join(here, 'css'), { recursive: true });
mkdirSync(path.join(here, 'assets/fonts'), { recursive: true });

copyFileSync(path.join(cssSrc, 'ori.min.css'), path.join(here, 'css/ori.min.css'));
for (const f of readdirSync(fontsSrc).filter((f) => f.endsWith('.ttf'))) {
  copyFileSync(path.join(fontsSrc, f), path.join(here, 'assets/fonts', f));
}
copyFileSync(path.join(docsAssets, 'logo-pf.svg'), path.join(here, 'assets/logo-pf.svg'));

console.log('[copy-assets] ori.min.css, polices Inter et logo-pf.svg copiés');
