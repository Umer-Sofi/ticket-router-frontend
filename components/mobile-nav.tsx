"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, History, BarChart3 } from "lucide-react";

// Shown only below the `lg` breakpoint, where the sidebar is hidden. Keeps
// Dashboard / History / Analytics reachable on phones and tablets.
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "History", icon: History, href: "/history" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Ticket Router
        </span>
      </Link>

      <nav className="ml-auto flex gap-1">
        {NAV.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
