"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  MapPinned,
  RefreshCcw,
  Search,
  Truck,
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

export default function ShiprocketTrackingPage() {
  const [search, setSearch] = useState("");
  const [activeOrderId, setActiveOrderId] = useState("");

  const orders = useAdminOrderStore((state) => state.orders);
  const isFetchingOrders = useAdminOrderStore((state) => state.isFetchingOrders);
  const fetchOrders = useAdminOrderStore((state) => state.fetchOrders);

  const syncTracking = useAdminShiprocketStore((state) => state.syncTracking);
  const getTracking = useAdminShiprocketStore((state) => state.getTracking);
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

  const trackableOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (Array.isArray(orders) ? orders : [])
      .filter((order) => order?.shipment?.shiprocket?.isBooked || order?.shipment?.awbNumber)
      .filter((order) => {
        if (!q) return true;

        const haystack = [
          order?.orderNumber,
          order?.customer?.fullName,
          order?.customer?.phone,
          order?.shipment?.awbNumber,
          order?.shipment?.shiprocket?.shipmentId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
  }, [orders, search]);

  const activeTracking = getTracking(activeOrderId);
  const shipmentTrack = activeTracking?.tracking_data?.shipment_track || [];

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
                Tracking sync
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Sync and inspect tracking details for booked orders.
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
                placeholder="Search order, AWB, shipment id..."
                className="h-11 w-full rounded-2xl border-0 bg-zinc-100 pl-11 pr-4 text-sm outline-none ring-1 ring-zinc-100 placeholder:text-zinc-400 focus:bg-white focus:ring-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Trackable" value={trackableOrders.length} icon={Truck} />
          <StatCard label="Timeline events" value={shipmentTrack.length} icon={MapPinned} />
          <StatCard label="Selected" value={activeOrderId ? "Yes" : "No"} icon={RefreshCcw} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-950">Orders</h2>

            {isFetchingOrders ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-5 text-sm text-zinc-500 ring-1 ring-zinc-100">
                <Loader2 size={16} className="animate-spin" />
                Loading orders...
              </div>
            ) : trackableOrders.length ? (
              <div className="mt-4 space-y-3">
                {trackableOrders.map((order) => {
                  const active = activeOrderId === order?._id;

                  return (
                    <button
                      key={order?._id}
                      type="button"
                      onClick={() => setActiveOrderId(order?._id)}
                      className={`w-full rounded-2xl px-4 py-4 text-left transition ring-1 ${
                        active
                          ? "bg-zinc-950 text-white ring-zinc-950"
                          : "bg-zinc-50 text-zinc-900 ring-zinc-100 hover:bg-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        Order #{order?.orderNumber || "—"}
                      </div>
                      <div className={`mt-1 text-xs ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                        {order?.customer?.fullName || "Customer"} • AWB {order?.shipment?.awbNumber || "—"}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
                No trackable orders found.
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Tracking details
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Select an order and sync latest tracking.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!activeOrderId || getOrderLoading(activeOrderId)}
                  onClick={() => syncTracking(activeOrderId)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
                >
                  {getOrderLoading(activeOrderId) ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <RefreshCcw size={15} />
                  )}
                  Sync
                </button>
              </div>

              {activeOrderId && getOrderError(activeOrderId) ? (
                <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                  {getOrderError(activeOrderId)}
                </div>
              ) : null}

              {activeOrderId && getOrderSuccess(activeOrderId) ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                  {getOrderSuccess(activeOrderId)}
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                <pre className="max-h-[360px] overflow-auto text-xs leading-6 text-zinc-700">
{JSON.stringify(activeTracking || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
              <h2 className="text-lg font-semibold text-zinc-950">
                Tracking timeline
              </h2>

              {shipmentTrack.length ? (
                <div className="mt-4 space-y-3">
                  {shipmentTrack.map((event, index) => (
                    <div
                      key={`${event?.date || index}-${event?.current_status || "event"}`}
                      className="rounded-2xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100"
                    >
                      <div className="text-sm font-semibold text-zinc-950">
                        {event?.current_status || "Status update"}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {event?.date || "—"}
                      </div>
                      <div className="mt-2 text-sm text-zinc-600">
                        {event?.location || "Location unavailable"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
                  No tracking events yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}