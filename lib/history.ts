// localStorage-backed history. Everything here is REAL data — the tickets
// the user actually classified this session — so Analytics built on top is
// honest, not invented.

import { HistoryItem, RouteResult } from "@/types/ticket";

const KEY = "ticket-history";
const MAX_ITEMS = 50;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return []; // guard during server render
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

// Save every ticket found in one message as its own history item, so History
// and Analytics count tickets (not messages). `processingMs` is the request
// round-trip measured in the browser; we tag each ticket from this message
// with it so Analytics can show an average response time.
export function addClassification(
  fallbackText: string,
  tickets: RouteResult[],
  processingMs: number | null,
): HistoryItem[] {
  const now = Date.now();

  const items: HistoryItem[] = tickets.map((ticket, i) => ({
    id: `${now}-${i}-${Math.random().toString(36).slice(2, 8)}`,
    text: ticket.text ?? fallbackText,
    result: {
      ...ticket,
      processing_time_ms: processingMs,
    },
    at: now,
  }));

  const next = [...items, ...loadHistory()].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): HistoryItem[] {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  return [];
}

// "2m ago" style relative time.
export function timeAgo(epoch: number): string {
  const s = Math.floor((Date.now() - epoch) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
