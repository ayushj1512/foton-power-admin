"use client";

import { BadgeCheck, PackageCheck, RefreshCw } from "lucide-react";

export default function ShiprocketBookedPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500">Booked Orders</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Shiprocket Booked Shipments
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Successfully booked shipments with AWB, courier details, and pickup progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">Booked</p>
            <PackageCheck className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            —
          </h3>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">AWB Assigned</p>
            <BadgeCheck className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            —
          </h3>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">Pickup Pending</p>
            <RefreshCw className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            —
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Booked shipment table goes here
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Add booked orders list with columns like order number, AWB, courier, status, booked at, and sync action.
        </p>
      </div>
    </div>
  );
}