import type { ReactNode } from "react";

// Root layout is a pass-through: the home page styles itself, and the void-blog
// theme is scoped to /posts via pages/posts/layout.tsx so it never bleeds onto the home.
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
