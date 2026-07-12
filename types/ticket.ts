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
  processing_time_ms?: number | null;
}
