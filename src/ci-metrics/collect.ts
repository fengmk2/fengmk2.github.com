import type { Dataset, Run } from "./data.ts";

const apiRoot = "https://api.github.com/repos/voidzero-dev/vite-plus/actions";
const dayMs = 86_400_000;

export interface WorkflowRun {
  id: number;
  run_number: number;
  run_attempt: number;
  run_started_at: string;
  display_title: string;
  head_branch: string | null;
  head_sha: string;
  event: string;
  status: string;
  conclusion: string | null;
}

export interface Job {
  run_attempt: number;
  status: string;
  conclusion: string | null;
  started_at: string | null;
  completed_at: string | null;
}

type RunsResponse = { total_count: number; workflow_runs: WorkflowRun[] };
type JobsResponse = { total_count: number; jobs: Job[] };
export type GetJson = <T>(url: string) => Promise<T>;

export function githubClient(token: string): GetJson {
  return async <T>(url: string): Promise<T> => {
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetch(url, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2026-03-10",
            "User-Agent": "fengmk2-ci-metrics",
          },
          signal: AbortSignal.timeout(30_000),
        });
      } catch (error) {
        if (attempt >= 3) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
        continue;
      }
      if (response.ok) return (await response.json()) as T;
      if (attempt >= 3 || ![429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`GitHub API ${response.status} for ${url}`);
      }
      const seconds = Number(response.headers.get("retry-after") ?? 2 ** attempt);
      await new Promise((resolve) => setTimeout(resolve, Math.min(seconds, 60) * 1000));
    }
  };
}

export async function listRuns(get: GetJson, start: number, end: number): Promise<WorkflowRun[]> {
  const params = new URLSearchParams({
    status: "success",
    branch: "main",
    event: "push",
    created: `${new Date(start).toISOString()}..${new Date(end).toISOString()}`,
    per_page: "100",
  });
  const url = `${apiRoot}/workflows/ci.yml/runs?${params}`;
  const first = await get<RunsResponse>(url);
  // Filtered workflow queries stop at 1,000 results, even when pagination continues.
  if (first.total_count > 1000) {
    const middle = Math.floor((start + end) / 2000) * 1000;
    if (middle <= start) throw new Error("Too many workflow runs in a single second");
    return [...(await listRuns(get, start, middle)), ...(await listRuns(get, middle + 1000, end))];
  }
  const runs = [...first.workflow_runs];
  for (let page = 2; page <= Math.ceil(first.total_count / 100); page++) {
    const next = await get<RunsResponse>(`${url}&page=${page}`);
    runs.push(...next.workflow_runs);
  }
  return runs;
}

export function measureRun(run: WorkflowRun, jobs: Job[]): Run | null {
  if (run.status !== "completed" || run.conclusion !== "success") return null;
  const attemptStart = Date.parse(run.run_started_at);
  if (!Number.isFinite(attemptStart)) throw new Error(`Missing attempt start for run ${run.id}`);
  // GitHub can relabel carried-forward jobs with the new run_attempt. Their
  // timestamps still precede this attempt, so do not count them as rerun work.
  const executed = jobs.filter(
    (job) =>
      job.run_attempt === run.run_attempt &&
      job.conclusion !== "skipped" &&
      (run.run_attempt === 1 || !job.started_at || Date.parse(job.started_at) >= attemptStart),
  );
  if (!executed.length) return null;
  const starts = executed.map((job) => Date.parse(job.started_at ?? ""));
  const ends = executed.map((job) => Date.parse(job.completed_at ?? ""));
  if (
    executed.some(
      (job, index) =>
        // Some archived jobs have a stale status despite a final conclusion
        // and completed_at. The successful workflow and final timestamps win.
        job.conclusion === null ||
        !Number.isFinite(starts[index]) ||
        !Number.isFinite(ends[index]) ||
        ends[index] < starts[index],
    )
  ) {
    throw new Error(`Incomplete job timestamps for run ${run.id}, attempt ${run.run_attempt}`);
  }
  const start = Math.min(...starts);
  const end = Math.max(...ends);
  return {
    id: run.id,
    number: run.run_number,
    attempt: run.run_attempt,
    title: run.display_title,
    branch: run.head_branch ?? "",
    event: run.event,
    sha: run.head_sha,
    startedAt: new Date(start).toISOString(),
    completedAt: new Date(end).toISOString(),
    durationSeconds: (end - start) / 1000,
    jobCount: executed.length,
  };
}

export async function collect(
  get: GetJson,
  previous: Dataset | null,
  now = new Date(),
  lookbackDays = 30,
  log: (message: string) => void = () => {},
  cache?: { runs: Run[]; save: (run: Run) => Promise<void> },
): Promise<Dataset> {
  if (!Number.isInteger(lookbackDays) || lookbackDays < 1 || lookbackDays > 365) {
    throw new Error("lookbackDays must be an integer between 1 and 365");
  }
  // Rescan recent history for delayed completions and reruns. After downtime,
  // extend the window to cover the gap instead of silently losing those days.
  const start =
    Math.floor(
      Math.min(
        now.getTime() - lookbackDays * dayMs,
        previous ? Date.parse(previous.updatedAt) - dayMs : Infinity,
      ) / dayMs,
    ) * dayMs;
  const end = Math.floor(now.getTime() / 1000) * 1000;
  const discovered = new Map<number, WorkflowRun>();
  for (const run of await listRuns(get, start, end)) {
    if (run.head_branch === "main" && run.event === "push" && run.conclusion === "success") {
      discovered.set(run.id, run);
    }
  }
  const key = (id: number, attempt: number) => `${id}:${attempt}`;
  const records = new Map(
    previous?.runs
      .filter((run) => run.branch === "main" && run.event === "push")
      .map((run) => [key(run.id, run.attempt), run]),
  );
  for (const run of cache?.runs ?? []) {
    if (
      run.branch === "main" &&
      run.event === "push" &&
      discovered.get(run.id)?.run_attempt === run.attempt
    ) {
      records.set(key(run.id, run.attempt), run);
    }
  }
  const pending = [...discovered.values()].filter(
    (run) => !records.has(key(run.id, run.run_attempt)),
  );
  log(
    `Found ${discovered.size} successful runs; fetching jobs for ${pending.length} new attempts.`,
  );
  let cursor = 0;
  let completed = 0;
  // Keep API concurrency low during the initial backfill.
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (cursor < pending.length) {
        const run = pending[cursor++];
        const jobs: Job[] = [];
        for (let page = 1; ; page++) {
          const response = await get<JobsResponse>(
            `${apiRoot}/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100&page=${page}`,
          );
          jobs.push(...response.jobs);
          if (jobs.length >= response.total_count) break;
          if (!response.jobs.length) throw new Error(`Incomplete jobs response for run ${run.id}`);
        }
        const record = measureRun(run, jobs);
        if (record) {
          await cache?.save(record);
          records.set(key(record.id, record.attempt), record);
        }
        completed++;
        if (completed % 50 === 0) log(`Collected ${completed}/${pending.length} attempts.`);
      }
    }),
  );
  return {
    version: 1,
    repository: "voidzero-dev/vite-plus",
    workflow: "ci.yml",
    coverageStart: new Date(
      Math.min(start, previous ? Date.parse(previous.coverageStart) : Infinity),
    ).toISOString(),
    updatedAt: now.toISOString(),
    runs: [...records.values()].sort(
      (a, b) => a.startedAt.localeCompare(b.startedAt) || a.id - b.id || a.attempt - b.attempt,
    ),
  };
}
