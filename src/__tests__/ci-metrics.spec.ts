import { describe, expect, it } from "vite-plus/test";
import { collect, listRuns, measureRun } from "../ci-metrics/collect.ts";
import type { GetJson, Job, WorkflowRun } from "../ci-metrics/collect.ts";
import { timeStats, parseDataset, percentile, runsCsv } from "../ci-metrics/data.ts";
import type { Dataset, Run } from "../ci-metrics/data.ts";

const workflow: WorkflowRun = {
  id: 123,
  run_number: 42,
  run_attempt: 1,
  run_started_at: "2026-10-18T01:00:00Z",
  display_title: "A change",
  head_branch: "main",
  head_sha: "abc123",
  event: "push",
  status: "completed",
  conclusion: "success",
};
const job: Job = {
  run_attempt: 1,
  status: "completed",
  conclusion: "success",
  started_at: "2026-10-18T01:00:00Z",
  completed_at: "2026-10-18T01:10:00Z",
};
const record = measureRun(workflow, [job]) as Run;
const previous: Dataset = {
  version: 1,
  repository: "voidzero-dev/vite-plus",
  workflow: "ci.yml",
  coverageStart: "2026-10-01T00:00:00Z",
  updatedAt: "2026-10-18T02:00:00Z",
  runs: [record],
};
const now = new Date("2026-10-19T02:00:00Z");
function client(respond: (url: string) => unknown): GetJson {
  return async <T>(url: string): Promise<T> => respond(url) as T;
}

describe("CI wall-clock duration", () => {
  it("measures the span of parallel jobs, including gaps but not skipped jobs", () => {
    const result = measureRun(workflow, [
      job,
      { ...job, started_at: "2026-10-18T01:05:00Z", completed_at: "2026-10-18T01:12:00Z" },
      { ...job, started_at: "2026-10-18T01:14:00Z", completed_at: "2026-10-18T01:15:00Z" },
      { ...job, conclusion: "skipped", started_at: "2026-10-18T00:00:00Z", completed_at: null },
    ]);
    expect(result?.durationSeconds).toBe(900);
    expect(result?.jobCount).toBe(3);
  });

  it("isolates rerun attempts instead of counting time since the original run", () => {
    const result = measureRun({ ...workflow, run_attempt: 2 }, [
      job,
      {
        ...job,
        run_attempt: 2,
        started_at: "2026-10-19T04:00:00Z",
        completed_at: "2026-10-19T04:02:00Z",
      },
    ]);
    expect(result?.durationSeconds).toBe(120);
    expect(result?.attempt).toBe(2);
  });

  it("excludes failed runs and successful runs with no executed jobs", () => {
    expect(measureRun({ ...workflow, conclusion: "failure" }, [job])).toBeNull();
    expect(measureRun(workflow, [{ ...job, conclusion: "skipped" }])).toBeNull();
  });

  it("ignores carried-forward jobs relabeled with the new attempt and accepts stale job statuses", () => {
    const result = measureRun(
      { ...workflow, run_attempt: 2, run_started_at: "2026-10-19T04:00:00Z" },
      [
        { ...job, run_attempt: 2 },
        {
          ...job,
          run_attempt: 2,
          status: "in_progress",
          started_at: "2026-10-19T04:00:05Z",
          completed_at: "2026-10-19T04:02:05Z",
        },
      ],
    );
    expect(result?.durationSeconds).toBe(120);
    expect(result?.jobCount).toBe(1);
  });

  it("fails on incomplete or reversed timestamps instead of publishing a false duration", () => {
    expect(() => measureRun(workflow, [{ ...job, completed_at: null }])).toThrow("Incomplete");
    expect(() => measureRun(workflow, [{ ...job, started_at: "2026-10-18T02:00:00Z" }])).toThrow(
      "Incomplete",
    );
  });
});

describe("GitHub history collection", () => {
  it("splits a query above GitHub's 1,000-result cap and paginates each part", async () => {
    const start = Date.parse("2026-10-18T00:00:00Z");
    const end = Date.parse("2026-10-18T23:59:59Z");
    const requests: URL[] = [];
    const get = client((url) => {
      const parsed = new URL(url);
      requests.push(parsed);
      if (requests.length === 1) return { total_count: 1001, workflow_runs: [] };
      if (requests.length === 2)
        return {
          total_count: 101,
          workflow_runs: Array.from({ length: 100 }, (_, id) => ({ ...workflow, id })),
        };
      if (parsed.searchParams.get("page") === "2")
        return { total_count: 101, workflow_runs: [{ ...workflow, id: 100 }] };
      return { total_count: 1, workflow_runs: [{ ...workflow, id: 101 }] };
    });
    const runs = await listRuns(get, start, end);
    expect(requests[0].searchParams.get("branch")).toBe("main");
    expect(requests[0].searchParams.get("event")).toBe("push");
    expect(requests[0].searchParams.get("status")).toBe("success");
    expect(runs).toHaveLength(102);
    const firstWindow = requests[1].searchParams.get("created")!.split("..");
    const secondWindow = requests[3].searchParams.get("created")!.split("..");
    expect(Date.parse(secondWindow[0]) - Date.parse(firstWindow[1])).toBe(1000);
    expect(Date.parse(firstWindow[0])).toBe(start);
    expect(Date.parse(secondWindow[1])).toBe(end);
  });

  it("reuses archived attempts and preserves history beyond the rescan window", async () => {
    const urls: string[] = [];
    const result = await collect(
      client((url) => {
        urls.push(url);
        return { total_count: 1, workflow_runs: [workflow] };
      }),
      previous,
      now,
      1,
    );
    expect(urls.every((url) => url.includes("/workflows/ci.yml/runs?"))).toBe(true);
    expect(result.runs).toEqual([record]);
    expect(Date.parse(result.coverageStart)).toBe(Date.parse(previous.coverageStart));
    expect(result.updatedAt).toBe(now.toISOString());
  });

  it("keeps a newly successful rerun as a separate observation and paginates jobs", async () => {
    const result = await collect(
      client((url) => {
        if (url.includes("/workflows/"))
          return { total_count: 1, workflow_runs: [{ ...workflow, run_attempt: 2 }] };
        const jobs = Array.from({ length: url.endsWith("page=1") ? 100 : 1 }, () => ({
          ...job,
          run_attempt: 2,
        }));
        return { total_count: 101, jobs };
      }),
      previous,
      now,
      1,
    );
    expect(result.runs.map((run) => run.attempt)).toEqual([1, 2]);
    expect(result.runs[1].jobCount).toBe(101);
    expect(previous.runs).toHaveLength(1);
  });

  it("extends the scan after downtime and does not erase history on an empty day", async () => {
    const old = { ...previous, updatedAt: "2026-10-05T02:00:00Z" };
    const urls: string[] = [];
    const result = await collect(
      client((url) => {
        urls.push(url);
        return { total_count: 0, workflow_runs: [] };
      }),
      old,
      now,
      1,
    );
    expect(new URL(urls[0]).searchParams.get("created")).toMatch(/^2026-10-04T00:00:00/);
    expect(result.runs).toEqual([record]);
  });

  it("rejects API errors without mutating the last complete dataset", async () => {
    const before = JSON.stringify(previous);
    await expect(
      collect(
        client(() => {
          throw new Error("API unavailable");
        }),
        previous,
        now,
        1,
      ),
    ).rejects.toThrow("API unavailable");
    expect(JSON.stringify(previous)).toBe(before);
  });

  it("resumes measured attempts only when the current scan still observes that attempt", async () => {
    const saved: Run[] = [];
    const get = client((url) => {
      if (url.includes("/workflows/")) return { total_count: 1, workflow_runs: [workflow] };
      throw new Error("Cached attempts should not fetch jobs again");
    });
    const result = await collect(get, null, now, 1, () => {}, {
      runs: [record, { ...record, id: 999 }],
      save: async (run) => {
        saved.push(run);
      },
    });
    expect(result.runs).toEqual([record]);
    expect(saved).toEqual([]);
  });

  it("keeps only successful main pushes, including when migrating an older archive", async () => {
    const mixed = {
      ...previous,
      runs: [record, { ...record, id: 456, branch: "feature", event: "pull_request" }],
    };
    const result = await collect(
      client(() => ({
        total_count: 3,
        workflow_runs: [
          workflow,
          { ...workflow, id: 456, head_branch: "feature", event: "pull_request" },
          { ...workflow, id: 789, conclusion: "failure" },
        ],
      })),
      mixed,
      now,
      1,
    );
    expect(result.runs).toEqual([record]);
  });
});

describe("report statistics and exports", () => {
  it("distinguishes empty days from partially collected and uncollected days", () => {
    const days = timeStats([], "2026-10-20", "2026-10-22T08:00:00Z", "day", "2026-10-21T01:36:00Z");
    expect(days.map((day) => day.status)).toEqual(["collected", "partial", "pending"]);
    expect(days.map((day) => day.median)).toEqual([null, null, null]);
    const hours = timeStats(
      [],
      "2026-10-21T00:00:00Z",
      "2026-10-21T02:00:00Z",
      "hour",
      "2026-10-21T01:00:00Z",
    );
    expect(hours.map((hour) => hour.status)).toEqual(["collected", "pending", "pending"]);
  });

  it("groups runs into UTC hours across midnight without filling empty hours with zeroes", () => {
    const buckets = timeStats(
      [
        { ...record, startedAt: "2026-10-18T23:00:00Z", durationSeconds: 600 },
        { ...record, startedAt: "2026-10-18T23:59:59.999Z", durationSeconds: 1200 },
        { ...record, startedAt: "2026-10-19T08:30:00+08:00", durationSeconds: 300 },
        { ...record, startedAt: "2026-10-19T02:00:00Z", durationSeconds: 0 },
        { ...record, startedAt: "2026-10-19T03:00:00Z", durationSeconds: 999 },
      ],
      "2026-10-18T23:00:00Z",
      "2026-10-19T02:17:00Z",
      "hour",
    );
    expect(buckets.map((bucket) => bucket.startedAt)).toEqual([
      "2026-10-18T23:00:00.000Z",
      "2026-10-19T00:00:00.000Z",
      "2026-10-19T01:00:00.000Z",
      "2026-10-19T02:00:00.000Z",
    ]);
    expect(buckets.map((bucket) => bucket.count)).toEqual([2, 1, 0, 1]);
    expect(buckets.map((bucket) => bucket.median)).toEqual([900, 300, null, 0]);
    expect(buckets[0].p90).toBe(1140);
  });

  it("calculates interpolated percentiles and leaves missing days empty", () => {
    expect(percentile([40, 10, 30, 20], 0.5)).toBe(25);
    expect(percentile([40, 10, 30, 20], 0.9)).toBe(37);
    expect(percentile([], 0.9)).toBeNull();
    expect(percentile([12], 0.9)).toBe(12);
    const days = timeStats([record], "2026-10-17", "2026-10-19", "day");
    expect(days.map((day) => day.median)).toEqual([null, 600, null]);
    expect(days.map((day) => day.count)).toEqual([0, 1, 0]);
  });

  it("rejects invalid downloaded snapshots", () => {
    expect(parseDataset(previous)).toEqual(previous);
    expect(() =>
      parseDataset({ ...previous, runs: [{ ...record, durationSeconds: -1 }] }),
    ).toThrow();
    expect(() => parseDataset({ ...previous, version: 2 })).toThrow();
    expect(() => parseDataset(null)).toThrow();
  });

  it("escapes CSV quotes, newlines, and spreadsheet formulas in upstream titles", () => {
    const csv = runsCsv([{ ...record, title: '=HYPERLINK("test")\nchange', branch: "@untrusted" }]);
    expect(csv).toContain('"\'=HYPERLINK(""test"")\nchange"');
    expect(csv).toContain('"\'@untrusted"');
    expect(csv).toContain("/actions/runs/123/attempts/1");
  });
});
