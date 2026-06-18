import { createBlogHeadMiddleware } from "void-blog/server";

// No `style` option: the void-blog theme is loaded per-route (pages/posts/layout.tsx),
// so it is not injected globally in dev and never reaches the custom home page.
export default createBlogHeadMiddleware();
