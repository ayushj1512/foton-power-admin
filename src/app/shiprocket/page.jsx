"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCw,
  Settings,
  Truck,
} from "lucide-react";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

function StatCard({ title, value, icon: Icon, href }) {
  const content = (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {value}
          </h3>
        </div>
        <div className="rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-900">
          <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
        </div>
      </div>
    </div>
  );

  if (!href) return content;

  return <Link href={href}>{content}</Link>;
}

export default function ShiprocketOverviewPage() {
  const {
    bookingResult,
    tracking,
    serviceability,
    pickupLocations,
    loading,
    error,
    fetchPickupLocations,
  } = useAdminShiprocketStore();

  const stats = useMemo(() => {
    return {
      pickupLocations: Array.isArray(pickupLocations) ? pickupLocations.length : 0,
      lastServiceability: serviceability ? 1 : 0,
      lastBooking: bookingResult ? 1 : 0,
      lastTracking: tracking ? 1 : 0,
    };
  }, [pickupLocations, serviceability, bookingResult, tracking]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Shipping Management</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Shiprocket Overview
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Manage booking, serviceability, tracking, retries, and recovery flows.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchPickupLocations}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Pickup Locations
          </button>

          <Link
            href="/shiprocket/settings"
            className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-neutral-900"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pickup Locations"
          value={stats.pickupLocations}
          icon={Truck}
          href="/shiprocket/settings"
        />
        <StatCard
          title="Pending Booking"
          value="View"
          icon={Clock3}
          href="/shiprocket/pending"
        />
        <StatCard
          title="Failed"
          value="View"
          icon={AlertTriangle}
          href="/shiprocket/failed"
        />
        <StatCard
          title="Booked"
          value="View"
          icon={PackageCheck}
          href="/shiprocket/booked"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Quick Links
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/shiprocket/pending"
              className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Pending Booking
            </Link>
            <Link
              href="/shiprocket/failed"
              className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Failed Shipments
            </Link>
            <Link
              href="/shiprocket/booked"
              className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Booked Orders
            </Link>
            <Link
              href="/shiprocket/tracking"
              className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Tracking
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Last Activity Snapshot
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Serviceability
              </p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                {serviceability ? "Available in store state" : "No serviceability action yet"}
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Booking
              </p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                {bookingResult?.message || "No booking action yet"}
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Tracking
              </p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                {tracking ? "Tracking synced recently" : "No tracking sync yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}