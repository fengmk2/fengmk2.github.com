#!/usr/bin/env node
// Build the Open Graph image font: void-blog renders only the post title + site host into
// /og/<slug>.png, so we subset an open CJK font (Noto Sans SC, OFL) down to just the glyphs
// used across all post titles + ASCII. Output is a tiny .woff committed to the repo.
//
// Source OTF is not committed; download once before running:
//   curl -sL -o .tmp-fonts/NotoSansSC-Bold.otf \
//     https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Bold.otf
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { glob } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, ".tmp-fonts", "NotoSansSC-Bold.otf");
const OUT = join(ROOT, "public", "fonts", "salesforce", "SalesforceSans-Semibold.woff");
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

if (!existsSync(SRC)) {
  console.error(`Missing source font: ${SRC}\nDownload it first (see header comment).`);
  process.exit(1);
}

const chars = new Set();
// printable ASCII so the host string + any latin titles render
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCodePoint(c));

for await (const f of glob("posts/*.mdx", { cwd: ROOT })) {
  const src = readFileSync(join(ROOT, f), "utf8");
  const m = src.match(FRONTMATTER_RE);
  if (!m) continue;
  const t = m[1].match(/^title:\s*(.*)$/m);
  if (t) for (const ch of t[1].replace(/^['"]|['"]$/g, "")) chars.add(ch);
}

const text = [...chars].join("");
const subset = await subsetFont(readFileSync(SRC), text, { targetFormat: "woff" });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, subset);
console.log(`Wrote ${OUT} (${(subset.length / 1024).toFixed(1)} KB, ${chars.size} glyphs).`);
