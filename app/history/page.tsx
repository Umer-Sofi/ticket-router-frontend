"use client";

import { useEffect, useState } from "react";
import { Inbox, Trash2 } from "lucide-react";
import { HistoryItem } from "@/types/ticket";
import { loadHistory, clearHistory, timeAgo } from "@/lib/history";
import { CATEGORY_COLOR } from "@/lib/categories";
import { PriorityBadge } from "@/components/priority-badge";

// Route: /history — full-width list of every classified ticket (from localStorage).
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Ticket History
          </h2>
          <p className="text-sm text-zinc-500">
            {history.length} classified {history.length === 1 ? "ticket" : "tickets"}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setHistory(clearHistory())}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-400">
            No tickets classified yet. Head to the Dashboard to classify one.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl border border-zinc-100 p-4 dark:border-zinc-800"
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[item.result.category] }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.result.category}
                  </span>
                  <PriorityBadge priority={item.result.priority} />
                  <span className="ml-auto text-xs text-zinc-400">
                    {timeAgo(item.at)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                  {item.text}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
                  <span>Team: {item.result.assigned_team}</span>
                  {item.result.total_tokens != null && (
                    <span>{item.result.total_tokens} tokens</span>
                  )}
                  {item.result.cost_usd != null && (
                    <span>${item.result.cost_usd.toFixed(5)}</span>
                  )}
                  {item.result.processing_time_ms != null && (
                    <span>{item.result.processing_time_ms} ms</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
