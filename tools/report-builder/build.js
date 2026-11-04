#!/usr/bin/env node
'use strict';
/**
 * MCA mini-project report builder.
 *   node build.js <content.js> <out.docx> [--pdf <out.pdf>]
 *
 * Structure follows sample/MINI PROJECT REPORT.pdf (front matter order, numbered
 * chapters, REFERENCES) and the formatting rules in .claude/01..05 (A4, Times New
 * Roman 12, margins L4 T3 B3 R2 cm, 1.5 spacing, Roman then Arabic page numbers,
 * bottom-centre, no numbers on the first three pages).
 *
 * The Contents page is generated in two passes: build -> render with LibreOffice ->
 * read the real page of every heading -> rebuild. See README.md for the content API.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  HeadingLevel, PageNumber, Footer, BorderStyle, ShadingType, TabStopType, LeaderType, TableLayoutType,
  LevelFormat, NumberFormat, PageBorderDisplay, PageBorderOffsetFrom, PageBorderZOrder, VerticalAlign, Tab,
} = D;

const FONT = 'Times New Roman';
const MONO = 'Courier New';
const CM = 567;                  // twips per cm
const TEXT_W = 15 * CM;          // 21 - 4 - 2 cm
const DXA = WidthType.DXA;
const AUTO = D.LineRuleType.AUTO;

/* ------------------------------------------------------------------ helpers */
function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Only PNG images are supported');
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
const cmToPx = (cm) => Math.round((cm / 2.54) * 96);

const RISKY = [
  [/\b(we|i)\s+(tested|surveyed|interviewed|observed|measured|deployed|piloted)\b/i, 'claims an activity that has not happened'],
  [/\b(was|were|has been|have been)\s+(tested|deployed|piloted|surveyed|validated|evaluated)\b/i, 'claims testing/deployment that has not happened'],
  [/\b(test results?|survey results?|user feedback showed|participants (said|reported))\b/i, 'refers to results that do not exist'],
  [/\b(achiev(ed|es)|reduc(ed|es)|improv(ed|es)|increas(ed|es))\b[^.]{0,40}\b\d+(\.\d+)?\s?%/i, 'states a measured percentage improvement'],
  [/\b(accuracy|latency|throughput|uptime) of \d/i, 'states a performance number'],
  [/\bin (a|the) pilot\b/i, 'refers to a pilot'],
];

class Ctx {
  constructor(content, pagesMap) {
    this.c = content;
    this.pagesMap = pagesMap;
    this.ch = 0; this.sec = 0; this.sub = 0;
    this.fig = 0; this.tab = 0; this.lst = 0;
    this.headings = [];
    this.numConfigs = [];
    this.warnings = [];
    this.placeholders = new Set();
    this.figCount = 0;
  }
  warn(msg) { this.warnings.push(msg); }
  lint(text, where) {
    if (!text) return;
    for (const [re, why] of RISKY) {
      const m = String(text).match(re);
      if (m) this.warn(`${where}: "${m[0]}" - ${why}`);
    }
  }
}

/** inline markup: **bold**, *italic*, `code`, [[placeholder]] */
function runs(ctx, text, base = {}) {
  const b = { font: FONT, size: 24, ...base };
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[\[[^\]]+\]\])/g;
  let last = 0, m;
  const s = String(text);
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(new TextRun({ ...b, text: s.slice(last, m.index) }));
    const t = m[0];
    if (t.startsWith('**')) out.push(...runs(ctx, t.slice(2, -2), { ...base, bold: true }));
    else if (t.startsWith('[[')) { ctx.placeholders.add(t.slice(2, -2)); out.push(new TextRun({ ...b, text: '[' + t.slice(2, -2) + ']', shading: { type: ShadingType.CLEAR, fill: 'FFFF00', color: 'auto' } })); }
    else if (t.startsWith('`')) out.push(new TextRun({ ...b, text: t.slice(1, -1), font: MONO, size: Math.max(18, (b.size || 24) - 2) }));
    else out.push(...runs(ctx, t.slice(1, -1), { ...base, italics: true }));
    last = m.index + t.length;
  }
  if (last < s.length) out.push(new TextRun({ ...b, text: s.slice(last) }));
  return out;
}

const bodyPara = (ctx, text, opts = {}) => {
  ctx.lint(text, 'paragraph "' + String(text).slice(0, 40) + '..."');
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { lineRule: AUTO, line: 360, after: 120 },
    indent: opts.noIndent ? undefined : { firstLine: CM },
    children: runs(ctx, text),
  });
};

const border = (c = '000000', sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color: c });
const allBorders = (c, sz) => ({ top: border(c, sz), bottom: border(c, sz), left: border(c, sz), right: border(c, sz) });
const noBorders = () => { const n = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }; return { top: n, bottom: n, left: n, right: n }; };

function normWidths(weights, total = TEXT_W) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const w = weights.map((x) => Math.floor((x / sum) * total));
  w[w.length - 1] += total - w.reduce((a, b) => a + b, 0);
  return w;
}

/* ------------------------------------------------------------------ blocks */
function headingBlock(ctx, level, title) {
  if (/[:]/.test(title)) throw new Error(`Heading "${title}" contains a colon (rule 01-formatting #9)`);
  let label = '';
  if (level === 1) { ctx.ch++; ctx.sec = 0; ctx.sub = 0; ctx.fig = 0; ctx.tab = 0; ctx.lst = 0; label = String(ctx.ch); }
  if (level === 2) { ctx.sec++; ctx.sub = 0; label = `${ctx.ch}.${ctx.sec}`; }
  if (level === 3) { ctx.sub++; label = `${ctx.ch}.${ctx.sec}.${ctx.sub}`; }
  ctx.headings.push({ level, label, title });
  const size = level === 1 ? 28 : level === 2 ? 26 : 24;
  const hang = level === 3 ? 1134 : 850;
  return new Paragraph({
    heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][level - 1],
    pageBreakBefore: level === 1,
    keepNext: true, keepLines: true,
    spacing: { before: level === 1 ? 0 : 240, after: level === 1 ? 240 : 120, lineRule: AUTO, line: 360 },
    tabStops: [{ type: TabStopType.LEFT, position: hang }],
    indent: { left: hang, hanging: hang },
    children: [new TextRun({ font: FONT, size, bold: true, children: [label, new Tab(), title] })],
  });
}

function referencesHeading(ctx) {
  ctx.headings.push({ level: 1, label: '', title: 'REFERENCES' });
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true,
    spacing: { before: 0, after: 240, lineRule: AUTO, line: 360 },
    children: [new TextRun({ font: FONT, size: 28, bold: true, text: 'REFERENCES' })],
  });
}

function captionPara(ctx, label, text, { above = false } = {}) {
  ctx.lint(text, 'caption "' + String(text).slice(0, 40) + '"');
  return new Paragraph({
    alignment: AlignmentType.CENTER, keepLines: true, keepNext: above,
    spacing: { before: above ? 200 : 60, after: above ? 100 : 240, lineRule: AUTO, line: 264 },
    children: [new TextRun({ font: FONT, size: 24, bold: true, text: label + ' ' }), ...runs(ctx, text, { size: 24 })],
  });
}

function imageRun(ctx, file, widthCm, maxHeightCm) {
  const p = path.isAbsolute(file) ? file : path.join(ctx.c.figuresDir || '.', file);
  if (!fs.existsSync(p)) throw new Error('Figure not found: ' + p);
  const buf = fs.readFileSync(p);
  const { w, h } = pngSize(buf);
  let wc = widthCm, hc = (widthCm * h) / w;
  if (hc > maxHeightCm) { hc = maxHeightCm; wc = (maxHeightCm * w) / h; }
  ctx.figCount++;
  return new ImageRun({
    type: 'png', data: buf,
    transformation: { width: cmToPx(wc), height: cmToPx(hc) },
    altText: { title: path.basename(p), description: path.basename(p), name: path.basename(p) },
  });
}

function figBlock(ctx, f) {
  ctx.fig++;
  const label = `Fig. ${ctx.ch}.${ctx.fig}`;
  const run = imageRun(ctx, f.file, f.widthCm || 15, f.maxHeightCm || 17);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 0 }, children: [run] }),
    captionPara(ctx, label, f.caption),
  ];
}

function figsBlock(ctx, g) {
  const cols = g.cols || 2;
  const cellW = Math.floor(TEXT_W / cols);
  const imgW = (cellW / CM) - 0.35;
  const maxH = g.maxHeightCm || 14;
  const rows = [];
  for (let i = 0; i < g.items.length; i += cols) {
    const slice = g.items.slice(i, i + cols);
    const cells = slice.map((it) => {
      ctx.fig++;
      const label = `Fig. ${ctx.ch}.${ctx.fig}`;
      ctx.lint(it.caption, 'caption');
      return new TableCell({
        width: { size: cellW, type: DXA }, borders: noBorders(), verticalAlign: VerticalAlign.TOP,
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 0 }, children: [imageRun(ctx, it.file, g.widthCm || imgW, maxH)] }),
          new Paragraph({
            alignment: AlignmentType.CENTER, keepLines: true, spacing: { before: 60, after: 120, lineRule: AUTO, line: 252 },
            children: [new TextRun({ font: FONT, size: 22, bold: true, text: label + ' ' }), ...runs(ctx, it.caption, { size: 22 })],
          }),
        ],
      });
    });
    while (cells.length < cols) cells.push(new TableCell({ width: { size: cellW, type: DXA }, borders: noBorders(), children: [new Paragraph('')] }));
    rows.push(new TableRow({ cantSplit: true, children: cells }));
  }
  return [new Table({ width: { size: cellW * cols, type: DXA }, columnWidths: Array(cols).fill(cellW), layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, rows }), new Paragraph({ spacing: { after: 120 }, children: [] })];
}

function tableBlock(ctx, t) {
  ctx.tab++;
  const label = `Table ${ctx.ch}.${ctx.tab}`;
  const widths = normWidths(t.widths || t.headers.map(() => 1));
  const size = t.size || 22;
  const mk = (txt, w, header, align) => new TableCell({
    width: { size: w, type: DXA }, borders: allBorders('000000', 4), verticalAlign: VerticalAlign.CENTER,
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    shading: header ? { type: ShadingType.CLEAR, fill: 'D9D9D9', color: 'auto' } : undefined,
    children: String(txt).split('\n').map((line) => {
      ctx.lint(line, 'table cell');
      return new Paragraph({ alignment: align || AlignmentType.LEFT, spacing: { lineRule: AUTO, line: 259, after: 0 }, children: runs(ctx, line, { size, bold: header }) });
    }),
  });
  const aligns = (t.align || []).map((a) => (a === 'c' ? AlignmentType.CENTER : a === 'r' ? AlignmentType.RIGHT : AlignmentType.LEFT));
  const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: t.headers.map((h, i) => mk(h, widths[i], true, AlignmentType.CENTER)) })];
  for (const r of t.rows) {
    if (r.length !== t.headers.length) throw new Error(`Table row has ${r.length} cells, expected ${t.headers.length}: ${r[0]}`);
    rows.push(new TableRow({ cantSplit: true, children: r.map((c, i) => mk(c, widths[i], false, aligns[i])) }));
  }
  return [
    captionPara(ctx, label, t.caption, { above: true }),
    new Table({ width: { size: TEXT_W, type: DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, rows }),
    new Paragraph({ spacing: { after: 160 }, children: [] }),
  ];
}

function codeBlock(ctx, c) {
  ctx.lst++;
  const label = `Listing ${ctx.ch}.${ctx.lst}`;
  const out = [];
  if (c.caption) out.push(captionPara(ctx, label, c.caption, { above: true }));
  const lines = String(c.text).replace(/\t/g, '    ').replace(/\n+$/, '').split('\n');
  const paras = lines.map((ln) => {
    if (ln.length > 84) ctx.warn(`code line >84 chars (will wrap) in ${label}: ${ln.slice(0, 40)}...`);
    return new Paragraph({ keepLines: true, spacing: { lineRule: AUTO, line: 240, after: 0 }, children: [new TextRun({ font: MONO, size: 18, text: ln.length ? ln : ' ' })] });
  });
  out.push(new Table({
    width: { size: TEXT_W, type: DXA }, columnWidths: [TEXT_W], layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER,
    rows: [new TableRow({ children: [new TableCell({
      width: { size: TEXT_W, type: DXA }, borders: allBorders('BFBFBF', 4),
      shading: { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' },
      margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: paras,
    })] })],
  }));
  out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  return out;
}

function processBody(ctx, blocks) {
  const out = [];
  let hasRefs = false;
  for (const b of blocks) {
    if (b.h1 !== undefined) out.push(headingBlock(ctx, 1, b.h1));
    else if (b.h2 !== undefined) out.push(headingBlock(ctx, 2, b.h2));
    else if (b.h3 !== undefined) out.push(headingBlock(ctx, 3, b.h3));
    else if (b.p !== undefined) out.push(bodyPara(ctx, b.p, b));
    else if (b.bullets) for (const it of b.bullets) { ctx.lint(it, 'bullet'); out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, numbering: { reference: 'bul', level: 0 }, spacing: { lineRule: AUTO, line: 360, after: 60 }, children: runs(ctx, it) })); }
    else if (b.numbered) {
      const ref = 'num' + ctx.numConfigs.length;
      ctx.numConfigs.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
      for (const it of b.numbered) { ctx.lint(it, 'numbered item'); out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, numbering: { reference: ref, level: 0 }, spacing: { lineRule: AUTO, line: 360, after: 60 }, children: runs(ctx, it) })); }
    }
    else if (b.fig) out.push(...figBlock(ctx, b.fig));
    else if (b.figs) out.push(...figsBlock(ctx, b.figs));
    else if (b.table) out.push(...tableBlock(ctx, b.table));
    else if (b.code) out.push(...codeBlock(ctx, b.code));
    else if (b.pagebreak) out.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    else if (b.references) { hasRefs = true; out.push(referencesHeading(ctx)); out.push(...referenceList(ctx, b.references)); }
    else throw new Error('Unknown block: ' + JSON.stringify(b).slice(0, 80));
  }
  if (!hasRefs) ctx.warn('No {references:[...]} block found - REFERENCES chapter is required');
  return out;
}

function referenceList(ctx, refs) {
  const key = (r) => r.replace(/^[^A-Za-z]+/, '').toLowerCase();
  for (let i = 1; i < refs.length; i++) if (key(refs[i - 1]) > key(refs[i])) ctx.warn(`References not alphabetical: "${refs[i - 1].slice(0, 30)}" before "${refs[i].slice(0, 30)}"`);
  return refs.map((r) => new Paragraph({
    alignment: AlignmentType.JUSTIFIED, spacing: { lineRule: AUTO, line: 360, after: 120 }, indent: { left: 567, hanging: 567 },
    children: runs(ctx, r),
  }));
}

/* ------------------------------------------------------------ front matter */
const center = (ctx, text, o = {}) => new Paragraph({
  alignment: AlignmentType.CENTER, pageBreakBefore: !!o.pb, keepNext: !!o.keepNext,
  spacing: { before: o.before || 0, after: o.after === undefined ? 120 : o.after, lineRule: AUTO, line: o.line || 276 },
  children: runs(ctx, text, { size: o.size || 24, bold: !!o.bold, italics: !!o.italics }),
});

function titlePage(ctx) {
  const c = ctx.c;
  return [
    center(ctx, c.title, { size: 30, bold: true, before: 480, after: 360, lineRule: AUTO, line: 300 }),
    center(ctx, 'MINI PROJECT REPORT', { size: 26, bold: true, after: 480 }),
    center(ctx, 'Submitted by', { italics: true, after: 160 }),
    center(ctx, c.student.name, { bold: true, size: 26, after: 40 }),
    center(ctx, c.student.regNo, { bold: true, after: 480 }),
    center(ctx, 'Under the Guidance of', { bold: true, after: 60 }),
    center(ctx, c.guide.name, { bold: true, after: 40 }),
    center(ctx, c.guide.designation, { size: 22, after: 300 }),
    center(ctx, 'in', { italics: true, after: 40 }),
    center(ctx, 'partial fulfillment for the award of the degree of', { italics: true, after: 240 }),
    center(ctx, 'MASTER OF COMPUTER APPLICATIONS', { bold: true, size: 28, after: 480 }),
    center(ctx, '[[INSTITUTION LOGO]]', { after: 480 }),
    ...c.institution.map((l) => center(ctx, l, { bold: true, size: 26, after: 60 })),
    center(ctx, c.monthYear, { before: 360, after: 0 }),
  ];
}

function sigTable(ctx, left, right) {
  const w = Math.floor(TEXT_W / 2);
  const cell = (lines) => new TableCell({
    width: { size: w, type: DXA }, borders: noBorders(),
    children: lines.map((l, i) => new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: i === 0 ? 480 : 0, after: 40, lineRule: AUTO, line: 276 }, children: runs(ctx, l, { bold: i < 2 }) })),
  });
  return new Table({ width: { size: w * 2, type: DXA }, columnWidths: [w, w], layout: TableLayoutType.FIXED, rows: [new TableRow({ children: [cell(left), cell(right)] })] });
}

function bonafidePage(ctx) {
  const c = ctx.c;
  return [
    ...c.institution.map((l, i) => center(ctx, l, { bold: true, size: 28, after: 60, pb: i === 0 })),
    center(ctx, 'BONAFIDE CERTIFICATE', { bold: true, size: 28, before: 360, after: 360 }),
    bodyPara(ctx, `This is to certify that the Mini Project Work Report titled “**${c.title}**” is the bonafide work of **${c.student.name} ${c.student.regNo}**, who carried out the Mini Project Work under my supervision. Certified further, that to the best of my knowledge the work reported herein does not form any other project report or dissertation on the basis of which a degree or award was conferred on an earlier occasion on this or any other candidate.`),
    sigTable(ctx, ['SIGNATURE', c.guide.name, c.guide.designation], ['SIGNATURE', c.hod, 'Head of the Department']),
    new Paragraph({ spacing: { before: 480, after: 120, lineRule: AUTO, line: 360 }, children: runs(ctx, 'Submitted for the Mini Project viva-voce examination held on [[DATE OF VIVA]]') }),
    sigTable(ctx, ['INTERNAL EXAMINER'], ['EXTERNAL EXAMINER']),
  ];
}

function certificatePage(ctx) {
  const c = ctx.c;
  return [
    center(ctx, 'CERTIFICATE OF MINI PROJECT WORK', { bold: true, size: 28, before: 480, after: 480, pb: true }),
    bodyPara(ctx, `This is to certify that **${c.student.name} ${c.student.regNo}** has undergone Mini Project Work during the period from ${c.period.from} to ${c.period.to} under the guidance of ${c.guide.name}.`),
    bodyPara(ctx, 'This work has been carried out in partial fulfillment of the requirements for the award of the degree of **MASTER OF COMPUTER APPLICATIONS**.'),
    sigTable(ctx, ['SIGNATURE', c.guide.name, 'Guide'], ['SIGNATURE', c.hod, 'Head of the Department']),
  ];
}

function acknowledgementPage(ctx) {
  const c = ctx.c;
  return [
    center(ctx, 'Acknowledgement', { bold: true, size: 28, after: 360 }),
    ...c.acknowledgement.map((t) => bodyPara(ctx, t)),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 360, after: 0 }, children: runs(ctx, c.student.name, { bold: true }) }),
  ];
}

function abstractPage(ctx) {
  const c = ctx.c;
  const words = c.abstract.split(/\s+/).length;
  if (words > 330) ctx.warn(`Abstract has ${words} words - may overflow one page (limit ~330)`);
  if (/\n/.test(c.abstract)) ctx.warn('Abstract must be ONE paragraph');
  ctx.lint(c.abstract, 'abstract');
  return [
    center(ctx, 'Abstract', { bold: true, size: 28, after: 360, pb: true }),
    bodyPara(ctx, c.abstract),
  ];
}

function contentsPage(ctx) {
  const items = ctx.headings.map((h) => {
    const key = h.label || h.title;
    const pg = ctx.pagesMap ? ctx.pagesMap[key] : 0;
    const ind = h.level === 1 ? 0 : h.level === 2 ? 567 : 1134;
    const labelW = h.level === 3 ? 1000 : 850;
    const kids = h.label
      ? [h.label, new Tab(), h.title, new Tab(), String(pg)]
      : [h.title, new Tab(), String(pg)];
    const stops = h.label
      ? [{ type: TabStopType.LEFT, position: ind + labelW }, { type: TabStopType.RIGHT, position: TEXT_W, leader: LeaderType.DOT }]
      : [{ type: TabStopType.RIGHT, position: TEXT_W, leader: LeaderType.DOT }];
    return new Paragraph({
      tabStops: stops,
      indent: { left: ind + (h.label ? labelW : 0), hanging: h.label ? labelW : 0, right: 0 },
      spacing: { before: h.level === 1 ? 100 : 0, after: 40, lineRule: AUTO, line: 276 },
      keepLines: true,
      children: [new TextRun({ font: FONT, size: 24, bold: h.level === 1, children: kids })],
    });
  });
  return [center(ctx, 'Contents', { bold: true, size: 28, after: 240, pb: true }), ...items];
}

/* ---------------------------------------------------------------- document */
function build(content, pagesMap) {
  const ctx = new Ctx(content, pagesMap);
  for (const k of ['title', 'student', 'guide', 'institution', 'monthYear', 'period', 'hod', 'abstract', 'acknowledgement', 'body']) {
    if (content[k] === undefined) throw new Error('content.' + k + ' is required');
  }
  const body = processBody(ctx, content.body);
  const s1 = [...titlePage(ctx), ...bonafidePage(ctx), ...certificatePage(ctx)];
  const s2 = [...acknowledgementPage(ctx), ...abstractPage(ctx), ...contentsPage(ctx)];

  const brd = (space) => ({ style: BorderStyle.SINGLE, size: 8, color: '000000', space });
  const page = (pageNumbers) => ({
    size: { width: 11906, height: 16838 },
    margin: { top: 3 * CM, bottom: 3 * CM, left: 4 * CM, right: 2 * CM, header: 700, footer: 800 },
    borders: {
      pageBorders: { display: PageBorderDisplay.ALL_PAGES, offsetFrom: PageBorderOffsetFrom.PAGE, zOrder: PageBorderZOrder.FRONT },
      pageBorderTop: brd(26), pageBorderBottom: brd(26), pageBorderLeft: brd(26), pageBorderRight: brd(26),
    },
    ...(pageNumbers ? { pageNumbers } : {}),
  });
  const footer = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ font: FONT, size: 24, children: [PageNumber.CURRENT] })] })] });

  const doc = new Document({
    creator: content.student.name.replace(/[\[\]]/g, ''), title: content.title,
    styles: {
      default: {
        document: { run: { font: FONT, size: 24 }, paragraph: { spacing: { lineRule: AUTO, line: 360 } } },
        heading1: { run: { font: FONT, size: 28, bold: true, color: '000000' }, paragraph: { spacing: { before: 0, after: 240, lineRule: AUTO, line: 360 }, keepNext: true, keepLines: true } },
        heading2: { run: { font: FONT, size: 26, bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 120, lineRule: AUTO, line: 360 }, keepNext: true, keepLines: true } },
        heading3: { run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { spacing: { before: 200, after: 100, lineRule: AUTO, line: 360 }, keepNext: true, keepLines: true } },
      },
    },
    numbering: {
      config: [
        { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        ...ctx.numConfigs,
      ],
    },
    sections: [
      { properties: { page: page(null) }, children: s1 },
      { properties: { page: page({ start: 4, formatType: NumberFormat.LOWER_ROMAN }) }, footers: { default: footer() }, children: s2 },
      { properties: { page: page({ start: 1, formatType: NumberFormat.DECIMAL }) }, footers: { default: footer() }, children: body },
    ],
  });
  return { doc, ctx };
}

/* ------------------------------------------------------- render & locate */
function toPdf(docx, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  execFileSync('soffice', ['--headless', '-env:UserInstallation=file:///tmp/lo-profile-rb', '--convert-to', 'pdf', '--outdir', outDir, docx], { stdio: 'pipe', timeout: 240000 });
  const pdf = path.join(outDir, path.basename(docx).replace(/\.docx$/, '.pdf'));
  const txt = execFileSync('pdftotext', ['-layout', pdf, '-'], { maxBuffer: 1 << 27 }).toString();
  const pages = txt.split('\f'); if (pages[pages.length - 1].trim() === '') pages.pop();
  return { pdf, pages };
}
const norm = (s) => s.replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();

function locate(headings, pages) {
  const lines = pages.map((p) => p.split('\n').map(norm));
  const tocIdx = lines.map((l, i) => [i, l.filter((x) => /\.{6,}/.test(x)).length]).filter(([, n]) => n >= 3).map(([i]) => i);
  if (!tocIdx.length) throw new Error('Could not find the Contents pages in the rendered PDF');
  const bodyStart = Math.max(...tocIdx) + 1;
  const map = {}; let from = bodyStart;
  for (const h of headings) {
    const target = norm(h.label ? `${h.label} ${h.title}` : h.title);
    const needle = target.slice(0, Math.min(target.length, 26));
    let found = -1;
    for (let i = from; i < pages.length; i++) if (lines[i].some((l) => l.startsWith(needle))) { found = i; break; }
    if (found < 0) throw new Error(`Heading not found in render: "${target}"`);
    map[h.label || h.title] = found - bodyStart + 1;
    from = found;
  }
  return { map, bodyStart, tocPages: tocIdx.length, total: pages.length };
}

async function main() {
  const args = process.argv.slice(2);
  const [contentPath, outDocx] = args;
  if (!contentPath || !outDocx) { console.error('usage: node build.js <content.js> <out.docx> [--pdf <out.pdf>]'); process.exit(2); }
  const pdfOut = args.includes('--pdf') ? args[args.indexOf('--pdf') + 1] : null;
  delete require.cache[path.resolve(contentPath)];
  const content = require(path.resolve(contentPath));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rb-'));
  const write = async (name, pagesMap) => {
    const { doc, ctx } = build(content, pagesMap);
    const f = path.join(tmp, name);
    fs.writeFileSync(f, await Packer.toBuffer(doc));
    return { f, ctx };
  };

  let r = await write('pass1.docx', null);
  let info = locate(r.ctx.headings, toPdf(r.f, tmp).pages);
  let finalPages;
  for (let i = 0; i < 3; i++) {
    r = await write('report.docx', info.map);
    const rendered = toPdf(r.f, tmp);
    const next = locate(r.ctx.headings, rendered.pages);
    finalPages = rendered;
    if (JSON.stringify(next.map) === JSON.stringify(info.map)) { info = next; break; }
    info = next;
  }
  fs.mkdirSync(path.dirname(path.resolve(outDocx)), { recursive: true });
  fs.copyFileSync(r.f, outDocx);
  if (pdfOut) fs.copyFileSync(finalPages.pdf, pdfOut);

  const front = info.bodyStart; // pdf pages before chapter 1
  const bodyPages = info.total - front;
  console.log('\n=== BUILD REPORT ===');
  console.log(`docx            : ${outDocx}`);
  console.log(`pdf (render)    : ${pdfOut || finalPages.pdf}`);
  console.log(`total pages     : ${info.total}  (front matter ${front}, body+references ${bodyPages})  ${info.total >= 30 ? 'OK >= 30' : 'FAIL < 30 pages'}`);
  console.log(`headings        : ${r.ctx.headings.length}   figures: ${r.ctx.figCount}   tables: ${r.ctx.tab >= 0 ? 'see Table numbering' : ''}`);
  console.log(`contents pages  : ${info.tocPages}`);
  const absIdx = finalPages.pages.findIndex((p) => /^\s*Abstract\s*$/m.test(p));
  if (absIdx >= 0) console.log(`abstract page   : pdf page ${absIdx + 1}; next page starts with "${norm(finalPages.pages[absIdx + 1] || '').slice(0, 20)}" ${/Contents/.test(finalPages.pages[absIdx + 1] || '') ? '(OK, abstract fits one page)' : '(CHECK: abstract may overflow)'}`);
  console.log('\nHEADING PAGES:');
  for (const h of r.ctx.headings) console.log(`  ${'  '.repeat(h.level - 1)}${h.label ? h.label + ' ' : ''}${h.title} ... ${info.map[h.label || h.title]}`);
  console.log(`\nWARNINGS (${r.ctx.warnings.length}) - fix or justify each:`);
  for (const w of r.ctx.warnings) console.log('  - ' + w);
  console.log('\nFILL-IN FIELDS (yellow in the document):');
  for (const p of [...r.ctx.placeholders]) console.log('  - ' + p);
}
main().catch((e) => { console.error('BUILD FAILED:', e.message); process.exit(1); });
