"use client";

import { useEffect } from "react";
import {
  Loader2,
  MapPin,
  Settings2,
  Warehouse,
} from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-zinc-100">
      <div className="mb-2 flex items-center gap-2 text-zinc-500">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <div className="text-lg font-semibold text-zinc-950">{value}</div>
    </div>
  );
}

export default function ShiprocketSettingsPage() {
  const orders = useAdminOrderStore((state) => state.orders);
  const fetchOrders = useAdminOrderStore((state) => state.fetchOrders);

  const pickupLocations = useAdminShiprocketStore((state) => state.pickupLocations);
  const pickupLoading = useAdminShiprocketStore((state) => state.pickupLoading);
  const pickupError = useAdminShiprocketStore((state) => state.pickupError);
  const fetchPickupLocations = useAdminShiprocketStore((state) => state.fetchPickupLocations);

  useEffect(() => {
    fetchPickupLocations().catch(() => {});
    fetchOrders({
      page: 1,
      limit: 25,
      sortBy: "createdAt",
      sortOrder: "desc",
    }).catch(() => {});
  }, [fetchPickupLocations, fetchOrders]);

  const primaryLocation =
    pickupLocations.find((item) => item?.is_primary_location) || null;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Shiprocket
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pickup locations and default operational references.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pickup locations"
            value={pickupLocations.length}
            icon={Warehouse}
          />
          <StatCard
            label="Primary location"
            value={primaryLocation?.pickup_location || "Not found"}
            icon={MapPin}
          />
          <StatCard
            label="Recent orders loaded"
            value={Array.isArray(orders) ? orders.length : 0}
            icon={Settings2}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-950">
              Recommended defaults
            </h2>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Pickup location
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-950">
                  {primaryLocation?.pickup_location || "Akshat"}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Pickup pincode
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-950">
                  {primaryLocation?.pin_code || "110034"}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Default package
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-950">
                  10 × 10 × 10, 0.5 kg
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-950">
              Pickup locations
            </h2>

            {pickupLoading ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-5 text-sm text-zinc-500 ring-1 ring-zinc-100">
                <Loader2 size={16} className="animate-spin" />
                Loading pickup locations...
              </div>
            ) : pickupError ? (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-700 ring-1 ring-red-100">
                {pickupError}
              </div>
            ) : pickupLocations.length ? (
              <div className="mt-4 space-y-3">
                {pickupLocations.map((location) => (
                  <div
                    key={location?.id || location?.pickup_location}
                    className="rounded-2xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">
                          {location?.pickup_location || "Pickup location"}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {location?.name || "—"} • {location?.phone || "—"}
                        </div>
                      </div>

                      {location?.is_primary_location ? (
                        <span className="rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                          Primary
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm text-zinc-600">
                      {location?.address || "No address available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
                No pickup locations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}