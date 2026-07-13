"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Inbox } from "lucide-react";
import { RouteResult, HistoryItem } from "@/types/ticket";
import { classifyTicket, checkHealth } from "@/lib/api";
import { loadHistory, addHistory, clearHistory } from "@/lib/history";
import { usePipeline } from "@/hooks/usePipeline";
import { Sidebar } from "@/components/sidebar";
import { InputPanel } from "@/components/input-panel";
import { ResultPanel } from "@/components/result-panel";
import { Pipeline } from "@/components/pipeline/Pipeline";
import { HistoryPanel } from "@/components/history-panel";
import { AnalyticsPanel } from "@/components/analytics-panel";

const TECH = ["GPT-4o-mini", "FastAPI", "Next.js", "Pydantic"];

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const pipeline = usePipeline();

  // Load history + check backend health on mount (and poll health).
  useEffect(() => {
    setHistory(loadHistory());
    checkHealth().then(setOnline);
    const id = setInterval(() => checkHealth().then(setOnline), 20000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit() {
    if (!text.trim()) {
      setError("Please enter a ticket first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    // Show the animated pipeline and start the simulated progress.
    setPipelineActive(true);
    pipeline.reset();
    pipeline.startSimulation();

    try {
      const data = await classifyTicket(text);
      // API returned: jump the pipeline to completion (real total time).
      pipeline.complete(data.processing_time_ms);
      // Brief pause so the "complete" state shows, then reveal the result card.
      // The pipeline stays visible below (it does NOT fade out).
      await new Promise((r) => setTimeout(r, 500));
      setResult(data);
      setHistory(addHistory(text, data));
    } catch {
      pipeline.fail();
      setError("Couldn't reach the classifier. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="top" className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6 p-6">
          {/* Header */}
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

            {/* API status (real: pings /health) */}
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

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Top: input (left) + work area (right) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InputPanel
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              loading={loading}
            />

            {/* Right work area: pipeline sits JUST ABOVE the result */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {pipelineActive && <Pipeline controller={pipeline} />}

              {result ? (
                <ResultPanel result={result} />
              ) : (
                <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <Inbox className="h-8 w-8 text-zinc-300" />
                  <p className="mt-2 text-sm text-zinc-400">
                    {loading
                      ? "Processing… see the pipeline above."
                      : "Classify a ticket to see the result here."}
                  </p>
                </section>
              )}
            </div>
          </div>

          {/* Bottom: history + analytics, full width */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <HistoryPanel
              history={history}
              onClear={() => setHistory(clearHistory())}
            />
            <AnalyticsPanel history={history} />
          </div>
        </div>
      </main>
    </div>
  );
}
