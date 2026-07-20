"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { checkHealth } from "@/lib/api";

const TECH = ["GPT-4o-mini", "FastAPI", "Next.js", "Pydantic"];

// Shared top bar: title, tech chips, and the live API status (pings /health).
// Lives in the layout so it appears on every page.
export function Header() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth().then(setOnline);
    const id = setInterval(() => checkHealth().then(setOnline), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Smart Ticket Router
        </h1>
        <p className="text-sm text-zinc-500">
          AI-Powered Support Ticket Classification
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
        {online == null ? (
          <Circle className="h-3.5 w-3.5 text-zinc-400" />
        ) : online ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 fill-red-500 text-red-500" />
        )}
        <span className="text-zinc-500">API</span>
        <span
          className={
            online ? "font-semibold text-emerald-600" : "font-semibold text-red-600"
          }
        >
          {online == null ? "…" : online ? "Connected" : "Offline"}
        </span>
      </div>
    </header>
  );
}
