// Owns pipeline state and the transitions between stages.
//
// SWAP SEAM: `startSimulation()` is the ONLY place that fakes timing. To use
// real backend progress (SSE/WebSocket) later, replace its body with a
// subscriber that calls the same primitives — activate(i) / completeStage(i).
// The components read `stages` and never know whether it's simulated or real.

import { useCallback, useEffect, useRef, useState } from "react";
import { PIPELINE_STAGES, StageRuntime } from "@/types/pipeline";

function freshStages(): StageRuntime[] {
  return PIPELINE_STAGES.map((s) => ({ ...s, state: "idle", elapsedMs: undefined }));
}

export function usePipeline() {
  const [stages, setStages] = useState<StageRuntime[]>(freshStages);
  const [isComplete, setIsComplete] = useState(false);
  const [totalMs, setTotalMs] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Clean up any pending timers if the component unmounts mid-run.
  useEffect(() => clearTimers, [clearTimers]);

  // --- primitives the driver calls (simulated OR real) ---------------------
  const activate = useCallback((i: number) => {
    setStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, state: "active" } : s)));
  }, []);

  const completeStage = useCallback((i: number, ms: number) => {
    setStages((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, state: "completed", elapsedMs: ms } : s)),
    );
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setStages(freshStages());
    setIsComplete(false);
    setTotalMs(null);
  }, [clearTimers]);

  // --- simulated driver (replace this body for real events) ----------------
  const startSimulation = useCallback(() => {
    let acc = 0;
    PIPELINE_STAGES.forEach((stage, i) => {
      timers.current.push(setTimeout(() => activate(i), acc));
      acc += stage.simulatedMs;
      // Complete every stage EXCEPT the last — the last stays "active" until
      // the real API resolves and complete() is called.
      if (i < PIPELINE_STAGES.length - 1) {
        timers.current.push(setTimeout(() => completeStage(i, stage.simulatedMs), acc));
      }
    });
  }, [activate, completeStage]);

  // Called when the real API resolves: fast-forward everything to done.
  const complete = useCallback(
    (realTotalMs?: number | null) => {
      clearTimers();
      setStages((prev) =>
        prev.map((s) => ({
          ...s,
          state: "completed",
          elapsedMs: s.elapsedMs ?? s.simulatedMs,
        })),
      );
      setTotalMs(realTotalMs ?? null);
      setIsComplete(true);
    },
    [clearTimers],
  );

  // Called when the API fails: mark the current active stage as errored.
  const fail = useCallback(() => {
    clearTimers();
    setStages((prev) => {
      const i = Math.max(0, prev.findIndex((s) => s.state === "active"));
      return prev.map((s, idx) => (idx === i ? { ...s, state: "error" } : s));
    });
  }, [clearTimers]);

  return { stages, isComplete, totalMs, reset, startSimulation, complete, fail };
}

export type PipelineController = ReturnType<typeof usePipeline>;
