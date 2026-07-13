// Mirrors the backend's Pydantic models (schemas/ticket.py).
// This is the CONTRACT: if the backend changes its response shape, update here.

export type Priority = "High" | "Medium" | "Low";

export type Category =
  | "Billing"
  | "Security"
  | "Account"
  | "Technical"
  | "Feature Request"
  | "General";

export type Team =
  | "Billing"
  | "Security"
  | "Account Management"
  | "Engineering"
  | "Product"
  | "Customer Support";

// The JSON the backend returns from POST /api/route-ticket.
export interface RouteResult {
  category: Category;
  priority: Priority;
  assigned_team: Team;
  reasoning: string;
  // Metadata (may be null on the fallback path).
  processing_time_ms?: number | null;
  model?: string | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  cost_usd?: number | null;
  retries?: number | null;
}

// One saved classification, stored in localStorage for History + Analytics.
export interface HistoryItem {
  id: string;
  text: string;
  result: RouteResult;
  at: number; // epoch milliseconds
}
