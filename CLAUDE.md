<!--injected-by-void-v0.2.0-->
## Void

This project uses [Void](https://void.cloud) — a fullstack Vite plugin + deployment platform for Cloudflare. `voidPlugin()` in `vite.config.ts` gives you file-based API routing on Hono (`routes/`), Inertia-inspired server-rendered pages with co-located loaders/actions (`pages/` + `void/vue` or `void/react`), auto-provisioned D1/KV/R2 bindings, end-to-end type safety (SQL migrations -> typed DB -> typed routes -> typed fetch client), built-in auth, queues, cron jobs, edge caching (ISR), and one-command deploys via `npx void deploy`.

Full docs are in `node_modules/void/docs/`. If you have the `void` skill available, use it for a complete API reference covering project structure, routing, pages mode, database, auth, typed fetch, KV, storage, queues, cron jobs, CLI, configuration, and deployment.

<!--/injected-by-void-->
