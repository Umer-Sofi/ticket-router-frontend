// Shared category metadata: a color per category (used by the analytics donut
// and legend) plus a helper that computes the real distribution from history.

import { Category, HistoryItem } from "@/types/ticket";

export const CATEGORY_COLOR: Record<Category, string> = {
  Billing: "#6366f1", // indigo
  Security: "#ef4444", // red
  Account: "#f59e0b", // amber
  Technical: "#0ea5e9", // sky
  "Feature Request": "#10b981", // emerald
  General: "#a1a1aa", // zinc
};

export interface CategorySlice {
  category: Category;
  count: number;
  pct: number; // 0..100
  color: string;
}

// Count tickets per category from real history, sorted most-common first.
export function categoryDistribution(history: HistoryItem[]): CategorySlice[] {
  const counts = new Map<Category, number>();
  for (const item of history) {
    const c = item.result.category;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const total = history.length || 1;
  return [...counts.entries()]
    .map(([category, count]) => ({
      category,
      count,
      pct: Math.round((count / total) * 100),
      color: CATEGORY_COLOR[category],
    }))
    .sort((a, b) => b.count - a.count);
}
