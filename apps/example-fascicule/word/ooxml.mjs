/**
 * Briques OOXML minimales pour produire le modèle (.dotx) et l'exemple
 * (.docx) du fascicule sans dépendance externe : échappement, propriétés
 * de paragraphe et de caractère (dans l'ordre imposé par le schéma),
 * runs, champs, images et archive ZIP.
 */
import { deflateRawSync, crc32 } from 'node:zlib';

export const NS =
  'xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" ' +
  'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
  'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
  'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" ' +
  'xmlns:v="urn:schemas-microsoft-com:vml" ' +
  'xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" ' +
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
  'xmlns:w10="urn:schemas-microsoft-com:office:word" ' +
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
  'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ' +
  'xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" ' +
  'xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" ' +
  'xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" ' +
  'xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" ' +
  'xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" ' +
  'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
  'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" ' +
  'mc:Ignorable="w14 w15 wp14"';

export const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';

export const esc = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Typographie française : apostrophe courbe, espaces insécables. */
export const fr = (t) =>
  String(t)
    .replace(/'/g, '\u2019')
    .replace(/\]\] ([+/]) \[\[/g, ']]\u00a0$1\u00a0[[')
    .replace(/ ([:;!?])/g, '\u00a0$1')
    .replace(/« /g, '«\u00a0')
    .replace(/ »/g, '\u00a0»');

const attr = (name, v) => (v === undefined || v === null ? '' : ` w:${name}="${v}"`);

function border(tag, b) {
  if (!b) return '';
  return `<w:${tag} w:val="${b.val ?? 'single'}" w:sz="${b.sz ?? 4}" w:space="${b.space ?? 0}" w:color="${b.color ?? 'auto'}"${b.theme ? ` w:themeColor="${b.theme}"` : ''}/>`;
}

/** Propriétés de caractère (ordre du schéma CT_RPr). */
export function rPr(p = {}) {
  let x = '';
  if (p.style) x += `<w:rStyle w:val="${p.style}"/>`;
  if (p.font)
    x += `<w:rFonts w:ascii="${p.font}" w:hAnsi="${p.font}" w:eastAsia="${p.font}" w:cs="${p.font}"/>`;
  if (p.themeFont)
    x += `<w:rFonts w:asciiTheme="${p.themeFont}HAnsi" w:hAnsiTheme="${p.themeFont}HAnsi" w:eastAsiaTheme="${p.themeFont}HAnsi" w:cstheme="${p.themeFont}Bidi"/>`;
  if (p.bold !== undefined) x += p.bold ? '<w:b/><w:bCs/>' : '<w:b w:val="0"/><w:bCs w:val="0"/>';
  if (p.italic) x += '<w:i/><w:iCs/>';
  if (p.caps) x += '<w:caps/>';
  if (p.noProof) x += '<w:noProof/>';
  if (p.vanish) x += '<w:vanish/>';
  if (p.color)
    x += `<w:color w:val="${p.color}"${p.themeColor ? ` w:themeColor="${p.themeColor}"` : ''}/>`;
  if (p.tracking) x += `<w:spacing w:val="${p.tracking}"/>`;
  if (p.sz) x += `<w:sz w:val="${p.sz}"/><w:szCs w:val="${p.sz}"/>`;
  if (p.bdr) x += border('bdr', p.bdr);
  if (p.shd) x += `<w:shd w:val="clear" w:color="auto" w:fill="${p.shd}"/>`;
  if (p.lang) x += `<w:lang w:val="${p.lang}"/>`;
  return x ? `<w:rPr>${x}</w:rPr>` : '';
}

/** Propriétés de paragraphe (ordre du schéma CT_PPr). */
export function pPr(p = {}, inner = '') {
  let x = '';
  if (p.style) x += `<w:pStyle w:val="${p.style}"/>`;
  if (p.keepNext !== undefined) x += p.keepNext ? '<w:keepNext/>' : '<w:keepNext w:val="0"/>';
  if (p.keepLines) x += '<w:keepLines/>';
  if (p.pageBreakBefore !== undefined)
    x += p.pageBreakBefore ? '<w:pageBreakBefore/>' : '<w:pageBreakBefore w:val="0"/>';
  if (p.num)
    x += `<w:numPr><w:ilvl w:val="${p.num.lvl ?? 0}"/><w:numId w:val="${p.num.id}"/></w:numPr>`;
  if (p.bdr) {
    const b = p.bdr;
    x += `<w:pBdr>${border('top', b.top)}${border('left', b.left)}${border('bottom', b.bottom)}${border('right', b.right)}${border('between', b.between)}</w:pBdr>`;
  }
  if (p.shd) x += `<w:shd w:val="clear" w:color="auto" w:fill="${p.shd}"/>`;
  if (p.tabs)
    x += `<w:tabs>${p.tabs.map((t) => `<w:tab w:val="${t.val}"${t.leader ? ` w:leader="${t.leader}"` : ''} w:pos="${t.pos}"/>`).join('')}</w:tabs>`;
  if (p.noHyphen) x += '<w:suppressAutoHyphens/>';
  const s = p.spacing;
  if (s)
    x += `<w:spacing${attr('before', s.before)}${attr('after', s.after)}${attr('line', s.line)}${s.line ? attr('lineRule', s.rule ?? 'auto') : ''}/>`;
  const i = p.ind;
  if (i)
    x += `<w:ind${attr('left', i.left)}${attr('right', i.right)}${attr('hanging', i.hanging)}${attr('firstLine', i.firstLine)}/>`;
  if (p.contextual) x += '<w:contextualSpacing/>';
  if (p.jc) x += `<w:jc w:val="${p.jc}"/>`;
  if (p.outline !== undefined) x += `<w:outlineLvl w:val="${p.outline}"/>`;
  x += inner;
  return x ? `<w:pPr>${x}</w:pPr>` : '';
}

/**
 * Texte enrichi minimal : **gras** et [[Touche]] (style de caractère
 * « Touche »). Le reste est du texte simple, typographié en français.
 */
export function rich(text, base = {}) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\[\[(.+?)\]\]/g;
  let last = 0;
  let m;
  const t = fr(text);
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(run(t.slice(last, m.index), base, false));
    if (m[1]) out.push(run(m[1], { ...base, bold: true }, false));
    else out.push(run(m[2].replace(/ /g, ' '), { ...base, style: 'FascTouche' }, false));
    last = re.lastIndex;
  }
  if (last < t.length) out.push(run(t.slice(last), base, false));
  return out.join('');
}

export function run(text, props = {}, typo = true) {
  const t = typo ? fr(text) : text;
  const body = t
    .split('\n')
    .map(
      (line, li) =>
        (li ? '<w:br/>' : '') +
        line
          .split('\t')
          .map(
            (s, i) =>
              (i ? '<w:tab/>' : '') + (s ? `<w:t xml:space="preserve">${esc(s)}</w:t>` : ''),
          )
          .join(''),
    )
    .join('');
  return `<w:r>${rPr(props)}${body}</w:r>`;
}

export const para = (props, content = '') => `<w:p>${pPr(props)}${content}</w:p>`;

/** Champ complexe (PAGE, STYLEREF, SEQ, TOC…). */
export function field(instr, props = {}, placeholder = '') {
  const r = rPr(props);
  return (
    `<w:r>${r}<w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>` +
    `<w:r>${r}<w:instrText xml:space="preserve"> ${esc(instr)} </w:instrText></w:r>` +
    `<w:r>${r}<w:fldChar w:fldCharType="separate"/></w:r>` +
    (placeholder ? `<w:r>${r}<w:t xml:space="preserve">${esc(placeholder)}</w:t></w:r>` : '') +
    `<w:r>${r}<w:fldChar w:fldCharType="end"/></w:r>`
  );
}

/** Image en ligne. cx/cy en EMU ; crop en millièmes de pourcent. */
let docPrId = 100;
export function image(rid, cx, cy, name, descr, crop) {
  const id = docPrId++;
  const src = crop
    ? `<a:srcRect t="${crop.t ?? 0}" b="${crop.b ?? 0}" l="${crop.l ?? 0}" r="${crop.r ?? 0}"/>`
    : '<a:srcRect/>';
  return (
    `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
    `<wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>` +
    `<wp:docPr id="${id}" name="${esc(name)}" descr="${esc(descr)}"/>` +
    `<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
    `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="${esc(name)}" descr="${esc(descr)}"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rid}"/>${src}<a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
    `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`
  );
}

/** Archive ZIP (méthode deflate), dates figées pour un résultat reproductible. */
export function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  const dosTime = 0;
  const dosDate = ((2026 - 1980) << 9) | (11 << 5) | 5;
  for (const [name, content] of entries) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
    const comp = deflateRawSync(data, { level: 9 });
    const crc = crc32(data) >>> 0;
    const nameBuf = Buffer.from(name, 'utf8');
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, comp);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(comp.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + comp.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}
