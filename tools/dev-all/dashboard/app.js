/**
 * Dashboard de dev Ori.
 *
 * Charge la liste des apps depuis `/apps.json` (généré par dev.mjs au
 * démarrage) puis pinge chacune toutes les 3 s pour mettre à jour son
 * statut up / starting / down.
 *
 * Le ping passe par fetch `no-cors` : on ne lit pas la réponse, on
 * détecte juste si le serveur répond. C'est suffisant pour distinguer
 * "le port écoute" de "le port ne répond pas".
 */

const POLL_INTERVAL_MS = 3000;
const STARTING_GRACE_MS = 60000; // 60 s avant de marquer une app comme "down"

const grid = document.getElementById('apps');
const updatedEl = document.getElementById('updated');

const startedAt = Date.now();

async function fetchApps() {
  const res = await fetch('/apps.json', { cache: 'no-store' });
  return res.json();
}

function renderInitial(apps) {
  grid.innerHTML = '';
  for (const app of apps) {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.short = app.short;
    card.innerHTML = `
      <div class="meta">
        <h2>${app.name}</h2>
        <span class="short">${app.short}</span>
      </div>
      <div class="meta">
        <span class="status" data-status="starting">
          <span class="dot starting"></span><span class="label">démarrage…</span>
        </span>
        <a class="open" href="${app.url}" target="_blank" rel="noopener">Ouvrir →</a>
      </div>
      <div class="url">${app.url}</div>
    `;
    grid.appendChild(card);
  }
}

async function ping(app) {
  try {
    // `no-cors` : pas de lecture de la réponse, mais on sait si le port répond.
    // Timeout de 1.5 s pour ne pas bloquer le poll si le serveur ne répond plus.
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    await fetch(app.url, { mode: 'no-cors', signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(t);
    return 'up';
  } catch (e) {
    // Une app qui démarre n'a pas encore de socket : on garde le statut
    // "starting" pendant le délai de grâce, puis on bascule en "down".
    const elapsed = Date.now() - startedAt;
    return elapsed < STARTING_GRACE_MS ? 'starting' : 'down';
  }
}

function updateStatus(short, status) {
  const card = grid.querySelector(`[data-short="${short}"]`);
  if (!card) return;
  const statusEl = card.querySelector('.status');
  const dot = statusEl.querySelector('.dot');
  const label = statusEl.querySelector('.label');
  statusEl.dataset.status = status;
  dot.className = 'dot ' + status;
  label.textContent =
    status === 'up' ? 'opérationnel' : status === 'starting' ? 'démarrage…' : 'indisponible';
}

async function pollAll(apps) {
  const results = await Promise.all(apps.map((a) => ping(a).then((s) => [a.short, s])));
  for (const [short, status] of results) updateStatus(short, status);
  updatedEl.textContent = 'Dernier ping : ' + new Date().toLocaleTimeString('fr-FR');
}

async function main() {
  const apps = await fetchApps();
  renderInitial(apps);
  await pollAll(apps);
  setInterval(() => pollAll(apps), POLL_INTERVAL_MS);
}

main().catch((e) => {
  grid.innerHTML = `<div class="card">Erreur de chargement : ${e.message}</div>`;
});
