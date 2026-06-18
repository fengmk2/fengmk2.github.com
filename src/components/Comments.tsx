import { useEffect } from "react";
import { redirects } from "../redirects.generated.ts";

const SHORTNAME = "fengmk2github";
const SITE = "https://fengmk2.com";

// Disqus threads were historically keyed by the post URL. Map each new /posts/<slug>
// back to its previous /blog/... path so existing comment threads stay attached.
const oldPathByNew: Record<string, string> = {};
for (const [oldPath, newPath] of Object.entries(redirects)) {
  oldPathByNew[newPath] = oldPath;
}

interface DisqusThis {
  page: { identifier: string; url: string };
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { config: (this: DisqusThis) => void; reload: boolean }) => void;
    };
    disqus_config?: (this: DisqusThis) => void;
  }
}

export default function Comments({ slug }: { slug: string }) {
  const newPath = `/posts/${slug}`;
  const url = `${SITE}${newPath}`;
  const identifier = `${SITE}${oldPathByNew[newPath] ?? newPath}`;

  useEffect(() => {
    const config = function (this: DisqusThis) {
      this.page.url = url;
      this.page.identifier = identifier;
    };
    if (window.DISQUS) {
      window.DISQUS.reset({ config, reload: true });
      return;
    }
    window.disqus_config = config;
    const script = document.createElement("script");
    script.src = `https://${SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(Date.now()));
    document.body.appendChild(script);
  }, [identifier, url]);

  return (
    <section className="void-comments">
      <h2>Comments</h2>
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{" "}
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
      <style>{`.void-comments { max-width: 768px; margin: 48px auto 0; padding: 0 32px; }`}</style>
    </section>
  );
}
