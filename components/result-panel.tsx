"use client";

import { useState } from "react";
import { Clock, Coins, RefreshCw, Cpu, Copy, Check, Sparkles } from "lucide-react";
import { RouteResult } from "@/types/ticket";
import { PriorityBadge } from "@/components/priority-badge";
import { MetricTile } from "@/components/metric-tile";
import { CATEGORY_COLOR } from "@/lib/categories";

export function ResultPanel({ result }: { result: RouteResult }) {
  const [copied, setCopied] = useState(false);

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const fmt = (n?: number | null, suffix = "") =>
    n == null ? "—" : `${n}${suffix}`;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Classification Result
        </h2>
        <PriorityBadge priority={result.priority} />
      </div>

      {/* Category + team */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Category
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLOR[result.category] }}
            />
            {result.category}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Assigned Team
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {result.assigned_team}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/20">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          <Sparkles className="h-3.5 w-3.5" /> AI Reasoning
        </div>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {result.reasoning}
        </p>
      </div>

      {/* Real metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile icon={Clock} label="Time" value={fmt(result.processing_time_ms, " ms")} />
        <MetricTile icon={Coins} label="Tokens" value={fmt(result.total_tokens)} />
        <MetricTile
          icon={Coins}
          label="Cost"
          value={result.cost_usd == null ? "—" : `$${result.cost_usd.toFixed(5)}`}
        />
        <MetricTile icon={RefreshCw} label="Retries" value={fmt(result.retries)} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Cpu className="h-3.5 w-3.5" />
          {result.model ?? "unknown model"}
        </span>
        <button
          onClick={copyJson}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
    </section>
  );
}
