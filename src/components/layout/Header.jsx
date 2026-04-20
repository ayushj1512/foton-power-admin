"use client";

import { Bell, Menu, Search, ShieldCheck } from "lucide-react";

export default function AdminHeader({
  title = "Admin Panel",
  subtitle = "Manage your business smoothly",
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* left */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white text-black transition hover:border-blue-900/20 hover:bg-blue-900/5 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-900/10 bg-blue-900/5 px-3 py-1 text-xs font-medium text-blue-900">
              <ShieldCheck size={14} />
              FOTON POWER
            </div>

            <h1 className="mt-2 text-xl font-semibold tracking-tight text-black sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-black/55">{subtitle}</p>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[260px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="h-11 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm text-black outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
            />
          </div>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white text-black transition hover:border-green-700/20 hover:bg-green-700/5"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-green-600" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black px-3 py-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-900 text-sm font-semibold">
              FP
            </div>
            <div>
              <p className="text-sm font-medium">FOTON POWER</p>
              <p className="text-xs text-white/60">Admin Access</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}