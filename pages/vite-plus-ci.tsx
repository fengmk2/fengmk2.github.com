import { useEffect, useState } from "react";
import {
  bucketLabel,
  timeStats,
  dataUrl,
  duration,
  parseDataset,
  percentile,
  runsCsv,
  runUrl,
  workflowUrl,
} from "../src/ci-metrics/data.ts";
import type { Dataset, Granularity } from "../src/ci-metrics/data.ts";
import TrendChart from "../src/ci-metrics/TrendChart.tsx";
import "../src/ci-metrics/report.css";

export default function CiReport() {
  const [data, setData] = useState<Dataset | null>(null);
  const [source, setSource] = useState<"live" | "snapshot" | "loading">("loading");
  const [error, setError] = useState(false);
  const [range, setRange] = useState("7");
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [reruns, setReruns] = useState(false);
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    const controller = new AbortController();
    const load = async (url: string) => {
      const response = await fetch(url, {
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return parseDataset(await response.json());
    };
    void (async () => {
      try {
        setData(await load(dataUrl));
        setSource("live");
      } catch {
        if (controller.signal.aborted) return;
        try {
          setData(await load("/data/vite-plus-ci.json"));
          setSource("snapshot");
        } catch {
          if (!controller.signal.aborted) setError(true);
        }
      }
    })();
    return () => controller.abort();
  }, []);

  const currentTime = new Date().toISOString();
  const today = currentTime.slice(0, 10);
  const from =
    range === "all"
      ? (data?.coverageStart.slice(0, 10) ?? today)
      : new Date(Date.parse(today) - (Number(range) - 1) * 86_400_000).toISOString().slice(0, 10);
  const runs = (data?.runs ?? []).filter(
    (run) =>
      run.startedAt.slice(0, 10) >= from &&
      run.startedAt.slice(0, 10) <= today &&
      (reruns || run.attempt === 1) &&
      run.branch === "main" &&
      run.event === "push",
  );
  const buckets = timeStats(runs, from, currentTime, granularity);
  const periodTitle = granularity === "hour" ? "Hourly" : "Daily";
  const values = runs.map((run) => run.durationSeconds);
  const recent = [...runs].reverse();
  const stale = data && Date.now() - Date.parse(data.updatedAt) > 48 * 3_600_000;
  const csv = () => {
    const url = URL.createObjectURL(
      new Blob([runsCsv(recent)], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `vite-plus-ci-main-${from}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="ci-report">
      <nav className="ci-nav">
        <a href="/">
          fengmk2<span> / observatory</span>
        </a>
        <a href={workflowUrl}>View workflow ↗</a>
      </nav>
      <header className="ci-header">
        <div className="ci-eyebrow">
          <span className="ci-status-dot" /> GITHUB ACTIONS · MAIN · SUCCESSFUL RUNS
        </div>
        <h1>
          Vite+ CI <span>duration trends</span>
        </h1>
        <p>
          Track successful CI runs on <code>main</code>, by hour or day.
        </p>
        <div className="ci-update" aria-live="polite">
          {data ? (
            <>
              Updated {new Date(data.updatedAt).toISOString().replace("T", " ").slice(0, 16)} UTC ·
              Daily at 09:17 UTC+8
            </>
          ) : error ? (
            "Data could not be loaded."
          ) : (
            "Loading CI history…"
          )}
        </div>
      </header>

      {source === "snapshot" && (
        <p className="ci-notice" role="status">
          The daily feed is unavailable. Showing the bundled snapshot from{" "}
          {data?.updatedAt.slice(0, 10)}.
        </p>
      )}
      {stale && (
        <p className="ci-notice" role="status">
          The last update is more than 48 hours old.{" "}
          <a href="https://github.com/fengmk2/fengmk2.com/actions/workflows/vite-plus-ci-metrics.yml">
            Check the data update workflow ↗
          </a>
        </p>
      )}
      {error && (
        <p className="ci-notice" role="alert">
          Unable to load the daily feed or the bundled snapshot. Reload the page to try again.
        </p>
      )}

      <section className="ci-controls" aria-label="Report filters">
        <label>
          Time range
          <select
            value={range}
            onChange={(event) => {
              setRange(event.target.value);
              setLimit(25);
            }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All history</option>
          </select>
        </label>
        <label>
          Group by
          <select
            value={granularity}
            onChange={(event) => setGranularity(event.target.value as Granularity)}
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
          </select>
        </label>
        <label className="ci-checkbox">
          <input
            type="checkbox"
            checked={reruns}
            onChange={(event) => {
              setReruns(event.target.checked);
              setLimit(25);
            }}
          />
          Include rerun attempts
        </label>
        <button className="ci-export" onClick={csv} disabled={!runs.length}>
          Export CSV ↓
        </button>
      </section>

      <section className="ci-stats" aria-label="Selected period statistics">
        <div>
          <span>Successful attempts</span>
          <strong>{data ? runs.length.toLocaleString("en-US") : "—"}</strong>
          <small>Successful pushes to main</small>
        </div>
        <div>
          <span>Median duration</span>
          <strong>{duration(percentile(values, 0.5))}</strong>
          <small>The middle of the selected runs</small>
        </div>
        <div>
          <span>P90 duration</span>
          <strong>{duration(percentile(values, 0.9))}</strong>
          <small>90th percentile of elapsed time</small>
        </div>
        <div>
          <span>Slowest attempt</span>
          <strong>{duration(values.length ? Math.max(...values) : null)}</strong>
          <small>Maximum in this selection</small>
        </div>
      </section>

      <section className="ci-panel">
        <div className="ci-panel-heading">
          <div>
            <h2>{periodTitle} duration</h2>
            <p>
              Elapsed minutes · UTC {granularity === "hour" ? "hours" : "dates"} · lower is faster
            </p>
          </div>
          <div className="ci-legend">
            <span>Median</span>
            <span>P90</span>
          </div>
        </div>
        {runs.length ? (
          <TrendChart
            key={`${range}:${granularity}:${reruns}`}
            buckets={buckets}
            granularity={granularity}
          />
        ) : (
          <div className="ci-empty">
            {data
              ? "No successful attempts match these filters."
              : error
                ? "CI data is unavailable."
                : "Loading the trend…"}
          </div>
        )}
        <div className="ci-chart-note">
          Move over the plot to see values, or focus it and use the arrow keys. Empty{" "}
          {granularity === "hour" ? "hours" : "days"} are gaps, not zeroes. The current{" "}
          {granularity} may be incomplete.
        </div>
        <details className="ci-values">
          <summary>View {granularity === "hour" ? "hourly" : "daily"} values</summary>
          <div className="ci-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{granularity === "hour" ? "Hour" : "Date"} (UTC)</th>
                  <th>Attempts</th>
                  <th>Median</th>
                  <th>P90</th>
                </tr>
              </thead>
              <tbody>
                {[...buckets].reverse().map((bucket) => (
                  <tr key={bucket.startedAt}>
                    <td>{bucketLabel(bucket.startedAt, granularity)}</td>
                    <td>{bucket.count}</td>
                    <td>{duration(bucket.median)}</td>
                    <td>{duration(bucket.p90)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="ci-panel ci-runs">
        <div className="ci-panel-heading">
          <div>
            <h2>Recent successful attempts</h2>
            <p>Open a run to inspect its jobs on GitHub.</p>
          </div>
          <span className="ci-count">{runs.length} attempts</span>
        </div>
        <div className="ci-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Run / change</th>
                <th>Started (UTC)</th>
                <th>Branch / event</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, limit).map((run) => (
                <tr key={`${run.id}:${run.attempt}`}>
                  <td>
                    <a className="ci-run-title" href={runUrl(run)}>
                      {run.title || `Run #${run.number}`}
                    </a>
                    <small>
                      #{run.number} · attempt {run.attempt} · {run.jobCount} jobs ·{" "}
                      {run.sha.slice(0, 7)}
                    </small>
                  </td>
                  <td className="ci-nowrap">{run.startedAt.replace("T", " ").slice(0, 16)}</td>
                  <td>
                    <span className="ci-branch" title={run.branch}>
                      {run.branch}
                    </span>
                    <small>{run.event}</small>
                  </td>
                  <td className="ci-duration">{duration(run.durationSeconds)}</td>
                </tr>
              ))}
              {!runs.length && (
                <tr>
                  <td colSpan={4}>No attempts to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {recent.length > limit && (
          <button className="ci-more" onClick={() => setLimit(limit + 50)}>
            Show 50 more
          </button>
        )}
      </section>

      <footer className="ci-method">
        <h2>How to read this report</h2>
        <p>
          Duration is wall-clock time from the first executed job starting to the last executed job
          completing within the same successful attempt. It includes gaps between jobs, excludes the
          initial queue, and does not add parallel job times together. Skipped jobs are excluded.
        </p>
        <p>
          Only successful pushes to <code>main</code> are collected. The default view compares first
          attempts. Reruns may repeat only a subset of jobs, so include them with care. Median and
          P90 use linear interpolation; periods with few runs are less representative. Each point
          groups attempts by their first job's start time in UTC.
        </p>
        <p>
          Each daily collection rescans runs created in the last 30 days and keeps previously saved
          observations. Older reruns outside that window and successful attempts superseded before
          collection are not backfilled.{" "}
          {data && <>Collection coverage starts {data.coverageStart.slice(0, 10)}. </>}Scheduled
          updates can be delayed by GitHub.
        </p>
        <p>
          <a href={workflowUrl}>Source workflow ↗</a>
          <a href={source === "snapshot" ? "/data/vite-plus-ci.json" : dataUrl}>
            Download source JSON ↓
          </a>
        </p>
      </footer>
    </main>
  );
}
