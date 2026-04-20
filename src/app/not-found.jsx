"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/[0.03] blur-3xl" />
        <div className="absolute left-[18%] top-[22%] h-40 w-40 rounded-full bg-black/[0.025] blur-3xl" />
        <div className="absolute bottom-[18%] right-[20%] h-52 w-52 rounded-full bg-black/[0.03] blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 flex w-full flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-black/55 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Studio Admin
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
          className="mb-7 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >
          <Camera className="h-8 w-8 text-black/75" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.35 }}
          className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.42, ease: "easeOut" }}
          className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl md:text-6xl"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.42, ease: "easeOut" }}
          className="mt-4 max-w-none text-sm leading-7 text-black/58 sm:text-base"
        >
          The page you tried to open does not exist, may have been moved,
          or is no longer available in this workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.42, ease: "easeOut" }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>

          <Link
            href="javascript:history.back()"
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-black/[0.03]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.46, duration: 0.45 }}
          className="mt-10 flex items-center gap-2 rounded-full bg-black/[0.03] px-4 py-2 text-xs text-black/45"
        >
          <Search className="h-3.5 w-3.5" />
          Check the URL or continue from the dashboard
        </motion.div>
      </motion.section>
    </main>
  );
}