# This is MK2

Hello World!

Personal site and blog at [fengmk2.com](https://fengmk2.com), built with [Vite+](https://viteplus.dev) and [Void](https://void.cloud) (React + MDX via void-blog).

## Development

Work happens on the `dev` branch. `master` is production and only advances through the automated promotion below, so do not commit to it directly.

```bash
vp install
vp dev        # local dev server
vp check      # format, lint, type check
vp run build  # production build
```

Small changes can be pushed to `dev` directly. Larger changes go through a pull request targeting `dev`; CI runs `vp check` and a build on every PR.

## Deployment

Two Void projects are connected to this repo via the Void GitHub App (`void github` subcommands):

| Project           | Branch   | Executor              | URL                              |
| ----------------- | -------- | --------------------- | -------------------------------- |
| `fengmk2-staging` | `dev`    | GitHub Actions (OIDC) | https://fengmk2-staging.void.app |
| `fengmk2`         | `master` | Void container        | https://fengmk2.com              |

Every push to `dev` flows through `.github/workflows/ci.yml`:

1. `test`: `vp check` + build
2. `staging-deploy`: connect to `https://api.void.cloud` with `void connect --no-login`, then run `void deploy --platform void` to `fengmk2-staging`. Auth uses GitHub OIDC (no stored token); the token exchange is bound to this workflow file via `void github update fengmk2-staging --workflow .github/workflows/ci.yml`
3. `promote`: once the staging deploy is live, fast-forward `master` to the same commit (`--ff-only`, so a diverged master fails loudly instead of merging)

The master push then triggers the Void GitHub App, which builds in Void's container and deploys production. Pushes made by the promote job use `GITHUB_TOKEN`, which never triggers other workflows but does reach App webhooks, which is why production stays on the container executor.

Notes:

- Void OIDC only accepts push events as deploy triggers, so PRs cannot deploy previews; staging verification happens after merging to `dev`
- Each deployed page hides a build stamp in the homepage footer: select the page (Cmd+A) to reveal the deployed commit and build time
- Inspect deployments with `void project status fengmk2` or `void project status fengmk2-staging`, runtime logs with `void project logs`
- The CI test job caches vite-task results (`node_modules/.vite/task-cache`) for the `build` and `check` tasks via GitHub Actions cache, so commits that do not touch their inputs replay in under a second; deploys build fresh through `void deploy` and never use this cache

## Vite+ CI duration report

`/vite-plus-ci` charts successful CI attempts for pushes to `main` in [`voidzero-dev/vite-plus`, `ci.yml`](https://github.com/voidzero-dev/vite-plus/actions/workflows/ci.yml). The collector filters by `branch=main`, `event=push`, and `status=success`. The report shows hourly or daily median and P90 durations, individual runs, and CSV export. The default view groups the last seven days by day and selects first attempts; hourly grouping and reruns can be selected separately. Move over the chart or use the arrow keys while it has focus to inspect each period’s time, percentiles, and run count. Grouping uses the first job start time in UTC; empty periods remain gaps. Data collection still runs daily.

Duration is the span from the first executed job starting to the last executed job completing in the same attempt. It includes gaps between jobs, excludes the initial queue and skipped jobs, and does not sum parallel job durations. Percentiles use linear interpolation. Dates are UTC.

`.github/workflows/vite-plus-ci-metrics.yml` runs daily at **01:17 UTC / 09:17 UTC+8** and supports manual runs with `workflow_dispatch`. The workflow becomes active when it reaches the default branch (`dev`). GitHub can delay scheduled runs and disables schedules in public repositories after 60 days without repository activity.

The workflow reads the bundled `public/data/vite-plus-ci.json` on its first run, then maintains `vite-plus-ci.json` on the dedicated `ci-metrics` branch. The report reads that public JSON directly, so daily updates do not need a site deployment. It falls back to the bundled snapshot if the feed is unavailable and warns when the data is over 48 hours old. The workflow uses `GITHUB_TOKEN` with `contents: write` to publish this branch; no additional secret is required for the public source repository.

The collector rescans the last 30 days of run creation dates for late completions and reruns, fetches jobs only for unseen successful attempts, and retains archived observations. After an outage, it extends the scan to cover the missed interval. Runs are keyed by run ID and attempt; previous attempts superseded before collection and reruns of runs created outside the scan window are not backfilled. API failures leave the previous snapshot intact. Initial data covers the available successful attempts from the preceding 30 days.

To refresh the local snapshot, use a GitHub token or an authenticated GitHub CLI session:

```bash
GH_TOKEN="$(gh auth token)" vp run update:ci-metrics
# Optional longer scan; GitHub must still retain the source runs/jobs.
GH_TOKEN="$(gh auth token)" vp run update:ci-metrics --days 90
```

The collector requires Node 24 and uses only built-in modules. GitHub's API permits at most 1,000 results per filtered query; the collector splits date windows and paginates both runs and jobs. Large backfills can exceed the Actions token's hourly API allowance; use a local token and commit the resulting snapshot before enabling the schedule.

Interrupted local backfills retain measured attempts in the ignored `.ci-metrics-cache/` directory. A retry rescans run headers and reuses those measurements; the published JSON changes only after the complete collection succeeds. The local cache is removed after success.
