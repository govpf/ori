#!/usr/bin/env node
/**
 * Test de parité visuelle entre les Storybook React et Angular d'Ori.
 *
 * Pour chaque story qui existe dans les deux frameworks (clé : `title +
 * name`), prend un screenshot du `#storybook-root` côté React et côté
 * Angular, puis compare les deux pixels-à-pixel via pixelmatch.
 *
 * Sortie :
 *   - `output/images/<story-id>/{react,angular,diff}.png` : captures + diff
 *   - `output/report.html` : rapport HTML lisible (ouverture directe dans
 *     un navigateur, pas besoin d'host)
 *   - `output/results.json` : résultats bruts (pour l'usage CI)
 *
 * Codes de sortie :
 *   - 0 : toutes les stories communes sont en parité (diff < THRESHOLD)
 *   - 1 : au moins une story diverge ou erreur d'exécution
 *
 * Variables d'env :
 *   - REACT_URL (default http://localhost:6006)
 *   - ANGULAR_URL (default http://localhost:6008)
 *   - THRESHOLD (default 0.01 = 1% de pixels différents toléré)
 *   - PIXEL_THRESHOLD (default 0.1 = sensibilité de pixelmatch par pixel)
 *   - VIEWPORT_WIDTH / VIEWPORT_HEIGHT (default 1280 / 800)
 *   - SETTLE_MS (default 500 = ms d'attente après render avant capture)
 *   - SKIP_TAGS (default 'skip-visual,docs-only,test-only')
 *
 * Le test n'échoue jamais sur les stories absentes d'un framework. La
 * couverture comparable est limitée aux paires existantes.
 */

import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const REACT_URL = process.env.REACT_URL || 'http://localhost:6006';
const ANGULAR_URL = process.env.ANGULAR_URL || 'http://localhost:6008';
const THRESHOLD = Number(process.env.THRESHOLD || '0.01');
// Calibration post run #2 (2026-05-01) : avec 0.1, beaucoup de stories
// dont le rendu est visuellement identique entre React et Angular
// remontaient comme divergentes à ~10 % à cause du sub-pixel font
// rendering différent entre les deux. 0.2 absorbe ce bruit sans masquer
// les vrais drifts (ex: layouts cassés, classes manquantes).
const PIXEL_THRESHOLD = Number(process.env.PIXEL_THRESHOLD || '0.2');
const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH || '1280');
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT || '800');
const SETTLE_MS = Number(process.env.SETTLE_MS || '500');
const SKIP_TAGS = (process.env.SKIP_TAGS || 'skip-visual,docs-only,test-only')
  .split(',')
  .map((t) => t.trim());

const OUT = path.join(__dirname, 'output');
const IMG_DIR = path.join(OUT, 'images');

function log(...args) {
  // eslint-disable-next-line no-console
  console.log('[visual-parity]', ...args);
}

function err(...args) {
  // eslint-disable-next-line no-console
  console.error('[visual-parity]', ...args);
}

async function fetchIndex(baseUrl) {
  const res = await fetch(`${baseUrl}/index.json`);
  if (!res.ok) throw new Error(`Failed to fetch ${baseUrl}/index.json (${res.status})`);
  return res.json();
}

function commonStories(reactIndex, angularIndex) {
  const reactStories = Object.values(reactIndex.entries).filter(
    (e) => e.type === 'story' && !(e.tags || []).some((t) => SKIP_TAGS.includes(t)),
  );
  const angularStories = Object.values(angularIndex.entries).filter(
    (e) => e.type === 'story' && !(e.tags || []).some((t) => SKIP_TAGS.includes(t)),
  );
  const angularByKey = new Map();
  for (const s of angularStories) angularByKey.set(`${s.title}::${s.name}`, s);

  const pairs = [];
  for (const r of reactStories) {
    const key = `${r.title}::${r.name}`;
    const a = angularByKey.get(key);
    if (a) pairs.push({ key, title: r.title, name: r.name, react: r, angular: a });
  }
  // Stories qui existent côté React mais pas Angular (et vice-versa) :
  // utile pour le rapport mais ne fait pas échouer le test.
  const onlyReact = reactStories
    .filter((r) => !angularByKey.has(`${r.title}::${r.name}`))
    .map((s) => ({ key: `${s.title}::${s.name}`, title: s.title, name: s.name }));
  const reactKeys = new Set(reactStories.map((r) => `${r.title}::${r.name}`));
  const onlyAngular = angularStories
    .filter((a) => !reactKeys.has(`${a.title}::${a.name}`))
    .map((s) => ({ key: `${s.title}::${s.name}`, title: s.title, name: s.name }));

  return { pairs, onlyReact, onlyAngular };
}

async function captureStory(page, baseUrl, storyId) {
  const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Attente du root storybook (présent dès que le composant est monté).
  await page.waitForSelector('#storybook-root', { timeout: 15000 });
  // Stabilisation : laisser le temps aux animations / fonts de se poser.
  await page.waitForTimeout(SETTLE_MS);
  return page.locator('#storybook-root').screenshot({ type: 'png' });
}

function padToSameSize(a, b) {
  const w = Math.max(a.width, b.width);
  const h = Math.max(a.height, b.height);
  if (a.width === w && a.height === h && b.width === w && b.height === h) {
    return [a, b, w, h];
  }
  const padded = (src) => {
    const out = new PNG({ width: w, height: h });
    out.data.fill(255); // fond blanc, plus parlant que noir dans le diff
    PNG.bitblt(src, out, 0, 0, src.width, src.height, 0, 0);
    return out;
  };
  return [padded(a), padded(b), w, h];
}

function comparePngs(reactBuf, angularBuf) {
  const a = PNG.sync.read(reactBuf);
  const b = PNG.sync.read(angularBuf);
  const [pa, pb, w, h] = padToSameSize(a, b);
  const diff = new PNG({ width: w, height: h });
  const diffPixels = pixelmatch(pa.data, pb.data, diff.data, w, h, {
    threshold: PIXEL_THRESHOLD,
  });
  const total = w * h;
  const ratio = total === 0 ? 0 : diffPixels / total;
  return { reactPng: pa, angularPng: pb, diffPng: diff, diffPixels, total, ratio };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function generateReport({ pairs, onlyReact, onlyAngular, results }) {
  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);
  const errored = results.filter((r) => r.error);

  const rows = results
    .slice()
    .sort((a, b) => (b.ratio || 0) - (a.ratio || 0))
    .map((r) => {
      const id = r.react?.id || r.key;
      const dir = `images/${id}`;
      const status = r.error ? 'error' : r.passed ? 'pass' : 'fail';
      const ratioPct = r.ratio !== undefined ? (r.ratio * 100).toFixed(3) + '%' : '-';
      const imgs = r.error
        ? `<td colspan="3" class="error-cell">${escapeHtml(r.error)}</td>`
        : `
        <td><img loading="lazy" src="${dir}/react.png" alt="React" /></td>
        <td><img loading="lazy" src="${dir}/angular.png" alt="Angular" /></td>
        <td><img loading="lazy" src="${dir}/diff.png" alt="Diff" /></td>`;
      return `
      <tr class="row-${status}">
        <td><span class="badge badge-${status}">${status.toUpperCase()}</span></td>
        <td>${escapeHtml(r.title)}<br><small>${escapeHtml(r.name)}</small></td>
        <td class="num">${ratioPct}</td>
        ${imgs}
      </tr>`;
    })
    .join('\n');

  const onlyList = (arr, framework) =>
    arr.length === 0
      ? `<p class="muted">Aucune story uniquement côté ${framework}.</p>`
      : `<ul>${arr
          .map((s) => `<li>${escapeHtml(s.title)} - ${escapeHtml(s.name)}</li>`)
          .join('')}</ul>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Visual parity React ↔ Angular - Ori</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; color: #1a1a1a; background: #f7f7f7; }
  header { background: #073ca5; color: #fff; padding: 1.5rem 2rem; }
  h1 { margin: 0 0 0.25rem 0; font-size: 1.25rem; }
  .summary { display: flex; gap: 2rem; margin-top: 1rem; flex-wrap: wrap; }
  .summary div { background: rgba(255,255,255,0.12); padding: 0.5rem 1rem; border-radius: 6px; }
  .summary strong { display: block; font-size: 1.5rem; }
  main { padding: 1.5rem 2rem; max-width: 1600px; margin: 0 auto; }
  table { width: 100%; border-collapse: collapse; background: #fff; }
  th, td { padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; border-bottom: 1px solid #e5e5e5; font-size: 0.875rem; }
  th { background: #f0f0f0; position: sticky; top: 0; }
  td.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
  td img { max-width: 100%; max-height: 220px; border: 1px solid #e0e0e0; }
  .row-pass { background: #fafffa; }
  .row-fail { background: #fff5f5; }
  .row-error { background: #fffaf0; }
  .badge { padding: 0.125rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  .badge-pass { background: #e0f8e0; color: #1a7f1a; }
  .badge-fail { background: #fde0e0; color: #b40000; }
  .badge-error { background: #fde6c0; color: #8a4a00; }
  .error-cell { color: #8a4a00; font-family: ui-monospace, monospace; font-size: 0.8125rem; }
  details { margin-top: 1.5rem; background: #fff; padding: 0.75rem 1rem; border-radius: 6px; }
  summary { cursor: pointer; font-weight: 600; }
  .muted { color: #666; }
  .config { background: #fff; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.8125rem; color: #444; }
  .config code { background: #f0f0f0; padding: 0.0625rem 0.25rem; border-radius: 3px; }
</style>
</head>
<body>
<header>
  <h1>Visual parity Storybook React ↔ Angular - Ori</h1>
  <div class="summary">
    <div><strong>${pairs.length}</strong> paires comparées</div>
    <div><strong>${passed.length}</strong> en parité</div>
    <div><strong>${failed.length}</strong> divergences</div>
    <div><strong>${errored.length}</strong> erreurs</div>
  </div>
</header>
<main>
  <p class="config">
    Threshold global : <code>${(THRESHOLD * 100).toFixed(2)}%</code> de pixels divergents par story.
    Sensibilité pixel : <code>${PIXEL_THRESHOLD}</code>. Viewport : <code>${VIEWPORT_WIDTH}×${VIEWPORT_HEIGHT}</code>.
    Tags exclus : <code>${SKIP_TAGS.join(', ')}</code>.
  </p>
  <table>
    <thead>
      <tr><th>Statut</th><th>Story</th><th>Diff</th><th>React</th><th>Angular</th><th>Diff visuel</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <details>
    <summary>Stories uniquement côté React (${onlyReact.length})</summary>
    ${onlyList(onlyReact, 'React')}
  </details>
  <details>
    <summary>Stories uniquement côté Angular (${onlyAngular.length})</summary>
    ${onlyList(onlyAngular, 'Angular')}
  </details>
</main>
</body>
</html>`;
}

async function main() {
  log('Threshold', THRESHOLD, '· pixel threshold', PIXEL_THRESHOLD);
  log('React URL', REACT_URL);
  log('Angular URL', ANGULAR_URL);

  mkdirSync(OUT, { recursive: true });
  mkdirSync(IMG_DIR, { recursive: true });

  log('Récupération des index.json…');
  const [reactIndex, angularIndex] = await Promise.all([
    fetchIndex(REACT_URL),
    fetchIndex(ANGULAR_URL),
  ]);

  const { pairs, onlyReact, onlyAngular } = commonStories(reactIndex, angularIndex);
  log(`${pairs.length} paires de stories communes (skip ${SKIP_TAGS.join(', ')}).`);
  log(`Uniquement React : ${onlyReact.length} · uniquement Angular : ${onlyAngular.length}`);

  if (pairs.length === 0) {
    err('Aucune paire de stories à comparer. Vérifier les Storybooks et les SKIP_TAGS.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const reactCtx = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const angularCtx = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const reactPage = await reactCtx.newPage();
  const angularPage = await angularCtx.newPage();

  const results = [];
  let i = 0;
  for (const pair of pairs) {
    i += 1;
    process.stdout.write(`\r[${i}/${pairs.length}] ${pair.key.padEnd(60).slice(0, 60)}`);
    try {
      const [reactBuf, angularBuf] = await Promise.all([
        captureStory(reactPage, REACT_URL, pair.react.id),
        captureStory(angularPage, ANGULAR_URL, pair.angular.id),
      ]);
      const cmp = comparePngs(reactBuf, angularBuf);

      const dir = path.join(IMG_DIR, pair.react.id);
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, 'react.png'), PNG.sync.write(cmp.reactPng));
      writeFileSync(path.join(dir, 'angular.png'), PNG.sync.write(cmp.angularPng));
      writeFileSync(path.join(dir, 'diff.png'), PNG.sync.write(cmp.diffPng));

      const passed = cmp.ratio <= THRESHOLD;
      results.push({
        key: pair.key,
        title: pair.title,
        name: pair.name,
        react: pair.react,
        angular: pair.angular,
        passed,
        diffPixels: cmp.diffPixels,
        total: cmp.total,
        ratio: cmp.ratio,
      });
    } catch (e) {
      results.push({
        key: pair.key,
        title: pair.title,
        name: pair.name,
        react: pair.react,
        angular: pair.angular,
        passed: false,
        error: e.message,
      });
    }
  }
  process.stdout.write('\n');

  await browser.close();

  // Persistance des résultats.
  const failed = results.filter((r) => !r.passed && !r.error);
  const errored = results.filter((r) => r.error);
  const summary = {
    threshold: THRESHOLD,
    pixelThreshold: PIXEL_THRESHOLD,
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    pairs: pairs.length,
    passed: results.filter((r) => r.passed).length,
    failed: failed.length,
    errored: errored.length,
    onlyReact: onlyReact.length,
    onlyAngular: onlyAngular.length,
    results: results.map((r) => ({
      key: r.key,
      title: r.title,
      name: r.name,
      reactId: r.react?.id,
      angularId: r.angular?.id,
      passed: r.passed,
      ratio: r.ratio,
      diffPixels: r.diffPixels,
      total: r.total,
      error: r.error || null,
    })),
  };
  writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(summary, null, 2));
  writeFileSync(
    path.join(OUT, 'report.html'),
    generateReport({ pairs, onlyReact, onlyAngular, results }),
  );

  log(`Résumé : ${summary.passed} pass · ${summary.failed} fail · ${summary.errored} error`);
  log(`Rapport HTML : ${path.relative(REPO_ROOT, path.join(OUT, 'report.html'))}`);

  if (failed.length > 0 || errored.length > 0) {
    err(
      `${failed.length} story(s) divergent et ${errored.length} en erreur. ` +
        'Voir output/report.html pour le détail.',
    );
    process.exit(1);
  }
}

main().catch((e) => {
  err(e);
  process.exit(1);
});
