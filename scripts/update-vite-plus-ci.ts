import { appendFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { collect, githubClient } from "../src/ci-metrics/collect.ts";
import { parseDataset } from "../src/ci-metrics/data.ts";

const { values } = parseArgs({
  options: {
    output: { type: "string", default: "public/data/vite-plus-ci.json" },
    days: { type: "string", default: "30" },
    cache: { type: "string", default: ".ci-metrics-cache/attempts.jsonl" },
  },
});
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("Set GH_TOKEN or GITHUB_TOKEN to read the GitHub Actions API.");
const output = resolve(values.output);
const previous = await readFile(output, "utf8").then(
  (value) => parseDataset(JSON.parse(value)),
  (error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  },
);
const cachePath = resolve(values.cache);
await mkdir(dirname(cachePath), { recursive: true });
const cachedText = await readFile(cachePath, "utf8").catch((error: NodeJS.ErrnoException) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
const cached = parseDataset({
  version: 1,
  repository: "voidzero-dev/vite-plus",
  workflow: "ci.yml",
  coverageStart: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  runs: cachedText
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line)),
}).runs;
const dataset = await collect(
  githubClient(token),
  previous,
  new Date(),
  Number(values.days),
  console.log,
  { runs: cached, save: (run) => appendFile(cachePath, `${JSON.stringify(run)}\n`) },
);
await mkdir(dirname(output), { recursive: true });
// Failed API requests must leave the last complete snapshot intact.
await writeFile(`${output}.tmp`, `${JSON.stringify(dataset)}\n`);
await rename(`${output}.tmp`, output);
await rm(cachePath, { force: true });
console.log(`Saved ${dataset.runs.length} successful attempts to ${output}`);
