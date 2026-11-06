/**
 * Assemblage d'un fascicule Word : couverture, sommaire, chapitres,
 * annexes et 4e de couverture, avec les styles définis dans charte.mjs.
 */
import { readFileSync } from 'node:fs';
import { NS, XML_HEAD, para, run, rich, field, image, zip, esc, fr, pPr, rPr } from './ooxml.mjs';
import {
  C,
  SP,
  SZ,
  LH,
  TEXT_W,
  COVER_W,
  CALLOUTS,
  calloutTblPr,
  stylesXml,
  numberingXml,
  themeXml,
  settingsXml,
  fontTableXml,
  headerXml,
  footerXml,
  emptyHeaderXml,
  emptyFooterXml,
  sectPr,
} from './charte.mjs';

const EMU = 635; // EMU par twip
/** Marqueur du paragraphe qui suit un encadré (résolu dans build()). */
const SPACER = Symbol('après-encadré');
const HAIR = 6;
const BAR = 24;

const RID = {
  hOdd: 'rId6',
  hEven: 'rId7',
  fOdd: 'rId8',
  fEven: 'rId9',
  hEmpty: 'rId10',
  fEmpty: 'rId11',
};

function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

export class Fascicule {
  constructor({ issuer, title, imagesDir }) {
    this.issuer = issuer;
    this.title = title;
    this.imagesDir = imagesDir;
    this.body = [];
    this.media = [];
    this.nextNum = 10;
    this.extraNums = [];
    this.firstSteps = true;
    this.firstReperes = true;
  }

  /* Médias */
  img(file) {
    const found = this.media.find((m) => m.file === file);
    if (found) return found;
    const buf = readFileSync(`${this.imagesDir}/${file}`);
    const m = { file, buf, rid: `rId${20 + this.media.length}`, ...pngSize(buf) };
    this.media.push(m);
    return m;
  }

  push(x) {
    this.body.push(x);
    return this;
  }

  /* Blocs de texte */
  chapter(title, lead) {
    if (!this.bookmarked) {
      this.bookmarked = true;
      this.push('<w:bookmarkStart w:id="0" w:name="_Chapitres"/>');
    }
    this.push(para({ style: 'FascNumChapitre' }));
    this.push(para({ style: 'Heading1' }, run(title)));
    if (lead) this.push(para({ style: 'FascChapeau' }, rich(lead)));
    return this;
  }
  /** Titre de chapitre sans numéro (mémo, notes) : nouvelle page. */
  annex(title, lead) {
    this.push(para({ style: 'Heading1', pageBreakBefore: true }, run(title)));
    if (lead) this.push(para({ style: 'FascChapeau' }, rich(lead)));
    return this;
  }
  h2(t, o = {}) {
    return this.push(para({ style: 'Heading2', pageBreakBefore: o.newPage }, run(t)));
  }
  h3(t) {
    return this.push(para({ style: 'Heading3' }, run(t)));
  }
  p(t, style) {
    return this.push(para(style ? { style } : {}, rich(t)));
  }
  mention(t) {
    return this.push(para({ style: 'FascMention' }, rich(t)));
  }
  bullets(items) {
    for (const t of items) this.push(para({ style: 'ListBullet' }, rich(t)));
    return this;
  }
  numbered(items, style, abs, firstKey) {
    let num;
    if (this[firstKey]) this[firstKey] = false;
    else {
      num = { id: this.nextNum++ };
      this.extraNums.push({ id: num.id, abs });
    }
    for (const t of items) this.push(para({ style, num }, rich(t)));
    return this;
  }
  steps(items) {
    return this.numbered(items, 'FascEtape', 1, 'firstSteps');
  }
  reperes(items) {
    return this.numbered(items, 'FascRepere', 4, 'firstReperes');
  }
  /** Contenu d'un encadré : titre puis texte (styles communs). */
  calloutParas(kind, title, text) {
    const k = CALLOUTS[kind];
    const texts = Array.isArray(text) ? text : [text];
    let x = para({ style: 'FascEncadreTitre' }, run(title ?? k.label ?? k.id));
    texts.forEach((t, i) => {
      x += para(
        { style: 'FascEncadreTexte', spacing: i === texts.length - 1 ? { after: 0 } : undefined },
        rich(t),
      );
    });
    return x;
  }
  /** Cellule d'encadré : fond et barre posés aussi en direct (lecteurs
   *  qui ignorent les styles de tableau). */
  calloutCell(kind, title, text, width) {
    const k = CALLOUTS[kind];
    return (
      `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>` +
      `<w:tcBorders><w:left w:val="single" w:sz="24" w:space="0" w:color="${k.bar}"/></w:tcBorders>` +
      `<w:shd w:val="clear" w:color="auto" w:fill="${k.bg}"/></w:tcPr>` +
      this.calloutParas(kind, title, text) +
      '</w:tc>'
    );
  }
  callout(kind, text, title) {
    const k = CALLOUTS[kind];
    this.push(
      `<w:tbl><w:tblPr><w:tblStyle w:val="FascEncadre${k.id}"/><w:tblW w:w="${TEXT_W}" w:type="dxa"/>` +
        `${calloutTblPr(k)}<w:tblLayout w:type="fixed"/>` +
        '<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>' +
        `<w:tblGrid><w:gridCol w:w="${TEXT_W}"/></w:tblGrid>` +
        `<w:tr><w:trPr><w:cantSplit/></w:trPr>${this.calloutCell(kind, title, text, TEXT_W)}</w:tr></w:tbl>`,
    );
    // Espace après l'encadré (spacing.3), comme entre deux blocs de texte.
    // Réduit à presque rien en fin de chapitre : voir build().
    return this.push(SPACER);
  }
  /** Encadrés courts côte à côte (2 colonnes, gouttière spacing.3). */
  calloutGrid(items) {
    const gap = SP[3];
    const col = Math.floor((TEXT_W - gap) / 2);
    const mar = `<w:tblCellMar><w:top w:w="${SP[3]}" w:type="dxa"/><w:left w:w="${SP[4]}" w:type="dxa"/><w:bottom w:w="${SP[3]}" w:type="dxa"/><w:right w:w="${SP[4]}" w:type="dxa"/></w:tblCellMar>`;
    const gapCell = `<w:tc><w:tcPr><w:tcW w:w="${gap}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`;
    let rows = '';
    for (let i = 0; i < items.length; i += 2) {
      if (i)
        rows += `<w:tr><w:trPr><w:trHeight w:val="${SP[3]}" w:hRule="exact"/></w:trPr>${['', '', ''].map((_, j) => `<w:tc><w:tcPr><w:tcW w:w="${j === 1 ? gap : col}" w:type="dxa"/></w:tcPr><w:p>${pPr({ spacing: { after: 0, line: 20, rule: 'exact' } })}</w:p></w:tc>`).join('')}</w:tr>`;
      const [l, r] = [items[i], items[i + 1]];
      rows +=
        '<w:tr><w:trPr><w:cantSplit/></w:trPr>' +
        this.calloutCell(l[0], l[2], l[1], col) +
        gapCell +
        (r
          ? this.calloutCell(r[0], r[2], r[1], col)
          : `<w:tc><w:tcPr><w:tcW w:w="${col}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`) +
        '</w:tr>';
    }
    this.push(
      `<w:tbl><w:tblPr><w:tblW w:w="${col * 2 + gap}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${mar}` +
        '<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>' +
        `<w:tblGrid><w:gridCol w:w="${col}"/><w:gridCol w:w="${gap}"/><w:gridCol w:w="${col}"/></w:tblGrid>${rows}</w:tbl>`,
    );
    return this.push(para({ spacing: { after: 0, line: SP[3], rule: 'exact' } }));
  }

  /** Capture d'écran + légende numérotée automatiquement (champ SEQ). */
  figure(file, alt, caption, o = {}) {
    const m = this.img(file);
    const wTw = o.width ?? TEXT_W;
    const cx = wTw * EMU;
    const cy = Math.round((cx * m.h) / m.w);
    this.push(para({ style: 'FascCapture' }, image(m.rid, cx, cy, file, fr(alt))));
    const cap =
      run('Figure ', { bold: true, color: C.ink }) +
      field('SEQ Figure \\* ARABIC', { bold: true, color: C.ink }, '1') +
      run(' · ', { bold: true, color: C.ink }) +
      rich(caption);
    return this.push(para({ style: 'Caption' }, cap));
  }

  /** Tableau au style « Tableau fascicule ». */
  table(headers, widths, rows, o = {}) {
    const total = widths.reduce((a, b) => a + b, 0);
    const look = `<w:tblLook w:val="04A0" w:firstRow="${headers ? 1 : 0}" w:lastRow="0" w:firstColumn="${o.firstCol ? 1 : 0}" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/>`;
    const cell = (t, w, extra = '') =>
      `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${extra}</w:tcPr>${para({ style: 'FascTableau' }, t ? rich(t) : '')}</w:tc>`;
    let x = `<w:tbl><w:tblPr><w:tblStyle w:val="FascTableauStyle"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${look}</w:tblPr>`;
    x += `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
    if (headers)
      x += `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${headers.map((h, i) => cell(h, widths[i])).join('')}</w:tr>`;
    for (const r of rows) {
      const tr = o.rowHeight ? `<w:trHeight w:val="${o.rowHeight}" w:hRule="atLeast"/>` : '';
      x += `<w:tr><w:trPr><w:cantSplit/>${tr}</w:trPr>${r
        .map((t, i) => cell(t, widths[i], o.labelColor && i === 0 ? '' : ''))
        .join('')}</w:tr>`;
    }
    x += '</w:tbl>';
    this.push(x);
    return this.push(para({ spacing: { after: 0, line: SP[3], rule: 'exact' } }));
  }

  /** Coordonnées : bloc teinté, barre d'accent à gauche. */
  contacts(rows) {
    const wl = 1800;
    const wr = COVER_W - wl;
    const b = (side, sz, color) =>
      `<w:${side} w:val="single" w:sz="${sz}" w:space="0" w:color="${color}"/>`;
    let x =
      `<w:tbl><w:tblPr><w:tblW w:w="${COVER_W}" w:type="dxa"/>` +
      `<w:tblBorders>${b('top', HAIR, C.rule)}${b('left', BAR, C.accent)}${b('bottom', HAIR, C.rule)}${b('right', HAIR, C.rule)}</w:tblBorders>` +
      `<w:shd w:val="clear" w:color="auto" w:fill="${C.tint}"/><w:tblLayout w:type="fixed"/>` +
      `<w:tblCellMar><w:top w:w="${SP[1]}" w:type="dxa"/><w:left w:w="${SP[5]}" w:type="dxa"/><w:bottom w:w="${SP[1]}" w:type="dxa"/><w:right w:w="${SP[2]}" w:type="dxa"/></w:tblCellMar>` +
      `<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>` +
      `<w:tblGrid><w:gridCol w:w="${wl}"/><w:gridCol w:w="${wr}"/></w:tblGrid>`;
    rows.forEach(([k, v], i) => {
      const pad = { top: i === 0 ? SP[5] : SP[1], bottom: i === rows.length - 1 ? SP[5] : SP[1] };
      const mar = `<w:tcMar><w:top w:w="${pad.top}" w:type="dxa"/><w:bottom w:w="${pad.bottom}" w:type="dxa"/></w:tcMar>`;
      x +=
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="${wl}" w:type="dxa"/>${mar}</w:tcPr>${para({ style: 'FascTableau' }, run(k, { bold: true, color: C.inkSoft }))}</w:tc>` +
        `<w:tc><w:tcPr><w:tcW w:w="${wr}" w:type="dxa"/>${mar}</w:tcPr>${para({ style: 'FascTableau' }, rich(v))}</w:tc></w:tr>`;
    });
    this.push(x + '</w:tbl>');
    return this.push(para({ spacing: { after: 0, line: SP[3], rule: 'exact' } }));
  }

  notes(lines) {
    for (let i = 0; i < lines; i++) this.push(para({ style: 'FascNotes' }));
    return this;
  }

  /** Sommaire automatique (titres de chapitre). */
  toc() {
    this.push(para({ style: 'Heading1' }, run('Sommaire')));
    // \b : seuls les titres compris entre le premier chapitre et la fin du
    // corps (signet masqué _Chapitres) entrent au sommaire, pas « Sommaire ».
    const instr = 'TOC \\o "1-1" \\h \\z \\b _Chapitres';
    return this.push(
      `<w:p>${pPr({ style: 'TOC1' })}<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>` +
        `<w:r><w:instrText xml:space="preserve"> ${esc(instr)} </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>` +
        `<w:r><w:t xml:space="preserve">${esc(fr('Clic droit ici puis « Mettre à jour les champs » pour afficher le sommaire.'))}</w:t></w:r>` +
        '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>',
    );
  }

  /** Bloc institutionnel : blason, territoire, entité émettrice. */
  brand(o = {}) {
    const m = this.img('blason.png');
    const size = SP[10] * EMU;
    const wl = SP[10] + SP[3];
    const wr = COVER_W - wl;
    const bottom = o.rule
      ? `<w:bottom w:val="single" w:sz="${HAIR}" w:space="0" w:color="${C.rule}"/>`
      : '';
    const x =
      `<w:tbl><w:tblPr><w:tblW w:w="${COVER_W}" w:type="dxa"/><w:tblBorders>${bottom}</w:tblBorders><w:tblLayout w:type="fixed"/>` +
      `<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="${o.rule ? SP[4] : 0}" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>` +
      `<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>` +
      `<w:tblGrid><w:gridCol w:w="${wl}"/><w:gridCol w:w="${wr}"/></w:tblGrid><w:tr>` +
      `<w:tc><w:tcPr><w:tcW w:w="${wl}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>${para({ spacing: { after: 0, line: 240 } }, image(m.rid, size, size, 'blason.png', 'Blason de la Polynésie française'))}</w:tc>` +
      `<w:tc><w:tcPr><w:tcW w:w="${wr}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>` +
      para(
        { spacing: { after: 0, line: 300 } },
        run('Polynésie française', { bold: true, sz: SZ.sm }),
      ) +
      para(
        { spacing: { after: 0, line: 300 } },
        run(this.issuer, { color: C.inkSoft, sz: SZ.xs }),
      ) +
      '</w:tc></w:tr></w:tbl>';
    return this.push(x);
  }

  /** Couverture : bandeau, illustration, titre, barre d'accent, mentions. */
  cover({ eyebrow, title, subtitle, illustration, panelText, metaLeft, metaRight, metaGap }) {
    this.brand({ rule: true });
    if (illustration) {
      const m = this.img(illustration.file);
      const cx = COVER_W * EMU;
      const crop = illustration.crop ?? 0;
      const cy = Math.round(((cx * m.h) / m.w) * (1 - (2 * crop) / 100000));
      this.push(
        para(
          { spacing: { before: SP[6], after: 0, line: 240 }, jc: 'center' },
          image(m.rid, cx, cy, illustration.file, fr(illustration.alt), { t: crop, b: crop }),
        ),
      );
    } else {
      // Emplacement réservé à l'illustration (fond brand.primary-subtle).
      this.push(
        `<w:tbl><w:tblPr><w:tblW w:w="${COVER_W}" w:type="dxa"/><w:tblInd w:w="0" w:type="dxa"/><w:tblLayout w:type="fixed"/>` +
          `<w:tblCellMar><w:left w:w="${SP[8]}" w:type="dxa"/><w:right w:w="${SP[8]}" w:type="dxa"/></w:tblCellMar>` +
          `<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>` +
          `<w:tblGrid><w:gridCol w:w="${COVER_W}"/></w:tblGrid><w:tr><w:trPr><w:trHeight w:val="4400" w:hRule="exact"/></w:trPr>` +
          `<w:tc><w:tcPr><w:tcW w:w="${COVER_W}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${C.accentSubtle}"/><w:vAlign w:val="center"/></w:tcPr>` +
          para(
            { jc: 'center', spacing: { after: 0 } },
            run(panelText, { color: C.accentStrong, sz: SZ.xs }),
          ) +
          '</w:tc></w:tr></w:tbl>',
      );
    }
    this.push(para({ style: 'FascCouvSurtitre' }, run(eyebrow)));
    this.push(para({ style: 'FascCouvTitre' }, run(title)));
    this.push(para({ style: 'FascCouvBarre' }));
    this.push(para({ style: 'FascCouvSousTitre' }, rich(subtitle)));
    this.push(
      para(
        { style: 'FascCouvMention', spacing: { before: metaGap } },
        run(`${metaLeft}\t${metaRight}`),
      ),
    );
    return this.push(
      `<w:p>${pPr({ spacing: { after: 0, line: 240 } }, sectPr('cover', RID))}</w:p>`,
    );
  }

  /** Fin du corps : la 4e de couverture démarre sur une page paire. */
  endBody() {
    if (this.bookmarked) this.push('<w:bookmarkEnd w:id="0"/>');
    return this.push(
      `<w:p>${pPr({ spacing: { after: 0, line: 240 } }, sectPr('body', RID))}</w:p>`,
    );
  }

  /** 4e de couverture (contenu libre puis bandeau en pied). */
  backFooter({ gap, credit }) {
    this.push(para({ spacing: { before: gap, after: 0, line: 240 } }));
    this.brand({ rule: false });
    if (credit) this.push(para({ style: 'FascMention', spacing: { before: SP[3] } }, run(credit)));
    return this;
  }

  /* ── Paquet OOXML ─────────────────────────────────────────────── */
  build({ template }) {
    const mainType = template
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
    const W = 'application/vnd.openxmlformats-officedocument.wordprocessingml';
    const parts = {
      'word/styles.xml': stylesXml(),
      'word/settings.xml': settingsXml(),
      'word/fontTable.xml': fontTableXml(),
      'word/theme/theme1.xml': themeXml(),
      'word/numbering.xml': numberingXml(this.extraNums),
      'word/header1.xml': headerXml(fr(this.issuer), false),
      'word/header2.xml': headerXml(fr(this.issuer), true),
      'word/footer1.xml': footerXml(false),
      'word/footer2.xml': footerXml(true),
      'word/header3.xml': emptyHeaderXml(),
      'word/footer3.xml': emptyFooterXml(),
    };
    // Un tableau doit être suivi d'un paragraphe. Après un encadré, ce
    // paragraphe porte l'espace spacing.3, sauf si une nouvelle page suit :
    // il ne doit alors pas pousser l'encadré sur la page suivante.
    const body = this.body.map((x, i) => {
      if (x !== SPACER) return x;
      const next = this.body[i + 1] ?? '';
      const pageEnds = /FascNumChapitre|<w:pageBreakBefore\/>|<w:sectPr/.test(next.slice(0, 400));
      return para({ spacing: { before: 0, after: 0, line: pageEnds ? 20 : SP[3], rule: 'exact' } });
    });
    const document = `${XML_HEAD}<w:document ${NS}><w:body>${body.join('')}${sectPr('back', RID)}</w:body></w:document>`;
    const rel = (id, type, target) =>
      `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/>`;
    const docRels =
      `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      rel('rId1', 'styles', 'styles.xml') +
      rel('rId2', 'settings', 'settings.xml') +
      rel('rId3', 'fontTable', 'fontTable.xml') +
      rel('rId4', 'theme', 'theme/theme1.xml') +
      rel('rId5', 'numbering', 'numbering.xml') +
      rel(RID.hOdd, 'header', 'header1.xml') +
      rel(RID.hEven, 'header', 'header2.xml') +
      rel(RID.fOdd, 'footer', 'footer1.xml') +
      rel(RID.fEven, 'footer', 'footer2.xml') +
      rel(RID.hEmpty, 'header', 'header3.xml') +
      rel(RID.fEmpty, 'footer', 'footer3.xml') +
      this.media.map((m) => rel(m.rid, 'image', `media/${m.file}`)).join('') +
      '</Relationships>';
    const ov = (part, type) => `<Override PartName="/${part}" ContentType="${type}"/>`;
    const contentTypes =
      `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/>' +
      ov('word/document.xml', mainType) +
      ov('word/styles.xml', `${W}.styles+xml`) +
      ov('word/settings.xml', `${W}.settings+xml`) +
      ov('word/fontTable.xml', `${W}.fontTable+xml`) +
      ov('word/numbering.xml', `${W}.numbering+xml`) +
      ov('word/theme/theme1.xml', 'application/vnd.openxmlformats-officedocument.theme+xml') +
      ['header1', 'header2', 'header3']
        .map((h) => ov(`word/${h}.xml`, `${W}.header+xml`))
        .join('') +
      ['footer1', 'footer2', 'footer3']
        .map((f) => ov(`word/${f}.xml`, `${W}.footer+xml`))
        .join('') +
      ov('docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml') +
      ov(
        'docProps/app.xml',
        'application/vnd.openxmlformats-officedocument.extended-properties+xml',
      ) +
      '</Types>';
    const rootRels =
      `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>' +
      '</Relationships>';
    const core =
      `${XML_HEAD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
      `<dc:title>${esc(fr(this.title))}</dc:title><dc:creator>${esc(fr(this.issuer))}</dc:creator><dc:language>fr-FR</dc:language>` +
      '<dcterms:created xsi:type="dcterms:W3CDTF">2026-11-05T00:00:00Z</dcterms:created></cp:coreProperties>';
    const app =
      `${XML_HEAD}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">` +
      `<Template>${template ? '' : 'modele-fascicule.dotx'}</Template><Application>Microsoft Office Word</Application><Company>${esc(fr(this.issuer))}</Company></Properties>`;

    return zip([
      ['[Content_Types].xml', contentTypes],
      ['_rels/.rels', rootRels],
      ['docProps/core.xml', core],
      ['docProps/app.xml', app],
      ['word/document.xml', document],
      ['word/_rels/document.xml.rels', docRels],
      ...Object.entries(parts),
      ...this.media.map((m) => [`word/media/${m.file}`, m.buf]),
    ]);
  }
}
