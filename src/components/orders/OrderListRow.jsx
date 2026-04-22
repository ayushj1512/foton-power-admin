"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Loader2,
  Package2,
  RefreshCcw,
  Save,
  Square,
  Truck,
} from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

const ORDER_STATUS_OPTIONS = [
  "processing",
  "packed",
  "picked",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
  "rto",
  "failed",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function StatusBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium capitalize text-black/70">
      {String(value || "—").replaceAll("_", " ")}
    </span>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-black">{value || "—"}</p>
    </div>
  );
}

function SelectionButton({ checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.04] text-black transition hover:bg-black/[0.07]"
    >
      {checked ? (
        <CheckSquare className="h-4 w-4" />
      ) : (
        <Square className="h-4 w-4" />
      )}
    </button>
  );
}

export default function OrderListRow({
  order,
  selectable = false,
  selected = false,
  onToggleSelect,
}) {
  const { updateOrderStatus, isSubmitting } = useAdminOrderStore();
  const { syncTracking, getOrderLoading, getOrderError, getOrderSuccess } =
    useAdminShiprocketStore();

  const [expanded, setExpanded] = useState(false);
  const [orderStatus, setOrderStatus] = useState(
    order?.orderStatus || "processing"
  );

  const customerName = useMemo(() => {
    return (
      order?.customer?.fullName ||
      `${order?.customer?.firstName || ""} ${
        order?.customer?.lastName || ""
      }`.trim() ||
      "No name"
    );
  }, [order]);

  const shipment = order?.shipment || {};
  const shiprocket = shipment?.shiprocket || {};

  const isTrackable =
    shiprocket?.isBooked || shipment?.awbNumber || shiprocket?.shipmentId;

  const syncLoading = getOrderLoading(order?._id);
  const syncError = getOrderError(order?._id);
  const syncSuccess = getOrderSuccess(order?._id);

  const handleUpdateStatus = async () => {
    if (!order?._id || !orderStatus || orderStatus === order?.orderStatus) return;
    try {
      await updateOrderStatus(order._id, { orderStatus });
    } catch {}
  };

  const handleSyncTracking = async () => {
    if (!order?._id || !isTrackable) return;
    try {
      await syncTracking(order._id);
    } catch {}
  };

  return (
    <div className="border-b border-black/5 last:border-b-0">
      <div
        className={`grid grid-cols-1 gap-3 px-4 py-4 ${
          selectable
            ? "md:grid-cols-[56px_1.1fr_1fr_.7fr_.8fr_.75fr_1fr_auto]"
            : "md:grid-cols-[1.15fr_1fr_.7fr_.8fr_.75fr_1fr_auto]"
        } md:items-center`}
      >
        {selectable ? (
          <div>
            <SelectionButton
              checked={selected}
              onClick={() => onToggleSelect?.(order?._id)}
            />
          </div>
        ) : null}

        <div>
          <p className="text-sm font-semibold text-black">
            {order?.orderNumber || "—"}
          </p>
          <p className="mt-1 text-[11px] text-black/45">
            {formatDate(order?.createdAt)}
          </p>
        </div>

        <div>
          <p className="truncate text-sm font-medium text-black">
            {customerName}
          </p>
          <p className="mt-1 truncate text-[11px] text-black/45">
            {order?.customer?.phone || order?.customer?.email || "—"}
          </p>
        </div>

        <div>
          <StatusBadge value={order?.orderStatus} />
        </div>

        <div>
          <StatusBadge value={order?.payment?.status} />
          <p className="mt-1 text-[11px] capitalize text-black/45">
            {String(order?.payment?.method || "—").replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-black">
            {formatCurrency(order?.payableAmount)}
          </p>
          <p className="mt-1 text-[11px] text-black/45">
            {order?.totalQty || 0} item{Number(order?.totalQty || 0) > 1 ? "s" : ""}
          </p>
        </div>

        <div>
          {isTrackable ? (
            <>
              <p className="truncate text-sm font-medium text-black">
                {shipment?.courierName || shiprocket?.courierCompanyName || "Booked"}
              </p>
              <p className="mt-1 truncate text-[11px] text-black/45">
                AWB: {shipment?.awbNumber || "—"}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-black/60">Not booked</p>
              <p className="mt-1 text-[11px] text-black/45">Shiprocket unavailable</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-black/[0.04] px-3 text-xs font-medium text-black transition hover:bg-black/[0.07]"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {expanded ? "Hide" : "Details"}
          </button>

          <button
            type="button"
            disabled={!isTrackable || syncLoading}
            onClick={handleSyncTracking}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Sync
          </button>

          <Link
            href={`/orders/${order?._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-black px-3 text-xs font-medium text-white transition hover:opacity-90"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>

          <Link
            href={`/orders/invoice?orderNumber=${order?.orderNumber || ""}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
          >
            <FileText className="h-4 w-4" />
            Invoice
          </Link>
        </div>
      </div>

      {expanded ? (
        <div className="px-4 pb-4">
          <div className="rounded-2xl bg-black/[0.025] p-3 ring-1 ring-black/5">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                  Products
                </p>

                <div className="space-y-2">
                  {Array.isArray(order?.items) && order.items.length ? (
                    order.items.map((item) => (
                      <div
                        key={item?._id || `${item?.productCode}-${item?.sku}`}
                        className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-black/5"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/[0.03]">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item?.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package2 className="h-4 w-4 text-black/35" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-black">
                            {item?.name || "Product"}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-black/50">
                            <span>Code: {item?.productCode || "—"}</span>
                            <span>Qty: {item?.quantity || 0}</span>
                          </div>

                          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-black/60">
                            <span>MRP: {formatCurrency(item?.mrp)}</span>
                            <span>Price: {formatCurrency(item?.unitPayable)}</span>
                            <span>Total: {formatCurrency(item?.linePayableTotal)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-white p-3 text-sm text-black/50 ring-1 ring-black/5">
                      No items found.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    Quick Info
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoBlock label="Customer" value={customerName} />
                    <InfoBlock
                      label="Customer Code"
                      value={order?.customer?.customerCode}
                    />
                    <InfoBlock label="Phone" value={order?.customer?.phone} />
                    <InfoBlock
                      label="Coupon"
                      value={order?.coupon?.code || order?.couponCode}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    Shiprocket
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoBlock
                      label="Booked"
                      value={shiprocket?.isBooked ? "Yes" : "No"}
                    />
                    <InfoBlock
                      label="Courier"
                      value={
                        shipment?.courierName || shiprocket?.courierCompanyName
                      }
                    />
                    <InfoBlock label="AWB" value={shipment?.awbNumber} />
                    <InfoBlock label="Shipment ID" value={shiprocket?.shipmentId} />
                    <InfoBlock
                      label="SR Order ID"
                      value={shiprocket?.shiprocketOrderId}
                    />
                    <InfoBlock
                      label="Tracking Status"
                      value={shipment?.status}
                    />
                  </div>

                  {shiprocket?.lastError ? (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-3 text-sm text-red-600 ring-1 ring-red-100">
                      {shiprocket.lastError}
                    </div>
                  ) : null}

                  {syncError ? (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-3 text-sm text-red-600 ring-1 ring-red-100">
                      {syncError}
                    </div>
                  ) : null}

                  {syncSuccess ? (
                    <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                      {syncSuccess}
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={!isTrackable || syncLoading}
                      onClick={handleSyncTracking}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {syncLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Truck className="h-4 w-4" />
                      )}
                      Sync Tracking
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    Update Status
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="h-10 flex-1 rounded-xl bg-[#f7f7f7] px-3 text-sm text-black outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/12"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isSubmitting || orderStatus === order?.orderStatus}
                      onClick={handleUpdateStatus}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Updating..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    Delivery Address
                  </p>
                  <p className="text-sm leading-6 text-black/65">
                    {[
                      order?.shippingAddress?.fullName,
                      order?.shippingAddress?.addressLine1,
                      order?.shippingAddress?.addressLine2,
                      order?.shippingAddress?.city,
                      order?.shippingAddress?.state,
                      order?.shippingAddress?.pincode,
                      order?.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}