import "../../src/styles.css";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BlogErrorRoute } from "void-blog/react";
import blogConfig from "../../blog.config.ts";

// Scopes the void-blog theme + error boundary to /posts/* only (not the custom home).
function ErrorRoute() {
  return <BlogErrorRoute config={blogConfig} />;
}

export default function PostsLayout({ children }: { children: ReactNode }) {
  return <ErrorBoundary FallbackComponent={ErrorRoute}>{children}</ErrorBoundary>;
}
