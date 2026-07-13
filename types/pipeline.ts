// Types + config for the Live AI Processing Pipeline.

import { LucideIcon, Zap, Server, Cpu, ShieldCheck, Braces } from "lucide-react";

export type StageState = "idle" | "active" | "completed" | "error";

// Static definition of one pipeline stage.
export interface StageDef {
  id: string;
  title: string;
  description: string;
  status: string; // shown while the stage is active
  icon: LucideIcon;
  simulatedMs: number; // used only until real backend progress events exist
}

// A stage at runtime = its definition + live state.
export interface StageRuntime extends StageDef {
  state: StageState;
  elapsedMs?: number;
}

// The pipeline mirrors the real request path. `simulatedMs` are illustrative
// animation timings — the REAL total comes from the API's processing_time_ms.
export const PIPELINE_STAGES: StageDef[] = [
  { id: "frontend", title: "Next.js", description: "Frontend", status: "Sending request…", icon: Zap, simulatedMs: 150 },
  { id: "backend", title: "FastAPI", description: "Backend", status: "Validating request…", icon: Server, simulatedMs: 250 },
  { id: "gpt", title: "GPT-4o-mini", description: "AI Model", status: "Analyzing ticket…", icon: Cpu, simulatedMs: 1200 },
  { id: "rules", title: "Business Rules", description: "Routing", status: "Applying routing rules…", icon: ShieldCheck, simulatedMs: 200 },
  { id: "json", title: "JSON Response", description: "Response", status: "Preparing structured response…", icon: Braces, simulatedMs: 150 },
];
