/// <reference types="vite/client" />

// Build-time constants injected by `define` in vite.config.ts.
declare const __BUILD_COMMIT__: string;
declare const __BUILD_TIME__: string;

declare module "*.mdx" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
  export const tableOfContents: unknown;
}
