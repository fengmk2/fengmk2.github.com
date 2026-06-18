import { defineMiddleware } from "void";
import { redirects } from "../src/redirects.generated.ts";

// 301 old nested /blog/YYYY/.../slug URLs to the new flat /posts/<slug> URLs.
export default defineMiddleware(async (c, next) => {
  const target = redirects[c.req.path];
  if (target) {
    return c.redirect(target, 301);
  }
  await next();
});
