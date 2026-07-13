"use client";

import { useEffect, useState } from "react";
import { LucideIcon, Ticket, ArrowUp, Clock, DollarSign, BarChart3 } from "lucide-react";
import { HistoryItem, Priority } from "@/types/ticket";
import { loadHistory } from "@/lib/history";
import { categoryDistribution } from "@/lib/categories";

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}

const PRIORITY_COLOR: Record<Priority, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

export default function AnalyticsPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const total = history.length;
  const slices = categoryDistribution(history);

  const highCount = history.filter((h) => h.result.priority === "High").length;
  const timed = history
    .map((h) => h.result.processing_time_ms)
    .filter((n): n is number => n != null);
  const avgMs = timed.length
    ? Math.round(timed.reduce((a, b) => a + b, 0) / timed.length)
    : null;
  const totalCost = history.reduce((a, h) => a + (h.result.cost_usd ?? 0), 0);

  const priorityCounts: Record<Priority, number> = {
    High: history.filter((h) => h.result.priority === "High").length,
    Medium: history.filter((h) => h.result.priority === "Medium").length,
    Low: history.filter((h) => h.result.priority === "Low").length,
  };

  // conic-gradient stops for the donut
  let acc = 0;
  const stops = slices
    .map((s) => {
      const start = acc;
      acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(", ");

  if (total === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-400">
            No data yet. Classify a few tickets to see analytics.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Ticket} label="Total Tickets" value={String(total)} />
        <StatTile icon={ArrowUp} label="High Priority" value={String(highCount)} />
        <StatTile icon={Clock} label="Avg Response" value={avgMs != null ? `${avgMs} ms` : "—"} />
        <StatTile icon={DollarSign} label="Total Cost" value={`$${totalCost.toFixed(4)}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category donut */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Category Distribution
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-40 w-40 shrink-0">
              <div
                className="h-40 w-40 rounded-full"
                style={{ background: `conic-gradient(${stops})` }}
              />
              <div className="absolute inset-[20%] flex flex-col items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {total}
                </span>
                <span className="text-xs text-zinc-400">tickets</span>
              </div>
            </div>
            <ul className="flex-1 space-y-2">
              {slices.map((s) => (
                <li key={s.category} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="flex-1 text-zinc-600 dark:text-zinc-300">
                    {s.category}
                  </span>
                  <span className="text-zinc-400">{s.count}</span>
                  <span className="w-10 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    {s.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Priority breakdown */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Priority Breakdown
          </h2>
          <div className="space-y-4">
            {(["High", "Medium", "Low"] as Priority[]).map((p) => {
              const count = priorityCounts[p];
              const pct = Math.round((count / total) * 100);
              return (
                <div key={p}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">{p}</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${PRIORITY_COLOR[p]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
