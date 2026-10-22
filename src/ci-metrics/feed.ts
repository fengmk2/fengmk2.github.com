import { dataUrl, parseDataset } from "./data.ts";
import type { Dataset } from "./data.ts";

export const refreshIntervalMs = 5 * 60_000;

export interface FeedState {
  data: Dataset | null;
  source: "live" | "snapshot" | "loading";
  error: boolean;
}

export function watchFeed(onChange: (state: FeedState) => void): () => void {
  const controller = new AbortController();
  let state: FeedState = { data: null, source: "loading", error: false };
  let refreshing = false;

  const load = async (url: string) => {
    const response = await fetch(url, {
      cache: "no-cache",
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseDataset(await response.json());
  };

  const refresh = async () => {
    if (refreshing || controller.signal.aborted) return;
    refreshing = true;
    try {
      const data = await load(dataUrl);
      // A CDN edge can briefly return an older file after a new collection.
      if (!state.data || Date.parse(data.updatedAt) >= Date.parse(state.data.updatedAt)) {
        state = { data, source: "live", error: false };
      } else {
        state = { ...state, error: false };
      }
    } catch {
      if (controller.signal.aborted) return;
      state = { ...state, error: true };
      // A failed refresh must never replace loaded history with the bundled snapshot.
      if (!state.data) {
        try {
          state = { data: await load("/data/vite-plus-ci.json"), source: "snapshot", error: true };
        } catch {
          // Keep retrying the live feed on the next timer or focus event.
        }
      }
    } finally {
      refreshing = false;
      if (!controller.signal.aborted) onChange({ ...state });
    }
  };
  const refreshVisible = () => {
    if (document.visibilityState === "visible") void refresh();
  };

  void refresh();
  const timer = setInterval(refreshVisible, refreshIntervalMs);
  window.addEventListener("focus", refreshVisible);
  document.addEventListener("visibilitychange", refreshVisible);
  return () => {
    controller.abort();
    clearInterval(timer);
    window.removeEventListener("focus", refreshVisible);
    document.removeEventListener("visibilitychange", refreshVisible);
  };
}
