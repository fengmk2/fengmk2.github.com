#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "node:fs/promises";

const PAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "pages");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const BARE_FRONTMATTER_HEAD_RE =
  /^([a-zA-Z_][\w-]*:\s*.+(?:\r?\n[a-zA-Z_][\w-]*:\s*.+)*)(\r?\n\r?\n)/;
const H1_RE = /^#\s+(.+?)\s*$/m;

function yamlSingleQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function parseExistingYaml(yaml) {
  const fields = {};
  const order = [];
  for (const line of yaml.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (match) {
      fields[match[1]] = match[2];
      order.push(match[1]);
    }
  }
  return { fields, order };
}

function processFile(path) {
  const source = readFileSync(path, "utf8");

  let yaml = "";
  let rest = source;
  let wrapped = false;
  const fm = source.match(FRONTMATTER_RE);
  if (fm) {
    yaml = fm[1];
    rest = source.slice(fm[0].length);
    wrapped = true;
  } else {
    const bare = source.match(BARE_FRONTMATTER_HEAD_RE);
    if (bare) {
      yaml = bare[1];
      rest = source.slice(bare[0].length);
    }
  }

  const { fields, order } = parseExistingYaml(yaml);
  const existingTitle = fields.title?.trim();

  if (wrapped && existingTitle) return false;

  if (existingTitle) {
    const unquoted = existingTitle.replace(/^['"]|['"]$/g, "");
    fields.title = yamlSingleQuote(unquoted);
  } else {
    const h1 = rest.match(H1_RE);
    if (!h1) return false;
    fields.title = yamlSingleQuote(h1[1].trim());
    if (!order.includes("title")) order.unshift("title");
  }

  const newYaml = order.map((k) => `${k}: ${fields[k]}`).join("\n");
  const trimmed = rest.replace(/^\s*\r?\n/, "");
  const output = `---\n${newYaml}\n---\n\n${trimmed}`;

  if (output === source) return false;
  writeFileSync(path, output);
  return true;
}

let changed = 0;
for await (const entry of glob("**/*.md", { cwd: PAGES_DIR })) {
  const full = join(PAGES_DIR, entry);
  if (processFile(full)) {
    changed++;
    console.log(`titled: ${entry}`);
  }
}
console.log(`\nUpdated ${changed} file(s).`);
