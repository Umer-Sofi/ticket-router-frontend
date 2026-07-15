"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { StageRuntime } from "@/types/pipeline";

// One stage card. Fluid width (flex-1) so a row of 5 always fits — cards
// shrink as the screen narrows. Styling + motion driven by `stage.state`.
export function PipelineNode({ stage }: { stage: StageRuntime }) {
  const { state, icon: Icon } = stage;

  const isActive = state === "active";
  const isDone = state === "completed";
  const isError = state === "error";

  const border = isActive
    ? "border-indigo-500"
    : isDone
      ? "border-emerald-500"
      : isError
        ? "border-red-500"
        : "border-zinc-200 dark:border-zinc-800";

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: state === "idle" ? 0.55 : 1,
        scale: isDone ? [1.04, 1] : 1,
        boxShadow: isActive
          ? [
              "0 0 0 0 rgba(99,102,241,0.0)",
              "0 0 0 4px rgba(99,102,241,0.15)",
              "0 0 0 0 rgba(99,102,241,0.0)",
            ]
          : "0 0 0 0 rgba(99,102,241,0)",
      }}
      transition={{
        boxShadow: { duration: 1.4, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
      }}
      className={`flex min-w-0 flex-1 basis-0 flex-col items-center gap-1.5 rounded-xl border bg-white p-2 text-center dark:bg-zinc-900 sm:max-w-[140px] sm:gap-2 sm:p-3 ${border}`}
    >
      {/* Icon badge (shrinks on small screens) */}
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
          isActive
            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50"
            : isDone
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"
              : isError
                ? "bg-red-50 text-red-600 dark:bg-red-950/50"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
        }`}
      >
        <motion.span
          animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.span>
      </div>

      {/* Title + description (description hidden on very small screens) */}
      <div className="w-full">
        <div className="truncate text-[10px] font-semibold text-zinc-900 dark:text-zinc-100 sm:text-xs">
          {stage.title}
        </div>
        <div className="hidden text-[10px] text-zinc-400 sm:block">
          {stage.description}
        </div>
      </div>

      {/* Status line */}
      <div className="flex min-h-[20px] items-center justify-center sm:min-h-[30px]">
        {isDone ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-2.5 w-2.5" />
          </span>
        ) : isError ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white">
            <X className="h-2.5 w-2.5" />
          </span>
        ) : isActive ? (
          <span className="hidden text-[10px] leading-tight text-indigo-600 dark:text-indigo-400 sm:block">
            {stage.status}
          </span>
        ) : (
          <span className="hidden text-[10px] text-zinc-400 sm:block">Waiting</span>
        )}
      </div>
    </motion.div>
  );
}
