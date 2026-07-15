"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { RouteResult } from "@/types/ticket";
import { PriorityBadge } from "@/components/priority-badge";
import { CATEGORY_COLOR } from "@/lib/categories";

// One classified ticket. A message may yield several of these, so the card is
// self-contained: its own text, category, team, priority, and reasoning.
function TicketCard({ ticket, index }: { ticket: RouteResult; index: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Ticket {index + 1}
        </span>
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* The slice of the message this ticket was extracted from */}
      {ticket.text && (
        <p className="mb-3 rounded-lg bg-zinc-50 p-2.5 text-sm italic text-zinc-600 dark:bg-zinc-800/40 dark:text-zinc-300">
          “{ticket.text}”
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Category
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLOR[ticket.category] }}
            />
            {ticket.category}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Assigned Team
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {ticket.assigned_team}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/20">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          <Sparkles className="h-3.5 w-3.5" /> AI Reasoning
        </div>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {ticket.reasoning}
        </p>
      </div>
    </div>
  );
}

export function ResultPanel({ tickets }: { tickets: RouteResult[] }) {
  const [copied, setCopied] = useState(false);

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(tickets, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const count = tickets.length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Classification Result
        </h2>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {count} {count === 1 ? "ticket" : "tickets"} found
        </span>
      </div>

      {/* One card per ticket the model found in the message */}
      <div className="space-y-3">
        {tickets.map((ticket, i) => (
          <TicketCard key={i} ticket={ticket} index={i} />
        ))}
      </div>

      <div className="mt-4 flex justify-end">
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
