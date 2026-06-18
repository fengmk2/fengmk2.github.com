import { useEffect, useState } from "react";
import type { BlogTableOfContents } from "void-blog";

type FlatItem = { depth: number; id: string; value: string };

function flatten(items: BlogTableOfContents, acc: FlatItem[] = []): FlatItem[] {
  for (const item of items) {
    acc.push({ depth: item.depth, id: item.id, value: item.value });
    if (item.children) flatten(item.children, acc);
  }
  return acc;
}

export default function Toc({ toc }: { toc: BlogTableOfContents | null }) {
  // Skip the leading h1 (the post title) and anything deeper than h3.
  const items = (toc ? flatten(toc) : []).filter((i) => i.depth >= 2 && i.depth <= 3);
  const ids = items.map((i) => i.id).join("|");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!ids) return;
    const headings = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [ids]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="void-toc">
      <div className="void-toc-title">On this page</div>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
            <a className={item.id === activeId ? "is-active" : undefined} href={`#${item.id}`}>
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
