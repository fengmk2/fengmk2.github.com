import allPosts from "void-blog/posts";
import { createHomeLoader, type BlogHomeLoaderProps } from "void-blog/server";

export type Props = BlogHomeLoaderProps;
export const prerender = true;
export const loader = createHomeLoader({ posts: allPosts });
