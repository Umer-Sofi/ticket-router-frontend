"use client";

import { HistoryItem } from "@/types/ticket";
import { categoryDistribution } from "@/lib/categories";

// Donut chart built with a CSS conic-gradient — no chart library needed.
// Every number here is derived from REAL history (tickets you classified).
export function AnalyticsPanel({ history }: { history: HistoryItem[] }) {
  const slices = categoryDistribution(history);
  const total = history.length;

  // Average processing time across items that reported one.
  const timed = history
    .map((h) => h.result.processing_time_ms)
    .filter((t): t is number => t != null);
  const avgMs = timed.length
    ? Math.round(timed.reduce((a, b) => a + b, 0) / timed.length)
    : null;

  // Build the conic-gradient stops cumulatively.
  let acc = 0;
  const stops = slices
    .map((s) => {
      const start = acc;
      acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <section
      id="analytics"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Analytics
      </h2>

      {total === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-400">
          Classify a few tickets to see analytics.
        </p>
      ) : (
        <div className="flex items-center gap-5">
          {/* Donut */}
          <div className="relative h-28 w-28 shrink-0">
            <div
              className="h-28 w-28 rounded-full"
              style={{ background: `conic-gradient(${stops})` }}
            />
            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {total}
              </span>
              <span className="text-[10px] text-zinc-400">tickets</span>
            </div>
          </div>

          {/* Legend */}
          <ul className="flex-1 space-y-1.5">
            {slices.map((s) => (
              <li key={s.category} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="flex-1 text-zinc-600 dark:text-zinc-300">
                  {s.category}
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {s.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {avgMs != null && (
        <div className="mt-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
          Avg. response:{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {avgMs} ms
          </span>
        </div>
      )}
    </section>
  );
}
