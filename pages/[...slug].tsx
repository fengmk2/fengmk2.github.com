import type { Props } from "./[...slug].server.ts";

export default function NotFoundPage({ path }: Props) {
  return (
    <main style={{ margin: "0 auto", maxWidth: 640, padding: "4rem 1.5rem" }}>
      <h1>404 Not Found</h1>
      <p>
        The page <code>{path}</code> does not exist.
      </p>
      <p>
        <a href="/">Back to home</a>
      </p>
    </main>
  );
}
