"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, History, BarChart3, BookOpen } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Each item is a real route now (except API Docs, which opens the backend).
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "History", icon: History, href: "/history" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      {/* Brand */}
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Zap className="h-5 w-5" />
        </div>
        <div className="text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          Smart Ticket
          <br />
          Router
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
        <a
          href={`${API_URL}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <BookOpen className="h-4 w-4" />
          API Docs
        </a>
      </nav>

      {/* Footer badge */}
      <div className="mt-auto rounded-lg border border-zinc-200 p-3 text-xs dark:border-zinc-800">
        <div className="text-zinc-500">AI Model</div>
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
          gpt-4o-mini
        </div>
        <div className="mt-1 text-zinc-500">Temperature: 0</div>
      </div>
    </aside>
  );
}
