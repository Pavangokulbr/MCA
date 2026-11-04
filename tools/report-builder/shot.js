#!/usr/bin/env node
'use strict';
// node shot.js <input.html> <output.png> [widthPx=900]
// Renders the element with id="d" (or the body) at 2x scale to a PNG.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [inp, out, w] = process.argv.slice(2);
  if (!inp || !out) { console.error('usage: node shot.js <input.html> <output.png> [widthPx]'); process.exit(2); }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Number(w) || 900, height: 600 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(inp));
  await p.waitForTimeout(400);
  const el = (await p.$('#d')) || (await p.$('body'));
  await el.screenshot({ path: out });
  await b.close();
  console.log('wrote', out);
})();
