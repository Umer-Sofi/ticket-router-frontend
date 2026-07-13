"use client"; // needed: this component uses state + event handlers (runs in the browser)

import { useState } from "react";
import { RouteResult } from "@/types/ticket";
import { ResultCard } from "@/components/result-card";
import { classifyTicket } from "@/lib/api";

// A few sample tickets so the page is easy to demo / try.
const EXAMPLES = [
  "I was charged twice for my subscription this month.",
  "Someone logged into my account from another country.",
  "Please add a dark mode to the dashboard.",
];

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) {
      setError("Please enter a ticket first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Real call to the FastAPI backend.
      const data = await classifyTicket(text);
      setResult(data);
    } catch {
      setError("Couldn't reach the classifier. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Soft decorative glow behind the header (purely visual) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10"
      />

      <main className="relative mx-auto flex max-w-2xl flex-col gap-8 px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            ⇄
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Smart Ticket Router
            </h1>
            <p className="text-sm text-zinc-500">
              AI-powered triage — category, priority & team in one click.
            </p>
          </div>
        </header>

        {/* Input card */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label
            htmlFor="ticket"
            className="text-xs font-medium uppercase tracking-wide text-zinc-500"
          >
            Support ticket
          </label>
          <textarea
            id="ticket"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the customer's message here…"
            rows={5}
            maxLength={5000}
            className="mt-2 w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />

          {/* Example chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setText(ex)}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {ex.length > 34 ? ex.slice(0, 34) + "…" : ex}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-zinc-400">{text.length} characters</span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {loading ? "Classifying…" : "Classify Ticket"}
            </button>
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Success state */}
        {result && <ResultCard result={result} />}
      </main>
    </div>
  );
}
