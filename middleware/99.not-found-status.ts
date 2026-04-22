import { defineMiddleware } from "void";

export default defineMiddleware(async (c, next) => {
  await next();
  if (c.get("notFound") && c.res.status === 200) {
    c.res = new Response(c.res.body, {
      status: 404,
      headers: c.res.headers,
    });
  }
});
