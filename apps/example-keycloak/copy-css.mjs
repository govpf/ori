// Copie ds.css + crest officiel PF à côté des pages Keycloak. Lancé via
// les hooks `predev` et `prebuild`.

import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssSrc = path.resolve(__dirname, '../../packages/css/dist');
const assetsSrc = path.resolve(__dirname, '../../packages/docs/assets');

for (const f of ['ori.css', 'ori.min.css', 'tokens.css']) {
  copyFileSync(path.join(cssSrc, f), path.join(__dirname, f));
}

// Le crest officiel est embarqué dans le DS (cf. décision J.4) : on
// utilise toujours le SVG livré par packages/docs/assets, jamais un
// placeholder.
copyFileSync(path.join(assetsSrc, 'logo-pf.svg'), path.join(__dirname, 'logo-pf.svg'));
