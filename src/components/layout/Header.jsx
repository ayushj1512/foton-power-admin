"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center rounded-[28px] bg-white px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          
          {/* left - menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="absolute left-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 lg:hidden"
          >
            <Menu size={19} />
          </button>

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
            className="absolute right-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-black hover:text-white"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}