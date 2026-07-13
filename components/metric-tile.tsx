import { LucideIcon } from "lucide-react";

// A tiny stat tile: icon + label + value. Reused across the result panel.
export function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}
