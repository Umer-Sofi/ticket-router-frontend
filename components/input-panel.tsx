"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Trash2, Lightbulb, ChevronDown } from "lucide-react";

const EXAMPLES = [
  "I was charged twice for my subscription this month.",
  "Someone logged into my account from another country.",
  "Please add a dark mode to the dashboard.",
  "How do I change my email address?",
];

export function InputPanel({
  text,
  setText,
  onSubmit,
  loading,
}: {
  text: string;
  setText: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Enter Support Ticket
      </h2>
      <p className="mt-0.5 text-xs text-zinc-500">
        Paste or type the customer support ticket below
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. I was charged twice for my subscription…"
        rows={6}
        maxLength={5000}
        className="mt-3 w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />

      <div className="mt-2 text-xs text-zinc-400">{text.length} characters</div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Classifying…" : "Classify Ticket"}
        </button>

        <button
          onClick={() => setShowExamples((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Lightbulb className="h-4 w-4" />
          Try
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${showExamples ? "rotate-180" : ""}`}
          />
        </button>

        <button
          onClick={() => setText("")}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Examples: revealed on demand, animated down */}
      <AnimatePresence initial={false}>
        {showExamples && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setText(ex);
                    setShowExamples(false);
                  }}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {ex.length > 28 ? ex.slice(0, 28) + "…" : ex}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
