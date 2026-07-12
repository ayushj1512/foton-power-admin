"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";

export default function AdminHeader({ onMenuClick, showMenuButton = true }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="px-3 py-3 sm:px-4 lg:px-6">
        <div className="relative flex min-h-[64px] items-center justify-center rounded-[22px] border border-black/5 bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:px-5">
          {/* left - menu */}
          {showMenuButton ? (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 lg:hidden sm:left-4"
            >
              <Menu size={19} />
            </button>
          ) : null}

          {/* center - logo */}
          <div className="flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dcayfmx5m/image/upload/v1776766054/foton_media/general/inw1dbyxy600odvgdqfv.jpg"
              alt="FOTON POWER"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* right - profile */}
          <Link
            href="/profile"
            aria-label="Open profile"
            className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-zinc-50 text-zinc-700 transition hover:bg-black hover:text-white sm:right-4"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
