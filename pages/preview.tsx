import "../src/styles.css";
import allPosts from "void-blog/posts";
import { BlogPreviewRoute } from "void-blog/react";
import blogConfig from "../blog.config.ts";

export default function PreviewPage() {
  return <BlogPreviewRoute config={blogConfig} posts={allPosts} />;
}
