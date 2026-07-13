"use client";

import { Trash2 } from "lucide-react";
import { HistoryItem } from "@/types/ticket";
import { CATEGORY_COLOR } from "@/lib/categories";
import { timeAgo } from "@/lib/history";

export function HistoryPanel({
  history,
  onClear,
}: {
  history: HistoryItem[];
  onClear: () => void;
}) {
  return (
    <section
      id="history"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Recent History
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-400">
          No tickets classified yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[item.result.category] }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {item.text}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {item.result.category} · {item.result.priority} ·{" "}
                  {timeAgo(item.at)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
