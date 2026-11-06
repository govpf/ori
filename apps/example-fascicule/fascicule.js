// Aide à la mise en page du fascicule (aperçu écran uniquement).
//
// 1. Bascule de format A5 / A4 (bouton + paramètre d'URL ?format=a4).
// 2. Numéros de page du sommaire calculés depuis la feuille qui contient
//    chaque ancre (les valeurs écrites dans le HTML servent de repli si
//    le JavaScript est désactivé).
// 3. Détection des feuilles dont le contenu déborde : contour rouge à
//    l'écran + avertissement console, pour corriger avant impression.
//
// Aucune de ces aides n'est nécessaire au rendu : sans JS, le fascicule
// s'affiche et s'imprime au format déclaré dans data-format.

const book = document.querySelector('.fascicule');
const sheets = [...document.querySelectorAll('.sheet')];
const FORMATS = ['a5', 'a4'];

function setFormat(format) {
  if (!FORMATS.includes(format)) return;
  book.dataset.format = format;
  document.querySelectorAll('[data-set-format]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.setFormat === format));
  });
  const url = new URL(window.location.href);
  url.searchParams.set('format', format);
  window.history.replaceState(null, '', url);
  checkOverflow();
}

function fillToc() {
  document.querySelectorAll('[data-toc-target]').forEach((link) => {
    const target = document.getElementById(link.dataset.tocTarget);
    const sheet = target?.closest('.sheet');
    const page = link.querySelector('.toc__page');
    if (sheet && page) page.textContent = String(sheets.indexOf(sheet) + 1);
  });
}

function checkOverflow() {
  requestAnimationFrame(() => {
    sheets.forEach((sheet, i) => {
      const body = sheet.querySelector('.sheet__body, .cover, .backcover') ?? sheet;
      const overflow = body.scrollHeight > body.clientHeight + 1;
      sheet.classList.toggle('sheet--overflow', overflow);
      if (overflow) {
        console.warn(
          `[fascicule] page ${i + 1} (${book.dataset.format}) : le contenu déborde de ${
            body.scrollHeight - body.clientHeight
          }px`,
        );
      }
    });
  });
}

document.querySelectorAll('[data-set-format]').forEach((btn) => {
  btn.addEventListener('click', () => setFormat(btn.dataset.setFormat));
});
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const initial = new URLSearchParams(window.location.search).get('format');
setFormat(FORMATS.includes(initial) ? initial : book.dataset.format);
fillToc();
document.fonts?.ready.then(checkOverflow);
