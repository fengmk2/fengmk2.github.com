import { defineBlog } from "void-blog";

export default defineBlog({
  contentDir: "posts",
  feed: true,
  markdown: true,
  ogImage: true,
  routeBase: "/posts",
  sitemap: true,
  site: {
    description:
      "A simple blog of fengmk2: Node.js, JavaScript, performance and engineering notes.",
    email: "fengmk2@gmail.com",
    footerLinks: [
      { href: "https://github.com/fengmk2", label: "GitHub" },
      { href: "https://weibo.com/imk2", label: "Weibo" },
      { href: "https://x.com/fengmk2", label: "X" },
      { href: "https://npmmirror.com", label: "npmmirror" },
      { href: "https://yuque.com/fengmk2", label: "语雀" },
      { href: "https://cnodejs.org/user/fengmk2", label: "CNode" },
    ],
    language: "zh-CN",
    name: "fengmk2",
    title: "A simple blog of fengmk2",
    url: "https://fengmk2.com",
  },
});
