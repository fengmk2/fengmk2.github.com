import { defineMiddleware } from "void";

export default defineMiddleware(async (c, next) => {
  const url = new URL(c.req.url);
  if (url.pathname.endsWith(".html")) {
    const cleanPath = url.pathname.replace(/\.html$/, "");
    return c.redirect(cleanPath, 301);
  }
  return next();
});
