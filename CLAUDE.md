<!--injected-by-void-v0.2.1-->
## Void

This project uses [Void](https://void.cloud) — a fullstack Vite plugin + deployment platform for Cloudflare. `voidPlugin()` in `vite.config.ts` gives you file-based API routing on Hono (`routes/`), Inertia-inspired server-rendered pages with co-located loaders/actions (`pages/` + `@void/vue` or `@void/react`), auto-provisioned D1/KV/R2 bindings, first-class Drizzle ORM integration (schema in `db/schema.ts` -> `void/db` Drizzle instance -> typed routes -> typed fetch client), built-in auth, queues, cron jobs, edge caching (ISR), and one-command deploys via `npx void deploy`. For first-time setup, prefer `npx void init`; the interactive flow can scaffold the app, configure project files, handle auth, and link or create the deploy project before the first deploy. During the private beta, installation may use GitHub Packages aliases such as `void@npm:@void-sdk/void`, but source imports stay on `void` and `@void/*`. The checked-in project `.npmrc` should only contain `@void-sdk:registry=https://npm.pkg.github.com`; installation auth belongs in the user's `~/.npmrc` via `//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT` using a classic GitHub PAT with `read:packages`.

Database: define Drizzle tables in `db/schema.ts`, import `db` from `void/db` and tables from `@schema`. Use `void db push` for prototyping, `void db generate` for production migrations. `drizzle-orm` and `drizzle-kit` ship with void (no extra install). Migrations live in `db/migrations/`.

Full docs are in `node_modules/void/docs/`. If you have the `void` skill available, use it for a complete API reference covering project structure, routing, pages mode, database, auth, typed fetch, KV, storage, queues, cron jobs, CLI, configuration, and deployment.

<!--/injected-by-void-->
