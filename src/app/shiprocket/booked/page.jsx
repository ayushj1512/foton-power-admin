"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Package,
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

function ShipmentCard({ order, syncing, onSync, syncError, syncSuccess }) {
  const shipment = order?.shipment || {};
  const sr = shipment?.shiprocket || {};

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-zinc-100">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-950">
              Order #{order?.orderNumber || "—"}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              booked
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            {order?.customer?.fullName || "Customer"} • {order?.customer?.phone || "—"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              Courier: {shipment?.courierName || sr?.courierCompanyName || "—"}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              AWB: {shipment?.awbNumber || "—"}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              Shipment ID: {sr?.shipmentId || "—"}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              Status: {shipment?.status || "—"}
            </span>
          </div>

          {syncError ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-3 py-3 text-sm text-red-700 ring-1 ring-red-100">
              {syncError}
            </div>
          ) : null}

          {syncSuccess ? (
            <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
              {syncSuccess}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onSync(order?._id)}
          disabled={syncing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {syncing ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <RefreshCcw size={15} />
          )}
          Sync tracking
        </button>
      </div>
    </div>
  );
}

export default function ShiprocketBookedPage() {
  const [search, setSearch] = useState("");

  const orders = useAdminOrderStore((state) => state.orders);
  const isFetchingOrders = useAdminOrderStore((state) => state.isFetchingOrders);
  const fetchOrders = useAdminOrderStore((state) => state.fetchOrders);

  const syncTracking = useAdminShiprocketStore((state) => state.syncTracking);
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

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (Array.isArray(orders) ? orders : [])
      .filter((order) => order?.shipment?.shiprocket?.isBooked)
      .filter((order) => {
        if (!q) return true;

        const haystack = [
          order?.orderNumber,
          order?.customer?.fullName,
          order?.customer?.phone,
          order?.shipment?.awbNumber,
          order?.shipment?.courierName,
          order?.shipment?.shiprocket?.shipmentId,
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
                Booked shipments
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Already booked Shiprocket orders with AWB and courier info.
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
                placeholder="Search order, AWB, courier..."
                className="h-11 w-full rounded-2xl border-0 bg-zinc-100 pl-11 pr-4 text-sm outline-none ring-1 ring-zinc-100 placeholder:text-zinc-400 focus:bg-white focus:ring-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Booked" value={filteredOrders.length} icon={Package} />
          <StatCard
            label="With AWB"
            value={filteredOrders.filter((o) => o?.shipment?.awbNumber).length}
            icon={Truck}
          />
          <StatCard
            label="Ready to sync"
            value={filteredOrders.filter((o) => o?.shipment?.shiprocket?.shipmentId || o?.shipment?.awbNumber).length}
            icon={CheckCircle2}
          />
        </div>

        {isFetchingOrders ? (
          <div className="flex items-center gap-2 rounded-[24px] bg-white px-4 py-5 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            <Loader2 size={16} className="animate-spin" />
            Loading booked shipments...
          </div>
        ) : filteredOrders.length ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <ShipmentCard
                key={order?._id}
                order={order}
                syncing={getOrderLoading(order?._id)}
                syncError={getOrderError(order?._id)}
                syncSuccess={getOrderSuccess(order?._id)}
                onSync={syncTracking}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white px-4 py-10 text-center text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            No booked shipments found.
          </div>
        )}
      </div>
    </div>
  );
}