"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ShiprocketFailedPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500">Exception Queue</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Failed Shiprocket Bookings
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Orders that failed during booking, AWB assignment, or pickup flow should appear here.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          <AlertTriangle className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Failed list scaffold ready
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Backend filter can power this page using orders where
          <span className="mx-1 font-medium text-neutral-900 dark:text-neutral-100">
            shipment.shiprocket.lastError
          </span>
          is present.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shiprocket/pending"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <RotateCcw className="h-4 w-4" />
            Go to Pending Recovery
          </Link>
        </div>
      </div>
    </div>
  );
}