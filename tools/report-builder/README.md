# Report builder

Turns a `content.js` module into a submission-ready `.docx` that follows
`sample/MINI PROJECT REPORT.pdf` (front matter order, numbered chapters, REFERENCES)
and `.claude/01..05` (A4, Times New Roman 12, margins L4 T3 B3 R2 cm, 1.5 spacing,
page border, Roman then Arabic page numbers bottom-centre, none on the first 3 pages).

```bash
node tools/report-builder/build.js  <content.js>  <out.docx>  --pdf <preview.pdf>
node tools/report-builder/shot.js   <diagram.html> <out.png> [widthPx]   # diagrams -> PNG
```

The build renders the document with LibreOffice twice to read the real page of every
heading, so the Contents page numbers are correct. It prints a BUILD REPORT: page
count, every heading with its page, WARNINGS, and the yellow FILL-IN FIELDS.

## content.js shape

```js
module.exports = {
  title: 'UPPER CASE REPORT TITLE',
  student: { name: '[[PAVAN GOKUL]]', regNo: '[[REGISTER NUMBER]]' },
  guide: { name: '[[GUIDE NAME]]', designation: '[[Designation, Department]]' },
  institution: ['[[DEPARTMENT NAME]]', '[[INSTITUTION NAME]]', '[[CITY - PINCODE]]'],
  monthYear: 'NOVEMBER 2026',
  period: { from: '[[START DATE]]', to: '[[END DATE]]' },
  hod: '[[HOD NAME]]',
  figuresDir: '/abs/path/to/pngs',          // figure files are looked up here
  abstract: 'ONE paragraph, <= 300 words, must fit one page.',
  acknowledgement: ['para', 'para', ...],
  body: [ ...blocks ],
};
```

`[[TEXT]]` anywhere becomes a yellow-highlighted `[TEXT]` placeholder the student must
replace. Use it only for facts only the student knows (names, dates, register number).

## Blocks (`body` is a flat array)

| Block | Notes |
|---|---|
| `{h1:'Introduction'}` | Auto-numbered `1`, new page. No colons in any heading. |
| `{h2:'Domain background'}` / `{h3:'...'}` | Auto-numbered `2.1`, `2.1.1`. Included in Contents. |
| `{p:'text'}` | Justified, 1.5 spacing, first-line indent. `{p:'..',noIndent:true}` to suppress. |
| `{bullets:['a','b']}` / `{numbered:['a','b']}` | Lists (numbered restarts each time). |
| `{fig:{file,caption,widthCm?,maxHeightCm?}}` | One PNG, auto `Fig. 3.1`, caption below. Default width 15 cm, max height 17 cm. |
| `{figs:{cols:2,items:[{file,caption}],maxHeightCm?}}` | Side-by-side grid, each auto-numbered. Use `cols:2` for phone screens (3 is too small to read). |
| `{table:{caption,headers,rows,widths?,align?,size?}}` | Auto `Table 3.1`, caption above. `widths` are relative weights. `align:['l','c','r']`. |
| `{code:{caption?,text}}` | Monospace block, auto `Listing 3.1`. Keep lines <= 80 chars. |
| `{pagebreak:true}` | Rarely needed. |
| `{references:[...]}` | Must be the last block. Alphabetical by author. Format: `Author, Title, Publisher/Source, Year.` |

Inline markup in any text: `**bold**`, `*italic*`, `` `code` ``. Do not write a literal
asterisk (use ×). Figure files must be PNG.

## Diagrams

Write an HTML/SVG file with a root element sized to its content, render it with
`shot.js` (Playwright, 2x scale) to a PNG in your figures directory, then include it with
`{fig:{...}}`. Keep diagrams black/white-printable, fonts >= 11 px at 15 cm width.

## Honesty rules (enforced by a linter that prints WARNINGS)

The build flags phrases such as "we tested", "survey results", "achieved 30%",
"was deployed". Rewrite them; the project is a documented design and high-fidelity
prototype, not a deployed system.
