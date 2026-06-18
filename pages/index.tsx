import PinnedPost from "void-blog/pinned-post";
import allPosts from "void-blog/posts";
import { BlogHomeRoute } from "void-blog/react";
import blogConfig from "../blog.config.ts";
import Intro from "../src/components/Intro.tsx";
import type { Props } from "./index.server.ts";

export default function HomePage(props: Props) {
  return (
    <BlogHomeRoute
      {...props}
      config={blogConfig}
      intro={<Intro />}
      pinnedPostWithContent={PinnedPost}
      posts={allPosts.filter(({ published }) => published)}
    />
  );
}
