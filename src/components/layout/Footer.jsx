"use client";

import { Heart, ShieldCheck } from "lucide-react";

export default function AdminFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="flex flex-col gap-3 px-4 py-4 text-sm text-black/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="font-medium text-black">FOTON POWER</p>
            <p className="text-xs text-black/50">
              Admin panel for smooth business operations
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span>© {new Date().getFullYear()} FOTON POWER</span>
          <span className="text-black/25">•</span>
          <span>Built with precision</span>
          <span className="text-black/25">•</span>
          <span className="inline-flex items-center gap-1">
            Powered with <Heart size={14} className="fill-current text-green-700" /> strength
          </span>
        </div>
      </div>
    </footer>
  );
}