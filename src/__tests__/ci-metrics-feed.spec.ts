import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { dataUrl } from "../ci-metrics/data.ts";
import type { Dataset } from "../ci-metrics/data.ts";
import { refreshIntervalMs, watchFeed } from "../ci-metrics/feed.ts";

const snapshot: Dataset = {
  version: 1,
  repository: "voidzero-dev/vite-plus",
  workflow: "ci.yml",
  coverageStart: "2026-10-01T00:00:00Z",
  updatedAt: "2026-10-19T07:00:00Z",
  runs: [],
};
const live = { ...snapshot, updatedAt: "2026-10-22T00:54:00Z" };

describe("automatic CI feed refresh", () => {
  const onChange = vi.fn();
  let stop: (() => void) | undefined;
  let page: EventTarget & { visibilityState: string };
  let tab: EventTarget;
  let request: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    vi.useFakeTimers();
    onChange.mockClear();
    page = Object.assign(new EventTarget(), { visibilityState: "visible" });
    tab = new EventTarget();
    request = vi.fn<typeof fetch>().mockImplementation(async () => Response.json(live));
    vi.stubGlobal("fetch", request);
    vi.stubGlobal("document", page);
    vi.stubGlobal("window", tab);
  });

  afterEach(() => {
    stop?.();
    stop = undefined;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("loads immediately, polls every five minutes, and does not regress to an older CDN copy", async () => {
    stop = watchFeed(onChange);
    await vi.advanceTimersByTimeAsync(0);
    expect(onChange).toHaveBeenLastCalledWith({ data: live, source: "live", error: false });
    expect(request).toHaveBeenCalledWith(dataUrl, expect.objectContaining({ cache: "no-cache" }));

    const newer = { ...live, updatedAt: "2026-10-22T01:17:00Z" };
    request.mockResolvedValueOnce(Response.json(newer));
    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(onChange).toHaveBeenLastCalledWith({ data: newer, source: "live", error: false });

    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(request).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith({ data: newer, source: "live", error: false });
  });

  it("recovers from the bundled snapshot without reloading the page", async () => {
    request
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(Response.json(snapshot));
    stop = watchFeed(onChange);
    await vi.advanceTimersByTimeAsync(0);
    expect(onChange).toHaveBeenLastCalledWith({ data: snapshot, source: "snapshot", error: true });

    tab.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(onChange).toHaveBeenLastCalledWith({ data: live, source: "live", error: false });
  });

  it("keeps loaded data on failure and clears the error after recovery", async () => {
    stop = watchFeed(onChange);
    await vi.advanceTimersByTimeAsync(0);
    request.mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(onChange).toHaveBeenLastCalledWith({ data: live, source: "live", error: true });
    expect(request.mock.calls.every(([url]) => url === dataUrl)).toBe(true);

    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(onChange).toHaveBeenLastCalledWith({ data: live, source: "live", error: false });
  });

  it("retries after both initial sources fail", async () => {
    request.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(Response.json({}));
    stop = watchFeed(onChange);
    await vi.advanceTimersByTimeAsync(0);
    expect(onChange).toHaveBeenLastCalledWith({ data: null, source: "loading", error: true });

    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(onChange).toHaveBeenLastCalledWith({ data: live, source: "live", error: false });
  });

  it("pauses hidden tabs, refreshes on return, and coalesces overlapping events", async () => {
    stop = watchFeed(onChange);
    await vi.advanceTimersByTimeAsync(0);
    page.visibilityState = "hidden";
    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    tab.dispatchEvent(new Event("focus"));
    expect(request).toHaveBeenCalledTimes(1);

    page.visibilityState = "visible";
    page.dispatchEvent(new Event("visibilitychange"));
    tab.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("aborts pending requests and removes timers and listeners on cleanup", async () => {
    let finish!: (response: Response) => void;
    request.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    stop = watchFeed(onChange);
    const signal = request.mock.calls[0][1]?.signal;
    stop();
    expect(signal?.aborted).toBe(true);
    finish(Response.json(live));
    tab.dispatchEvent(new Event("focus"));
    page.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(refreshIntervalMs);
    expect(request).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });
});
