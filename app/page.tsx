"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { RouteResult } from "@/types/ticket";
import { classifyTicket } from "@/lib/api";
import { addClassification } from "@/lib/history";
import { usePipeline } from "@/hooks/usePipeline";
import { InputPanel } from "@/components/input-panel";
import { ResultPanel } from "@/components/result-panel";
import { Pipeline } from "@/components/pipeline/Pipeline";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const pipeline = usePipeline();

  async function handleSubmit() {
    if (!text.trim()) {
      setError("Please enter a ticket first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    setPipelineActive(true);
    pipeline.reset();
    pipeline.startSimulation();

    try {
      // Measure the request round-trip ourselves — the API is lean and no
      // longer reports timing.
      const start = performance.now();
      const data = await classifyTicket(text);
      const elapsed = Math.round(performance.now() - start);

      pipeline.complete(elapsed);
      await new Promise((r) => setTimeout(r, 500));
      setResult(data);
      addClassification(text, data, elapsed); // save each ticket for History + Analytics
    } catch {
      pipeline.fail();
      setError("Couldn't reach the classifier. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <InputPanel
          text={text}
          setText={setText}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Right work area: pipeline sits JUST ABOVE the result */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          {pipelineActive && <Pipeline controller={pipeline} />}

          {result ? (
            <ResultPanel tickets={result} />
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
    </>
  );
}
