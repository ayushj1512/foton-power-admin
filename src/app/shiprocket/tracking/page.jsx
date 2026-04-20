"use client";

import { useState } from "react";
import { Loader2, MapPinned, RefreshCw } from "lucide-react";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

export default function ShiprocketTrackingPage() {
  const { syncTracking, trackingLoading, tracking, error, clearShiprocketError } =
    useAdminShiprocketStore();

  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    try {
      clearShiprocketError();
      setMessage("");
      const res = await syncTracking(orderId);
      setMessage(res?.message || "Tracking synced successfully");
    } catch {}
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500">Tracking Control</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Shiprocket Tracking
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Sync shipment tracking by order ID and inspect current response payload.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="flex-1 rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />

          <button
            onClick={handleSync}
            disabled={!orderId || trackingLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            {trackingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync Tracking
          </button>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Tracking Response
          </h2>
        </div>

        <pre className="overflow-auto rounded-2xl bg-neutral-950 p-4 text-xs text-neutral-100">
{JSON.stringify(tracking || { message: "No tracking data yet" }, null, 2)}
        </pre>
      </div>
    </div>
  );
}