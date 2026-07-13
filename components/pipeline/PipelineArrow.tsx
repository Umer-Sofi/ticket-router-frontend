"use client";

import { motion } from "framer-motion";

// Horizontal connector between two nodes. Stays horizontal at every screen
// size; small fixed width so the fluid nodes keep the space. When `active`,
// an indigo fill sweeps left → right; when `done`, solid emerald.
export function PipelineArrow({
  active,
  done,
}: {
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="mt-6 h-0.5 w-2 shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800 sm:mt-7 sm:w-4 lg:w-8">
      {done && !active && <div className="h-full w-full bg-emerald-500" />}
      {active && (
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
