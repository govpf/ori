#!/usr/bin/env node
/**
 * Orchestrateur dev local.
 *
 * Lance les 7 apps Ori en parallèle (chacune avec son live-reload natif)
 * et sert un dashboard HTML sur http://localhost:3000 qui regroupe les
 * URLs de chaque app et leur statut up/down.
 *
 * Usage : `pnpm dev:all` depuis la racine du repo.
 *
 * Ctrl+C tue toutes les apps en chaîne.
 */

import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import concurrently from 'concurrently';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const APPS = [
  {
    short: 'DASH',
    name: 'Dashboard',
    port: 3000,
    url: 'http://localhost:3000',
    color: 'magenta',
    command: `node ${JSON.stringify(path.join(__dirname, 'serve-dashboard.mjs'))}`,
  },
  {
    short: 'SB-R',
    name: 'Storybook React',
    port: 6006,
    url: 'http://localhost:6006',
    color: 'blue',
    command: 'pnpm --filter @govpf/ori-storybook-react storybook',
  },
  {
    short: 'SB-A',
    name: 'Storybook Angular',
    port: 6008,
    url: 'http://localhost:6008',
    color: 'cyan',
    command: 'pnpm --filter @govpf/ori-storybook-angular storybook',
  },
  {
    short: 'DEMO',
    name: 'Demo portail',
    port: 5174,
    url: 'http://localhost:5174',
    color: 'green',
    command: 'pnpm --filter @govpf/ori-demo-portail dev',
  },
  {
    short: 'SITE',
    name: 'Site Astro (ori.gov.pf)',
    port: 4321,
    url: 'http://localhost:4321',
    color: 'yellow',
    command: 'pnpm --filter @govpf/ori-site dev',
  },
  {
    short: 'PG-R',
    name: 'Playground React',
    port: 5173,
    url: 'http://localhost:5173',
    color: 'red',
    command: 'pnpm --filter @govpf/ori-playground-react dev',
  },
  {
    short: 'PG-A',
    name: 'Playground Angular',
    port: 4200,
    url: 'http://localhost:4200',
    color: 'gray',
    command: 'pnpm --filter @govpf/ori-playground-angular start',
  },
  {
    short: 'PG-S',
    name: 'Playground statique',
    port: 4173,
    url: 'http://localhost:4173',
    color: 'white',
    command: 'pnpm --filter @govpf/ori-playground-static dev',
  },
];

// Génère la config consommée par le dashboard (pour la liste des apps
// affichée et le polling de statut).
const dashboardConfigPath = path.join(__dirname, 'dashboard', 'apps.json');
writeFileSync(
  dashboardConfigPath,
  JSON.stringify(
    APPS.filter((a) => a.short !== 'DASH').map((a) => ({
      short: a.short,
      name: a.name,
      port: a.port,
      url: a.url,
    })),
    null,
    2,
  ),
);

console.log('');
console.log('  ┌──────────────────────────────────────────────────────────────────┐');
console.log('  │                     Ori - dev orchestrator                       │');
console.log('  ├──────────────────────────────────────────────────────────────────┤');
APPS.forEach((a) => {
  const line = `  │  ${a.short.padEnd(6)} ${a.name.padEnd(33)} ${a.url.padEnd(22)}  │`;
  console.log(line);
});
console.log('  ├──────────────────────────────────────────────────────────────────┤');
console.log('  │  Dashboard global : http://localhost:3000                        │');
console.log('  │  Ctrl+C arrête toutes les apps                                   │');
console.log('  └──────────────────────────────────────────────────────────────────┘');
console.log('');

const { result } = concurrently(
  APPS.map((a) => ({ command: a.command, name: a.short, prefixColor: a.color })),
  {
    cwd: REPO_ROOT,
    prefix: 'name',
    killOthersOn: ['failure', 'success'],
    restartTries: 0,
  },
);

result.then(
  () => process.exit(0),
  () => process.exit(1),
);
