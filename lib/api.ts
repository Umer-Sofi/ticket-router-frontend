// All calls to the backend live here. UI components import from this file
// instead of calling fetch() directly — one place to change the API contract.

import { RouteResult } from "@/types/ticket";

// Backend base URL. Comes from .env.local (NEXT_PUBLIC_ = visible to browser).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function classifyTicket(text: string): Promise<RouteResult> {
  const res = await fetch(`${API_URL}/api/route-ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }), // must match TicketRequest: { text }
  });

  // fetch does NOT throw on 4xx/5xx — we must check ok ourselves.
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json() as Promise<RouteResult>;
}

// Ping the backend's /health endpoint. Used for the "API Status" indicator.
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
