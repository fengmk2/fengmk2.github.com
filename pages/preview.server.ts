import { createPreviewHead } from "void-blog/server";
import blogConfig from "../blog.config.ts";

export const prerender = true;
export const head = createPreviewHead(blogConfig);
