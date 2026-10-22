import { useState } from "react";
import type { PointerEvent } from "react";
import { bucketLabel, duration } from "./data.ts";
import type { Granularity, TimeBucket } from "./data.ts";

export default function TrendChart({
  buckets,
  granularity,
}: {
  buckets: TimeBucket[];
  granularity: Granularity;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 1000;
  const height = 310;
  const left = 55;
  const right = 20;
  const top = 25;
  const bottom = 45;
  const maximum = Math.max(60, ...buckets.map((bucket) => bucket.p90 ?? 0));
  const ceiling = Math.ceil(maximum / 300) * 300;
  const x = (index: number) =>
    left + (index / Math.max(1, buckets.length - 1)) * (width - left - right);
  const y = (seconds: number) => top + (1 - seconds / ceiling) * (height - top - bottom);
  const path = (metric: "median" | "p90") =>
    buckets
      .map((bucket, index) => {
        const value = bucket[metric];
        if (value === null) return "";
        return `${index === 0 || buckets[index - 1][metric] === null ? "M" : "L"}${x(index)},${y(value)}`;
      })
      .join(" ");
  const labels = new Set([
    0,
    Math.floor((buckets.length - 1) / 3),
    Math.floor(((buckets.length - 1) * 2) / 3),
    buckets.length - 1,
  ]);
  const selected = activeIndex === null ? null : Math.min(activeIndex, buckets.length - 1);
  const active = selected === null ? null : buckets[selected];
  const title = granularity === "hour" ? "Hourly" : "Daily";

  const inspectPointer = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    // Convert screen coordinates to the SVG viewBox, including CSS scaling/padding.
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    if (point.x < left || point.x > width - right || point.y < top || point.y > height - bottom) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(Math.round(((point.x - left) / (width - left - right)) * (buckets.length - 1)));
  };

  return (
    <div className="ci-chart-container">
      <svg
        className="ci-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        tabIndex={0}
        aria-labelledby="ci-chart-title ci-chart-desc"
        onPointerMove={inspectPointer}
        onPointerDown={inspectPointer}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") setActiveIndex(null);
        }}
        onFocus={() => setActiveIndex((current) => current ?? buckets.length - 1)}
        onBlur={() => setActiveIndex(null)}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          setActiveIndex((current) => {
            if (event.key === "Home") return 0;
            if (event.key === "End") return buckets.length - 1;
            return Math.max(
              0,
              Math.min(
                buckets.length - 1,
                (current ?? buckets.length - 1) + (event.key === "ArrowRight" ? 1 : -1),
              ),
            );
          });
        }}
      >
        <title id="ci-chart-title">{title} median and P90 CI duration</title>
        <desc id="ci-chart-desc">
          Elapsed minutes by UTC {granularity}. Missing periods are gaps. Move the pointer over the
          plot or use the left and right arrow keys to inspect values. Values are also available in
          the table below.
        </desc>
        {[0, 1, 2, 3, 4].map((tick) => {
          const value = (ceiling * tick) / 4;
          return (
            <g key={tick}>
              <line x1={left} x2={width - right} y1={y(value)} y2={y(value)} className="ci-grid" />
              <text x={left - 12} y={y(value) + 4} textAnchor="end">
                {Number((value / 60).toFixed(1))}m
              </text>
            </g>
          );
        })}
        <path d={path("p90")} className="ci-line ci-line-p90" />
        <path d={path("median")} className="ci-line ci-line-median" />
        {buckets.map((bucket, index) => (
          <g key={bucket.startedAt}>
            {bucket.median !== null && (
              <circle cx={x(index)} cy={y(bucket.median)} r="4" className="ci-dot" />
            )}
            {bucket.p90 !== null && (
              <circle cx={x(index)} cy={y(bucket.p90)} r="2.5" className="ci-dot-p90" />
            )}
            {labels.has(index) && (
              <text
                x={x(index)}
                y={height - 12}
                textAnchor={index === 0 ? "start" : index === buckets.length - 1 ? "end" : "middle"}
              >
                {bucketLabel(bucket.startedAt, granularity)}
              </text>
            )}
          </g>
        ))}
        {active && selected !== null && (
          <g aria-hidden="true">
            <line
              x1={x(selected)}
              x2={x(selected)}
              y1={top}
              y2={height - bottom}
              className="ci-crosshair"
            />
            {active.median !== null && (
              <circle
                cx={x(selected)}
                cy={y(active.median)}
                r="6"
                className="ci-dot ci-dot-active"
              />
            )}
            {active.p90 !== null && (
              <circle
                cx={x(selected)}
                cy={y(active.p90)}
                r="5"
                className="ci-dot-p90 ci-dot-active"
              />
            )}
          </g>
        )}
      </svg>
      {active && selected !== null && (
        <div
          className="ci-chart-tooltip"
          role="tooltip"
          aria-live="polite"
          style={{
            left: `${(x(selected) / width) * 100}%`,
            transform:
              selected >= buckets.length / 2
                ? "translateX(calc(-100% - 12px))"
                : "translateX(12px)",
          }}
        >
          <strong>{bucketLabel(active.startedAt, granularity)} UTC</strong>
          <dl>
            <dt>Median</dt>
            <dd>{duration(active.median)}</dd>
            <dt>P90</dt>
            <dd>{duration(active.p90)}</dd>
            <dt>Successful attempts</dt>
            <dd>{active.status === "pending" ? "—" : active.count}</dd>
          </dl>
          {active.status === "pending" ? (
            <p>Awaiting the next collection.</p>
          ) : active.status === "partial" ? (
            <p>This {granularity} is only partly collected. More attempts may appear.</p>
          ) : active.count === 0 ? (
            <p>No successful attempts collected for this {granularity}.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
