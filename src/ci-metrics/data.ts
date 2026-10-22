export const workflowUrl = "https://github.com/voidzero-dev/vite-plus/actions/workflows/ci.yml";
export const dataUrl =
  "https://raw.githubusercontent.com/fengmk2/fengmk2.com/ci-metrics/vite-plus-ci.json";

export interface Run {
  id: number;
  number: number;
  attempt: number;
  title: string;
  branch: string;
  event: string;
  sha: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  jobCount: number;
}

export interface Dataset {
  version: 1;
  repository: "voidzero-dev/vite-plus";
  workflow: "ci.yml";
  coverageStart: string;
  updatedAt: string;
  runs: Run[];
}

export function parseDataset(value: unknown): Dataset {
  const data = value as Dataset;
  if (
    !data ||
    data.version !== 1 ||
    data.repository !== "voidzero-dev/vite-plus" ||
    data.workflow !== "ci.yml" ||
    typeof data.coverageStart !== "string" ||
    typeof data.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(data.coverageStart)) ||
    !Number.isFinite(Date.parse(data.updatedAt)) ||
    !Array.isArray(data.runs) ||
    !data.runs.every(
      (run) =>
        run &&
        Number.isSafeInteger(run.id) &&
        run.id > 0 &&
        Number.isSafeInteger(run.number) &&
        Number.isSafeInteger(run.attempt) &&
        run.attempt > 0 &&
        typeof run.title === "string" &&
        typeof run.branch === "string" &&
        typeof run.event === "string" &&
        typeof run.sha === "string" &&
        typeof run.startedAt === "string" &&
        typeof run.completedAt === "string" &&
        Number.isFinite(Date.parse(run.startedAt)) &&
        Number.isFinite(Date.parse(run.completedAt)) &&
        Number.isFinite(run.durationSeconds) &&
        run.durationSeconds >= 0 &&
        Number.isSafeInteger(run.jobCount) &&
        run.jobCount > 0,
    )
  ) {
    throw new Error("Invalid CI metrics dataset");
  }
  return data;
}

export function percentile(values: number[], fraction: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export type Granularity = "hour" | "day";

export interface TimeBucket {
  startedAt: string;
  status: "collected" | "partial" | "pending";
  count: number;
  median: number | null;
  p90: number | null;
}

export function bucketLabel(startedAt: string, granularity: Granularity): string {
  return startedAt.slice(0, granularity === "hour" ? 16 : 10).replace("T", " ");
}

export function timeStats(
  runs: Run[],
  start: string,
  end: string,
  granularity: Granularity,
  collectedAt = end,
): TimeBucket[] {
  const interval = granularity === "hour" ? 3_600_000 : 86_400_000;
  const bucketStart = (timestamp: string) =>
    Math.floor(Date.parse(timestamp) / interval) * interval;
  const groups = new Map<number, number[]>();
  for (const run of runs) {
    const time = bucketStart(run.startedAt);
    const values = groups.get(time) ?? [];
    values.push(run.durationSeconds);
    groups.set(time, values);
  }
  const buckets: TimeBucket[] = [];
  for (let time = bucketStart(start); time <= bucketStart(end); time += interval) {
    const values = groups.get(time) ?? [];
    buckets.push({
      startedAt: new Date(time).toISOString(),
      status:
        time >= Date.parse(collectedAt)
          ? "pending"
          : time + interval > Date.parse(collectedAt)
            ? "partial"
            : "collected",
      count: values.length,
      median: percentile(values, 0.5),
      p90: percentile(values, 0.9),
    });
  }
  return buckets;
}

export function duration(seconds: number | null): string {
  if (seconds === null) return "—";
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}m ${String(rounded % 60).padStart(2, "0")}s`;
}

export function runUrl(run: Run): string {
  return `https://github.com/voidzero-dev/vite-plus/actions/runs/${run.id}/attempts/${run.attempt}`;
}

export function runsCsv(runs: Run[]): string {
  const cell = (value: string | number) => {
    // Spreadsheet applications can interpret untrusted branch names/titles as formulas.
    const text = String(value).replace(/^[=+@\-\t\r]/, "'$&");
    return `"${text.replaceAll('"', '""')}"`;
  };
  return [
    ["run", "attempt", "started_at_utc", "duration_seconds", "event", "branch", "title", "url"],
    ...runs.map((run) => [
      run.number,
      run.attempt,
      run.startedAt,
      run.durationSeconds,
      run.event,
      run.branch,
      run.title,
      runUrl(run),
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}
