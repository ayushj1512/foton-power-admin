"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Search,
  Wrench,
  XCircle,
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

export default function ShiprocketFailedPage() {
  const [search, setSearch] = useState("");

  const orders = useAdminOrderStore((state) => state.orders);
  const isFetchingOrders = useAdminOrderStore((state) => state.isFetchingOrders);
  const fetchOrders = useAdminOrderStore((state) => state.fetchOrders);

  const autoBookOrder = useAdminShiprocketStore((state) => state.autoBookOrder);
  const getOrderLoading = useAdminShiprocketStore((state) => state.getOrderLoading);
  const getOrderError = useAdminShiprocketStore((state) => state.getOrderError);
  const getOrderSuccess = useAdminShiprocketStore((state) => state.getOrderSuccess);

  useEffect(() => {
    fetchOrders({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    }).catch(() => {});
  }, [fetchOrders]);

  const failedOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (Array.isArray(orders) ? orders : [])
      .filter((order) => {
        const sr = order?.shipment?.shiprocket || {};
        return Boolean(sr?.lastError) || order?.orderStatus === "failed";
      })
      .filter((order) => {
        if (!q) return true;
        const haystack = [
          order?.orderNumber,
          order?.customer?.fullName,
          order?.customer?.phone,
          order?.shipment?.shiprocket?.lastError,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
  }, [orders, search]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Shiprocket
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Failed shipments
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Retry booking for failed or skipped Shiprocket cases.
              </p>
            </div>

            <div className="relative w-full lg:w-[340px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search failed orders..."
                className="h-11 w-full rounded-2xl border-0 bg-zinc-100 pl-11 pr-4 text-sm outline-none ring-1 ring-zinc-100 placeholder:text-zinc-400 focus:bg-white focus:ring-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Failed count" value={failedOrders.length} icon={XCircle} />
          <StatCard
            label="Retry eligible"
            value={failedOrders.filter((o) => !o?.shipment?.shiprocket?.isBooked).length}
            icon={RefreshCcw}
          />
          <StatCard label="Ops fixes" value={failedOrders.length} icon={Wrench} />
        </div>

        {isFetchingOrders ? (
          <div className="flex items-center gap-2 rounded-[24px] bg-white px-4 py-5 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            <Loader2 size={16} className="animate-spin" />
            Loading failed shipments...
          </div>
        ) : failedOrders.length ? (
          <div className="space-y-4">
            {failedOrders.map((order) => {
              const orderId = order?._id;
              const lastError =
                order?.shipment?.shiprocket?.lastError || "Booking failed or was skipped.";

              return (
                <div
                  key={orderId}
                  className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-950">
                          Order #{order?.orderNumber || "—"}
                        </h3>
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
                          failed
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-zinc-500">
                        {order?.customer?.fullName || "Customer"} • {order?.customer?.phone || "—"}
                      </p>

                      <div className="mt-3 rounded-2xl bg-red-50 px-3 py-3 text-sm text-red-700 ring-1 ring-red-100">
                        {lastError}
                      </div>

                      {getOrderError(orderId) ? (
                        <div className="mt-3 rounded-2xl bg-red-50 px-3 py-3 text-sm text-red-700 ring-1 ring-red-100">
                          {getOrderError(orderId)}
                        </div>
                      ) : null}

                      {getOrderSuccess(orderId) ? (
                        <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                          {getOrderSuccess(orderId)}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      disabled={getOrderLoading(orderId)}
                      onClick={() =>
                        autoBookOrder(orderId, {
                          pickupPincode: "110034",
                          pickupLocation: "Akshat",
                          weight: 0.5,
                          length: 10,
                          breadth: 10,
                          height: 10,
                          strategy: "cheapest",
                        })
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
                    >
                      {getOrderLoading(orderId) ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <AlertTriangle size={15} />
                      )}
                      Retry booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white px-4 py-10 text-center text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            No failed shipments found.
          </div>
        )}
      </div>
    </div>
  );
}