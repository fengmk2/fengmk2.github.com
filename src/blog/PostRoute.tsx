import { BlogPostRoute, type BlogPostRouteProps } from "void-blog/react";
import Comments from "../components/Comments.tsx";
import Toc from "../components/Toc.tsx";

// Custom post route: the default void-blog post design plus a TOC sidebar and Disqus comments.
export default function PostRoute(props: BlogPostRouteProps) {
  return (
    <>
      <Toc toc={props.tableOfContents} />
      <BlogPostRoute {...props} />
      {props.post ? <Comments slug={props.post.slug} /> : null}
    </>
  );
}
