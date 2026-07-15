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

// One classified ticket. A single message can produce several of these.
export interface RouteResult {
  text?: string | null; // the slice of the message this ticket came from
  category: Category;
  priority: Priority;
  assigned_team: Team;
  reasoning: string;
  // Processing time is NOT sent by the API — it's measured client-side (request
  // round-trip) and attached per ticket when saving history, so the History +
  // Analytics pages can show it.
  processing_time_ms?: number | null;
}

// The backend returns a bare array of RouteResult from POST /api/route-ticket
// (one entry per distinct ticket found). No wrapper object, no metadata.

// One saved classification, stored in localStorage for History + Analytics.
export interface HistoryItem {
  id: string;
  text: string;
  result: RouteResult;
  at: number; // epoch milliseconds
}
