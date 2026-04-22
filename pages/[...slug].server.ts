import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";

declare module "void" {
  interface CloudContextVariables {
    notFound?: boolean;
  }
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  c.set("notFound", true);
  const ip =
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    "unknown";
  const ua = c.req.header("user-agent") || "unknown";
  console.log(`[404] ${c.req.method} ${c.req.path} ip=${ip} ua=${JSON.stringify(ua)}`);
  return { path: c.req.path };
});

export const head = defineHead<Props>(() => ({
  title: "404 Not Found",
}));
