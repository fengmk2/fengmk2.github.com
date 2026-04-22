import { readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PAGES_DIR = join(ROOT, "pages");
const OUT = join(ROOT, "public", "sitemap.xml");
const ORIGIN = "https://fengmk2.com";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith(".md")) yield full;
  }
}

const urls = ["/"];
for await (const file of walk(join(PAGES_DIR, "blog"))) {
  const route = "/" + relative(PAGES_DIR, file).replace(/\.md$/, "");
  urls.push(route);
}

urls.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));

const body = urls
  .map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

await writeFile(OUT, xml);
console.log(`sitemap: wrote ${urls.length} urls to ${relative(ROOT, OUT)}`);
