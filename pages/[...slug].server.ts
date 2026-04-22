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
  return { path: c.req.path };
});

export const head = defineHead<Props>(() => ({
  title: "404 Not Found",
}));
