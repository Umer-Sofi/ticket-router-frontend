// Displays one RouteResult. Pure presentation: it receives a result via
// props and renders it. No state, no fetching — a parent gives it the data.

import { RouteResult } from "@/types/ticket";
import { PriorityBadge } from "@/components/priority-badge";

// A labeled tile for one field (Category / Team).
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

export function ResultCard({ result }: { result: RouteResult }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Classification Result
        </h2>
        <PriorityBadge priority={result.priority} />
      </div>

      <div className="space-y-4 p-6">
        {/* Two field tiles */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category" value={result.category} />
          <Field label="Assigned Team" value={result.assigned_team} />
        </div>

        {/* Reasoning */}
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Reasoning
          </dt>
          <dd className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {result.reasoning}
          </dd>
        </div>
      </div>

      {/* Footer meta */}
      {result.processing_time_ms != null && (
        <div className="border-t border-zinc-100 px-6 py-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-400">
            Classified in {result.processing_time_ms} ms
          </p>
        </div>
      )}
    </div>
  );
}
