/**
 * Charte Word du fascicule : traduction des tokens du design system en
 * unités Word, puis styles, thème, numérotations, en-têtes et pieds de
 * page communs au modèle (.dotx) et à l'exemple (.docx).
 *
 * Conversions (base CSS : 1rem = 16px, 1px = 0,75pt à l'impression) :
 *   - taille de police : px × 1,5 = demi-points Word ;
 *   - espacement : px × 15 = twips (vingtièmes de point) ;
 *   - interligne : facteur × 240 (règle « auto » de Word).
 * Les valeurs ci-dessous recopient packages/tokens (thème clair) ; la
 * correspondance est listée dans la page /supports/fascicule/ du site.
 */
import { NS, XML_HEAD, pPr, rPr, para, run, field, esc } from './ooxml.mjs';

/* ── Tokens -> Word ──────────────────────────────────────────────── */
export const C = {
  ink: '18181B', // color.text.primary (neutral-900)
  inkSoft: '52525B', // color.text.secondary (neutral-600)
  inkMuted: '71717A', // color.text.muted (neutral-500)
  accent: '073CA5', // color.brand.primary (primary-500)
  accentStrong: '05236B', // color.brand.primary-active (primary-700)
  accentSubtle: 'E9EEFF', // color.brand.primary-subtle (primary-50)
  onAccent: 'FFFFFF', // color.brand.on-primary
  illustration: '5980FF', // color.primary-400
  tint: 'FAFAFA', // color.surface.muted
  tintStrong: 'F4F4F5', // color.surface.subtle
  rule: 'E4E4E7', // color.border.subtle
  ruleStrong: 'D4D4D8', // color.border.default
};
/** Encadrés : mêmes couleurs que .ori-callout (barre, fond). */
export const CALLOUTS = {
  Astuce: { id: 'Astuce', bar: '0BB25A', bg: 'E6F9EF' }, // --tip : feedback.success
  Savoir: { id: 'Savoir', label: 'À savoir', bar: '073CA5', bg: 'E9EEFF' }, // --note : brand.primary
  Attention: { id: 'Attention', bar: 'F97316', bg: 'FFF7ED' }, // --warning : feedback.warning
  Important: { id: 'Important', bar: 'CF0921', bg: 'FFF1F2' }, // --danger : feedback.danger
};
/** font.size.* en demi-points. */
export const SZ = { xs: 18, sm: 21, base: 24, lg: 27, xl: 30, '2xl': 36, '3xl': 45, '4xl': 54 };
/** spacing.* en twips. */
export const SP = {
  1: 60,
  2: 120,
  3: 180,
  4: 240,
  5: 300,
  6: 360,
  8: 480,
  10: 600,
  12: 720,
  16: 960,
};
/** font.line-height.* en 240es. */
export const LH = { tight: 300, normal: 360, relaxed: 420 };
/** Trait de 4px (barre d'accent) = 3pt = 24 huitièmes de point ; filet 1px = 6. */
const BAR = 24;
const HAIR = 6;

/* ── Format A5 ───────────────────────────────────────────────────── */
export const PAGE = { w: 8391, h: 11906 }; // 148 × 210 mm
export const MARGIN = {
  top: SP[10],
  bottom: SP[16], // marge de pied : contient le pied de page
  inside: SP[10], // petit fond, côté reliure
  outside: SP[8],
  header: SP[4],
  footer: SP[8],
};
export const TEXT_W = PAGE.w - MARGIN.inside - MARGIN.outside; // 7311
export const COVER_W = PAGE.w - 2 * MARGIN.inside; // 7191

/* ── Styles ──────────────────────────────────────────────────────── */
function style(type, id, name, o = {}) {
  let x = `<w:style w:type="${type}"${o.default ? ' w:default="1"' : ''}${o.custom ? ' w:customStyle="1"' : ''} w:styleId="${id}">`;
  x += `<w:name w:val="${esc(name)}"/>`;
  if (o.aliases) x += `<w:aliases w:val="${esc(o.aliases)}"/>`;
  if (o.basedOn) x += `<w:basedOn w:val="${o.basedOn}"/>`;
  if (o.next) x += `<w:next w:val="${o.next}"/>`;
  if (o.link) x += `<w:link w:val="${o.link}"/>`;
  x += `<w:uiPriority w:val="${o.priority ?? 10}"/>`;
  if (o.semiHidden) x += '<w:semiHidden/>';
  if (o.unhide) x += '<w:unhideWhenUsed/>';
  if (o.q !== false && !o.semiHidden) x += '<w:qFormat/>';
  if (o.p) x += pPr(o.p);
  if (o.r) x += rPr(o.r);
  if (o.tbl) x += o.tbl;
  return x + '</w:style>';
}

/**
 * Encadré = tableau d'une cellule : fond d'un seul tenant et barre
 * d'accent à gauche (comme .ori-callout). Un fond de paragraphe serait
 * dessiné ligne par ligne et laisserait des filets clairs entre les lignes.
 * Marges internes : spacing.3 (haut, bas) et spacing.4 (côtés).
 */
export const calloutTblPr = (k) =>
  `<w:tblBorders><w:left w:val="single" w:sz="${BAR}" w:space="0" w:color="${k.bar}"/></w:tblBorders>` +
  `<w:tblCellMar><w:top w:w="${SP[3]}" w:type="dxa"/><w:left w:w="${SP[4]}" w:type="dxa"/>` +
  `<w:bottom w:w="${SP[3]}" w:type="dxa"/><w:right w:w="${SP[4]}" w:type="dxa"/></w:tblCellMar>`;

export function stylesXml() {
  const s = [];
  s.push(
    `<w:docDefaults><w:rPrDefault>${rPr({ themeFont: 'minor', color: C.ink, sz: SZ.sm, lang: 'fr-FR' })}</w:rPrDefault>` +
      `<w:pPrDefault>${pPr({ spacing: { after: SP[3], line: LH.normal } })}</w:pPrDefault></w:docDefaults>`,
  );
  s.push(
    '<w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="0" w:defUnhideWhenUsed="0" w:defQFormat="0" w:count="376"/>',
  );
  // Texte courant : font.size.sm, line-height.normal, color.text.primary.
  s.push(
    style('paragraph', 'Normal', 'Normal', { default: true, priority: 0, p: { noHyphen: true } }),
  );

  // Titres : styles intégrés de Word (navigation, sommaire, renvois),
  // renommés par alias pour parler le langage de la charte.
  s.push(
    style('paragraph', 'Heading1', 'heading 1', {
      aliases: 'Titre de chapitre',
      basedOn: 'Normal',
      next: 'FascChapeau',
      priority: 9,
      p: {
        keepNext: true,
        keepLines: true,
        bdr: { bottom: { sz: BAR, space: 12, color: C.accent, theme: 'accent1' } },
        spacing: { before: 0, after: SP[5], line: LH.tight },
        outline: 0,
      },
      r: { themeFont: 'major', bold: true, color: C.ink, sz: SZ['2xl'] },
    }),
  );
  s.push(
    style('paragraph', 'Heading2', 'heading 2', {
      aliases: 'Titre de section',
      basedOn: 'Normal',
      next: 'Normal',
      priority: 9,
      unhide: true,
      p: {
        keepNext: true,
        keepLines: true,
        spacing: { before: SP[5], after: SP[2], line: LH.tight },
        outline: 1,
      },
      r: { themeFont: 'major', bold: true, color: C.accentStrong, themeColor: 'text2', sz: SZ.lg },
    }),
  );
  s.push(
    style('paragraph', 'Heading3', 'heading 3', {
      aliases: 'Sous-titre',
      basedOn: 'Normal',
      next: 'Normal',
      priority: 9,
      unhide: true,
      p: {
        keepNext: true,
        keepLines: true,
        spacing: { before: SP[3], after: SP[1], line: LH.tight },
        outline: 2,
      },
      r: { themeFont: 'major', bold: true, color: C.ink, sz: SZ.base },
    }),
  );
  s.push(
    style('paragraph', 'FascSurtitre', 'Surtitre', {
      basedOn: 'Normal',
      next: 'Heading1',
      custom: true,
      p: { keepNext: true, spacing: { before: 0, after: SP[1], line: LH.tight } },
      r: {
        bold: true,
        caps: true,
        tracking: 14,
        color: C.accent,
        themeColor: 'accent1',
        sz: SZ.xs,
      },
    }),
  );
  s.push(
    style('paragraph', 'FascNumChapitre', 'Numéro de chapitre', {
      basedOn: 'FascSurtitre',
      next: 'Heading1',
      custom: true,
      p: { pageBreakBefore: true, num: { id: 3 } },
    }),
  );
  s.push(
    style('paragraph', 'FascTitreHors', 'Titre hors sommaire', {
      basedOn: 'Heading1',
      next: 'FascChapeau',
      custom: true,
      p: { outline: 9 },
    }),
  );
  s.push(
    style('paragraph', 'FascChapeau', 'Chapeau', {
      basedOn: 'Normal',
      next: 'Normal',
      custom: true,
      p: { spacing: { after: SP[4] } },
      r: { color: C.inkSoft, sz: SZ.base },
    }),
  );

  // Listes.
  s.push(
    style('paragraph', 'FascEtape', 'Étape numérotée', {
      basedOn: 'Normal',
      custom: true,
      p: {
        keepLines: true,
        num: { id: 1 },
        tabs: [{ val: 'left', pos: SP[8] }],
        ind: { left: SP[8], hanging: SP[8] },
      },
    }),
  );
  s.push(
    style('paragraph', 'FascEtapeSuite', 'Étape, suite', {
      basedOn: 'Normal',
      custom: true,
      p: { ind: { left: SP[8] } },
    }),
  );
  s.push(
    style('paragraph', 'ListBullet', 'List Bullet', {
      aliases: 'Liste à puces',
      basedOn: 'Normal',
      priority: 11,
      p: { num: { id: 2 }, contextual: true, ind: { left: SP[5], hanging: SP[5] } },
    }),
  );
  s.push(
    style('paragraph', 'FascRepere', 'Repère numéroté', {
      basedOn: 'Normal',
      custom: true,
      p: {
        num: { id: 4 },
        contextual: true,
        tabs: [{ val: 'left', pos: SP[8] }],
        ind: { left: SP[8], hanging: SP[8] },
      },
    }),
  );

  // Encadrés : un style de tableau par type (fond, barre d'accent,
  // marges), et deux styles de paragraphe communs pour le contenu.
  s.push(
    style('paragraph', 'FascEncadreTexte', "Texte d'encadré", {
      basedOn: 'Normal',
      custom: true,
      p: { spacing: { before: 0, after: SP[1] } },
    }),
  );
  s.push(
    style('paragraph', 'FascEncadreTitre', "Titre d'encadré", {
      basedOn: 'FascEncadreTexte',
      next: 'FascEncadreTexte',
      custom: true,
      // Pas de « paragraphe solidaire » : dans un tableau, Word reporterait
      // tout l'encadré sur la page suivante. La ligne est déjà insécable.
      p: { spacing: { after: 0 } },
      r: { bold: true },
    }),
  );
  for (const k of Object.values(CALLOUTS)) {
    s.push(
      style('table', `FascEncadre${k.id}`, `Encadré ${k.label ?? k.id}`, {
        basedOn: 'TableNormal',
        custom: true,
        tbl:
          `<w:tblPr>${calloutTblPr(k)}</w:tblPr>` +
          `<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="${k.bg}"/></w:tcPr>`,
      }),
    );
  }

  // Captures et légendes.
  s.push(
    style('paragraph', 'FascCapture', 'Capture', {
      basedOn: 'Normal',
      next: 'Caption',
      custom: true,
      p: { keepNext: true, spacing: { before: SP[3], after: 0, line: 240 }, jc: 'center' },
    }),
  );
  s.push(
    style('paragraph', 'Caption', 'caption', {
      aliases: 'Légende de capture',
      basedOn: 'Normal',
      next: 'Normal',
      priority: 35,
      unhide: true,
      p: { spacing: { before: SP[2], after: SP[4], line: LH.tight } },
      r: { color: C.inkSoft, sz: SZ.xs },
    }),
  );
  s.push(
    style('paragraph', 'FascMention', 'Mention', {
      basedOn: 'Normal',
      custom: true,
      p: { spacing: { after: SP[1], line: LH.tight } },
      r: { color: C.inkMuted, sz: SZ.xs },
    }),
  );
  s.push(
    style('paragraph', 'FascTableau', 'Texte de tableau', {
      basedOn: 'Normal',
      custom: true,
      p: { spacing: { before: 0, after: 0, line: LH.tight } },
    }),
  );
  s.push(
    style('paragraph', 'FascNotes', 'Ligne de notes', {
      basedOn: 'Normal',
      custom: true,
      p: {
        bdr: {
          bottom: { sz: 4, space: 0, color: C.ruleStrong },
          between: { sz: 4, space: 0, color: C.ruleStrong },
        },
        spacing: { before: 0, after: 0, line: SP[8], rule: 'exact' },
      },
    }),
  );

  // Couverture et 4e de couverture.
  s.push(
    style('paragraph', 'FascCouvSurtitre', 'Couverture, surtitre', {
      basedOn: 'FascSurtitre',
      next: 'FascCouvTitre',
      custom: true,
      p: { spacing: { before: SP[6], after: SP[2] } },
    }),
  );
  s.push(
    style('paragraph', 'FascCouvTitre', 'Couverture, titre', {
      basedOn: 'Normal',
      next: 'FascCouvBarre',
      custom: true,
      p: { keepNext: true, spacing: { after: 0, line: LH.tight } },
      r: { themeFont: 'major', bold: true, color: C.ink, sz: SZ['3xl'] },
    }),
  );
  s.push(
    style('paragraph', 'FascCouvBarre', 'Couverture, barre d’accent', {
      basedOn: 'Normal',
      next: 'FascCouvSousTitre',
      custom: true,
      p: {
        keepNext: true,
        bdr: { bottom: { sz: BAR, space: 0, color: C.accent, theme: 'accent1' } },
        spacing: { before: 0, after: SP[4], line: SP[4], rule: 'exact' },
        ind: { right: COVER_W - SP[16] },
      },
      r: { sz: 2 },
    }),
  );
  s.push(
    style('paragraph', 'FascCouvSousTitre', 'Couverture, sous-titre', {
      basedOn: 'Normal',
      custom: true,
      p: { spacing: { after: 0 } },
      r: { color: C.inkSoft, sz: SZ.base },
    }),
  );
  s.push(
    style('paragraph', 'FascCouvMention', 'Couverture, mention', {
      basedOn: 'Normal',
      custom: true,
      p: {
        bdr: { top: { sz: HAIR, space: 12, color: C.rule } },
        tabs: [{ val: 'right', pos: COVER_W }],
        spacing: { after: 0, line: LH.tight },
      },
      r: { color: C.inkMuted, sz: SZ.xs },
    }),
  );

  // En-tête, pied de page, sommaire.
  s.push(
    style('paragraph', 'Header', 'header', {
      basedOn: 'Normal',
      priority: 99,
      unhide: true,
      q: false,
      p: { spacing: { after: 0, line: LH.tight } },
      r: { bold: true, color: C.inkMuted, sz: SZ.xs },
    }),
  );
  s.push(
    style('paragraph', 'Footer', 'footer', {
      basedOn: 'Normal',
      priority: 99,
      unhide: true,
      q: false,
      p: {
        bdr: { top: { sz: HAIR, space: 6, color: C.rule } },
        tabs: [{ val: 'right', pos: TEXT_W }],
        spacing: { after: 0, line: LH.tight },
      },
      r: { color: C.inkMuted, sz: SZ.xs },
    }),
  );
  s.push(
    style('paragraph', 'TOC1', 'toc 1', {
      basedOn: 'Normal',
      next: 'Normal',
      priority: 39,
      unhide: true,
      p: {
        tabs: [{ val: 'right', leader: 'dot', pos: TEXT_W }],
        spacing: { before: SP[2], after: 0, line: LH.tight },
      },
      r: { bold: true, sz: SZ.base },
    }),
  );
  s.push(
    style('paragraph', 'TOC2', 'toc 2', {
      basedOn: 'Normal',
      next: 'Normal',
      priority: 39,
      unhide: true,
      p: {
        tabs: [{ val: 'right', leader: 'dot', pos: TEXT_W }],
        spacing: { before: SP[1], after: 0, line: LH.tight },
        ind: { left: SP[8] },
      },
      r: { color: C.inkSoft },
    }),
  );
  s.push(
    style('paragraph', 'TOCHeading', 'TOC Heading', {
      basedOn: 'Heading1',
      next: 'Normal',
      priority: 39,
      unhide: true,
      p: { outline: 9 },
    }),
  );

  // Caractères.
  s.push(
    style('character', 'DefaultParagraphFont', 'Default Paragraph Font', {
      default: true,
      priority: 1,
      semiHidden: true,
      unhide: true,
    }),
  );
  s.push(
    style('character', 'FascTouche', 'Touche', {
      custom: true,
      r: {
        bold: true,
        color: C.ink,
        sz: SZ.xs,
        bdr: { sz: HAIR, space: 1, color: C.ruleStrong },
        shd: C.tint,
      },
    }),
  );
  s.push(style('character', 'Strong', 'Strong', { priority: 22, r: { bold: true } }));
  s.push(
    style('character', 'Hyperlink', 'Hyperlink', {
      priority: 99,
      unhide: true,
      q: false,
      r: { color: C.accent, themeColor: 'hyperlink' },
    }),
  );
  s.push(
    style('character', 'PlaceholderText', 'Placeholder Text', {
      priority: 99,
      semiHidden: true,
      r: { color: C.inkMuted },
    }),
  );

  // Tableaux.
  s.push(
    style('table', 'TableNormal', 'Normal Table', {
      default: true,
      priority: 99,
      semiHidden: true,
      unhide: true,
      tbl: '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr>',
    }),
  );
  s.push(
    style('table', 'FascTableauStyle', 'Tableau fascicule', {
      basedOn: 'TableNormal',
      custom: true,
      tbl:
        pPr({ spacing: { before: 0, after: 0, line: LH.tight } }) +
        '<w:tblPr><w:tblBorders>' +
        `<w:bottom w:val="single" w:sz="${HAIR}" w:space="0" w:color="${C.rule}"/>` +
        `<w:insideH w:val="single" w:sz="${HAIR}" w:space="0" w:color="${C.rule}"/>` +
        '</w:tblBorders><w:tblCellMar>' +
        `<w:top w:w="${SP[2]}" w:type="dxa"/><w:left w:w="${SP[3]}" w:type="dxa"/>` +
        `<w:bottom w:w="${SP[2]}" w:type="dxa"/><w:right w:w="${SP[3]}" w:type="dxa"/>` +
        '</w:tblCellMar></w:tblPr><w:tcPr><w:vAlign w:val="center"/></w:tcPr>' +
        `<w:tblStylePr w:type="firstRow">${rPr({ bold: true, caps: true, tracking: 14, color: C.inkSoft, sz: SZ.xs })}` +
        `<w:tblPr/><w:trPr><w:tblHeader/></w:trPr><w:tcPr><w:tcBorders><w:bottom w:val="single" w:sz="${HAIR}" w:space="0" w:color="${C.ruleStrong}"/></w:tcBorders>` +
        `<w:shd w:val="clear" w:color="auto" w:fill="${C.tint}"/></w:tcPr></w:tblStylePr>` +
        `<w:tblStylePr w:type="firstCol">${rPr({ bold: true })}<w:tblPr/><w:tcPr/></w:tblStylePr>`,
    }),
  );
  s.push(
    style('numbering', 'NoList', 'No List', {
      default: true,
      priority: 99,
      semiHidden: true,
      unhide: true,
    }),
  );

  return `${XML_HEAD}<w:styles ${NS}>${s.join('')}</w:styles>`;
}

/* ── Numérotations ───────────────────────────────────────────────── */
function lvl(o) {
  return (
    `<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${o.fmt}"/>` +
    (o.style ? `<w:pStyle w:val="${o.style}"/>` : '') +
    `<w:suff w:val="${o.suff ?? 'tab'}"/><w:lvlText w:val="${esc(o.text)}"/><w:lvlJc w:val="left"/>` +
    pPr({ tabs: o.tab ? [{ val: 'num', pos: o.tab }] : undefined, ind: o.ind }) +
    rPr(o.r ?? {}) +
    '</w:lvl>'
  );
}
export function numberingXml(extraNums = []) {
  const abs = [
    // 1. Étapes : chiffre cerclé, couleur d'accent (une numérotation Word
    // ne sait pas dessiner de pastille pleine).
    lvl({
      fmt: 'decimalEnclosedCircle',
      style: 'FascEtape',
      text: '%1',
      tab: SP[8],
      ind: { left: SP[8], hanging: SP[8] },
      r: { bold: true, color: C.accent, sz: SZ.base },
    }),
    // 2. Puces.
    lvl({
      fmt: 'bullet',
      style: 'ListBullet',
      text: '•',
      tab: SP[5],
      ind: { left: SP[5], hanging: SP[5] },
      r: { font: 'Inter', bold: true, color: C.accent },
    }),
    // 3. Numéro de chapitre.
    lvl({
      fmt: 'decimal',
      style: 'FascNumChapitre',
      text: 'Chapitre %1',
      suff: 'nothing',
      ind: { left: 0, hanging: 0 },
    }),
    // 4. Repères d'une capture : même chiffre cerclé que sur l'image.
    lvl({
      fmt: 'decimalEnclosedCircle',
      style: 'FascRepere',
      text: '%1',
      tab: SP[8],
      ind: { left: SP[8], hanging: SP[8] },
      r: { bold: true, color: C.accentStrong, sz: SZ.base },
    }),
  ];
  let x = abs
    .map(
      (l, i) =>
        `<w:abstractNum w:abstractNumId="${i + 1}"><w:multiLevelType w:val="singleLevel"/>${l}</w:abstractNum>`,
    )
    .join('');
  x += [1, 2, 3, 4]
    .map((i) => `<w:num w:numId="${i}"><w:abstractNumId w:val="${i}"/></w:num>`)
    .join('');
  // Listes numérotées supplémentaires qui repartent de 1.
  for (const n of extraNums)
    x += `<w:num w:numId="${n.id}"><w:abstractNumId w:val="${n.abs}"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`;
  return `${XML_HEAD}<w:numbering ${NS}>${x}</w:numbering>`;
}

/* ── Thème Word : couleurs et polices du design system ───────────── */
export function themeXml() {
  const clr = (n, v) => `<a:${n}><a:srgbClr val="${v}"/></a:${n}>`;
  const font =
    '<a:latin typeface="Inter" panose="020B0502030000000004"/><a:ea typeface=""/><a:cs typeface=""/>';
  const solid = (mods = '') =>
    `<a:solidFill><a:schemeClr val="phClr">${mods}</a:schemeClr></a:solidFill>`;
  return (
    `${XML_HEAD}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Design system">` +
    '<a:themeElements><a:clrScheme name="Design system">' +
    clr('dk1', C.ink) +
    clr('lt1', 'FFFFFF') +
    clr('dk2', C.accentStrong) +
    clr('lt2', C.tintStrong) +
    clr('accent1', C.accent) +
    clr('accent2', C.illustration) +
    clr('accent3', CALLOUTS.Astuce.bar) +
    clr('accent4', CALLOUTS.Attention.bar) +
    clr('accent5', CALLOUTS.Important.bar) +
    clr('accent6', C.inkSoft) +
    clr('hlink', C.accent) +
    clr('folHlink', C.accentStrong) +
    '</a:clrScheme>' +
    `<a:fontScheme name="Design system"><a:majorFont>${font}</a:majorFont><a:minorFont>${font}</a:minorFont></a:fontScheme>` +
    '<a:fmtScheme name="Office"><a:fillStyleLst>' +
    solid() +
    solid('<a:tint val="50000"/>') +
    solid('<a:shade val="80000"/>') +
    '</a:fillStyleLst><a:lnStyleLst>' +
    `<a:ln w="6350" cap="flat" cmpd="sng" algn="ctr">${solid()}<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>` +
    `<a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">${solid()}<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>` +
    `<a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">${solid()}<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>` +
    '</a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>' +
    '<a:bgFillStyleLst>' +
    solid() +
    solid('<a:tint val="95000"/>') +
    solid('<a:shade val="90000"/>') +
    '</a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>'
  );
}

export function settingsXml() {
  return (
    `${XML_HEAD}<w:settings ${NS}>` +
    '<w:zoom w:percent="100"/><w:mirrorMargins/><w:proofState w:spelling="clean" w:grammar="clean"/>' +
    `<w:defaultTabStop w:val="${SP[8]}"/><w:evenAndOddHeaders/>` +
    '<w:characterSpacingControl w:val="doNotCompress"/>' +
    '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>' +
    '<w:themeFontLang w:val="fr-FR"/>' +
    '<w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/>' +
    '<w:decimalSymbol w:val=","/><w:listSeparator w:val=";"/></w:settings>'
  );
}

export function fontTableXml() {
  return (
    `${XML_HEAD}<w:fonts ${NS}>` +
    '<w:font w:name="Inter"><w:altName w:val="Arial"/><w:panose1 w:val="020B0502030000000004"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>' +
    '<w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>' +
    '</w:fonts>'
  );
}

/* ── En-têtes et pieds de page ───────────────────────────────────── */
/** Émetteur dans la marge de tête, aligné côté extérieur. */
export const headerXml = (issuer, even) =>
  `${XML_HEAD}<w:hdr ${NS}>${para({ style: 'Header', jc: even ? 'left' : 'right' }, run(issuer))}</w:hdr>`;

/** Titre courant (chapitre en cours) côté reliure, folio côté extérieur. */
export function footerXml(even) {
  const folio = field('PAGE', { bold: true, color: C.ink }, '1');
  const title = field('STYLEREF 1', {}, 'Titre du chapitre');
  const content = even ? folio + run('\t') + title : title + run('\t') + folio;
  return `${XML_HEAD}<w:ftr ${NS}>${para({ style: 'Footer' }, content)}</w:ftr>`;
}
export const emptyHeaderXml = () => `${XML_HEAD}<w:hdr ${NS}><w:p/></w:hdr>`;
export const emptyFooterXml = () => `${XML_HEAD}<w:ftr ${NS}><w:p/></w:ftr>`;

/** Propriétés de section. kind : 'cover' | 'body' | 'back'. */
export function sectPr(kind, rid) {
  const symmetric = kind !== 'body';
  let refs = '';
  if (kind === 'body')
    refs =
      `<w:headerReference w:type="default" r:id="${rid.hOdd}"/><w:headerReference w:type="even" r:id="${rid.hEven}"/>` +
      `<w:footerReference w:type="default" r:id="${rid.fOdd}"/><w:footerReference w:type="even" r:id="${rid.fEven}"/>`;
  if (kind === 'back')
    refs =
      `<w:headerReference w:type="default" r:id="${rid.hEmpty}"/><w:headerReference w:type="even" r:id="${rid.hEmpty}"/>` +
      `<w:footerReference w:type="default" r:id="${rid.fEmpty}"/><w:footerReference w:type="even" r:id="${rid.fEmpty}"/>`;
  return (
    `<w:sectPr>${refs}` +
    (kind === 'back' ? '<w:type w:val="evenPage"/>' : '') +
    `<w:pgSz w:w="${PAGE.w}" w:h="${PAGE.h}" w:code="11"/>` +
    `<w:pgMar w:top="${MARGIN.top}" w:right="${symmetric ? MARGIN.inside : MARGIN.outside}" w:bottom="${symmetric ? MARGIN.top : MARGIN.bottom}" ` +
    `w:left="${MARGIN.inside}" w:header="${MARGIN.header}" w:footer="${MARGIN.footer}" w:gutter="0"/>` +
    '<w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr>'
  );
}
