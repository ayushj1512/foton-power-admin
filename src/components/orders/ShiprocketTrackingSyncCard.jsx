"use client";

import { useMemo, useState } from "react";
import {
  RefreshCcw,
  Truck,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Clock3,
} from "lucide-react";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";
import { useAdminOrderStore } from "@/store/adminOrderStore";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getStatusTone = (status = "") => {
  const normalized = String(status || "").toLowerCase();

  if (
    ["delivered", "shipment_delivered", "completed"].includes(normalized)
  ) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }

  if (
    ["shipped", "in_transit", "out_for_delivery", "ofd", "pickup_scheduled"].includes(
      normalized
    )
  ) {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }

  if (
    ["cancelled", "canceled", "failed", "undelivered", "rto"].includes(
      normalized
    )
  ) {
    return "bg-red-50 text-red-700 ring-1 ring-red-100";
  }

  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200";
};

const getLatestTrackingEvent = (tracking) => {
  if (!tracking) return null;

  const candidates = [
    ...(Array.isArray(tracking?.tracking_data?.shipment_track)
      ? tracking.tracking_data.shipment_track
      : []),
    ...(Array.isArray(tracking?.shipment_track) ? tracking.shipment_track : []),
    ...(Array.isArray(tracking?.activities) ? tracking.activities : []),
    ...(Array.isArray(tracking?.history) ? tracking.history : []),
  ];

  if (!candidates.length) return null;

  return candidates[0];
};

export default function ShiprocketTrackingSyncCard({
  order,
  className = "",
  onSynced,
}) {
  const [localError, setLocalError] = useState("");

  const syncTracking = useAdminShiprocketStore((state) => state.syncTracking);
  const getTracking = useAdminShiprocketStore((state) => state.getTracking);
  const getOrderError = useAdminShiprocketStore((state) => state.getOrderError);
  const getOrderSuccess = useAdminShiprocketStore(
    (state) => state.getOrderSuccess
  );
  const trackingLoadingByOrder = useAdminShiprocketStore(
    (state) => state.trackingLoadingByOrder
  );

  const setOrder = useAdminOrderStore((state) => state.setOrder);

  const orderId = order?._id;
  const syncing = Boolean(trackingLoadingByOrder?.[orderId]);

  const storeTracking = orderId ? getTracking(orderId) : null;
  const shiprocketShipment = order?.shipment?.shiprocket || {};
  const existingTracking =
    order?.shipment?.tracking ||
    shiprocketShipment?.tracking ||
    shiprocketShipment?.trackingData ||
    null;

  const tracking = storeTracking || existingTracking || null;

  const storeError = orderId ? getOrderError(orderId) : "";
  const storeSuccess = orderId ? getOrderSuccess(orderId) : "";

  const awb =
    shiprocketShipment?.awb_code ||
    shiprocketShipment?.awb ||
    tracking?.awb_code ||
    tracking?.awb ||
    order?.shipment?.awb ||
    "—";

  const courier =
    shiprocketShipment?.courier_name ||
    shiprocketShipment?.courier ||
    tracking?.courier_name ||
    tracking?.courier ||
    order?.shipment?.courier ||
    "—";

  const trackingUrl =
    shiprocketShipment?.tracking_url ||
    tracking?.tracking_url ||
    tracking?.trackingLink ||
    order?.shipment?.trackingUrl ||
    "";

  const currentStatus =
    tracking?.current_status ||
    tracking?.status ||
    shiprocketShipment?.current_status ||
    order?.shipment?.status ||
    order?.fulfillmentStatus ||
    "Not synced";

  const latestEvent = useMemo(
    () => getLatestTrackingEvent(tracking),
    [tracking]
  );

  const latestLocation =
    latestEvent?.location ||
    latestEvent?.current_location ||
    latestEvent?.city ||
    latestEvent?.scan_location ||
    "—";

  const latestActivity =
    latestEvent?.activity ||
    latestEvent?.status ||
    latestEvent?.sr_status ||
    latestEvent?.remark ||
    currentStatus;

  const latestTime =
    latestEvent?.date ||
    latestEvent?.event_time ||
    latestEvent?.scan_date ||
    latestEvent?.created_at ||
    tracking?.updated_at ||
    shiprocketShipment?.updatedAt ||
    order?.updatedAt;

  const handleSync = async () => {
    if (!orderId) return;

    setLocalError("");

    try {
      const response = await syncTracking(orderId);

      const updatedOrder =
        response?.order ||
        response?.data?.order ||
        null;

      if (updatedOrder) {
        setOrder(updatedOrder);
        onSynced?.(updatedOrder, response);
      } else {
        onSynced?.(null, response);
      }
    } catch (error) {
      setLocalError(error?.message || "Failed to sync tracking");
    }
  };

  const showShipmentInfo =
    awb !== "—" || courier !== "—" || trackingUrl || tracking || shiprocketShipment;

  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
              <Truck size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900 sm:text-base">
                Shiprocket Tracking
              </h3>
              <p className="text-xs text-zinc-500 sm:text-sm">
                Sync latest tracking and shipment movement
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
              getStatusTone(currentStatus)
            )}
          >
            {currentStatus || "Not synced"}
          </span>

          <button
            type="button"
            onClick={handleSync}
            disabled={!orderId || syncing}
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              size={14}
              className={syncing ? "animate-spin" : ""}
            />
            {syncing ? "Syncing..." : "Sync Tracking"}
          </button>
        </div>
      </div>

      {(storeError || localError) && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{storeError || localError}</span>
        </div>
      )}

      {storeSuccess && !storeError && !localError && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{storeSuccess}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            AWB Number
          </p>
          <p className="mt-1 break-words text-sm font-semibold text-zinc-900">
            {awb}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Courier
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {courier}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Tracking Link
          </p>

          {trackingUrl ? (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 underline underline-offset-4"
            >
              Open Tracking
              <ExternalLink size={14} />
            </a>
          ) : (
            <p className="mt-1 text-sm font-semibold text-zinc-900">—</p>
          )}
        </div>
      </div>

      {showShipmentInfo && (
        <div className="mt-4 rounded-[24px] bg-zinc-50 p-4">
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-zinc-700" />
            <p className="text-sm font-semibold text-zinc-900">
              Latest Movement
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-zinc-100">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                Activity
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {latestActivity || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-zinc-100">
              <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                <MapPin size={12} />
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {latestLocation || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-zinc-100">
              <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                <Clock3 size={12} />
                Updated At
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {formatDateTime(latestTime)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}