// A small, reusable component. Takes one prop (priority) and renders a
// colored pill with a status dot. Color communicates urgency at a glance.

import { Priority } from "@/types/ticket";

const STYLES: Record<Priority, { pill: string; dot: string }> = {
  High: {
    pill: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-400/20",
    dot: "bg-red-500",
  },
  Medium: {
    pill: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20",
    dot: "bg-amber-500",
  },
  Low: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/20",
    dot: "bg-emerald-500",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const s = STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {priority}
    </span>
  );
}
