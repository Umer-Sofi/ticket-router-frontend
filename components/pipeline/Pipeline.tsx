"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PipelineNode } from "@/components/pipeline/PipelineNode";
import { PipelineArrow } from "@/components/pipeline/PipelineArrow";
import { PipelineController } from "@/hooks/usePipeline";

// Full-width horizontal pipeline. Nodes flow left → right with animated
// arrows. Reads all state from the controller (usePipeline).
export function Pipeline({ controller }: { controller: PipelineController }) {
  const { stages, isComplete, totalMs } = controller;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Live AI Processing Pipeline
      </h2>

      {/* Rail: always horizontal. Nodes are fluid (flex-1) so all 5 fit and
          shrink together as the screen narrows. */}
      <div className="flex items-start justify-center gap-0.5 sm:gap-1">
        {stages.map((stage, i) => (
          <Fragment key={stage.id}>
            <PipelineNode stage={stage} />
            {i < stages.length - 1 && (
              <PipelineArrow
                active={stages[i + 1].state === "active"}
                done={stages[i + 1].state === "completed"}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Completion footer */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950/40"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Classification complete
          </span>
          {totalMs != null && (
            <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
              Total Processing Time:{" "}
              <span className="font-semibold tabular-nums">{totalMs} ms</span>
            </span>
          )}
        </motion.div>
      )}
    </section>
  );
}
