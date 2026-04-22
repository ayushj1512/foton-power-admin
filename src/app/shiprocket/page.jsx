"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-zinc-900 break-all">
        {value || "—"}
      </span>
    </div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-100">
      <div className="mb-2 flex items-center gap-2 text-zinc-500">
        <Icon size={15} />
        <span className="text-xs font-medium uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <div className="text-base font-semibold text-zinc-950">{value || "—"}</div>
    </div>
  );
}

export default function ShiprocketPage() {
  const {
    pickupLocations,
    pickupLoading,
    pickupError,
    fetchPickupLocations,

    checkServiceability,
    autoBookOrder,
    manualBookOrder,
    syncTracking,

    getSelectedCourier,
    getServiceability,
    getTracking,
    getBookingResult,
    getOrderLoading,
    getOrderError,
    getOrderSuccess,
    clearOrderState,
  } = useAdminShiprocketStore();

  const [orderId, setOrderId] = useState("");
  const [pickupPincode, setPickupPincode] = useState("110034");
  const [pickupLocation, setPickupLocation] = useState("Akshat");
  const [weight, setWeight] = useState("0.5");
  const [length, setLength] = useState("10");
  const [breadth, setBreadth] = useState("10");
  const [height, setHeight] = useState("10");
  const [strategy, setStrategy] = useState("cheapest");

  const [manualShipmentId, setManualShipmentId] = useState("");
  const [manualCourierCompanyId, setManualCourierCompanyId] = useState("");
  const [requestPickup, setRequestPickup] = useState(true);

  useEffect(() => {
    fetchPickupLocations().catch(() => {});
  }, [fetchPickupLocations]);

  const currentOrderId = orderId.trim();
  const selectedCourier = getSelectedCourier(currentOrderId);
  const serviceability = getServiceability(currentOrderId);
  const tracking = getTracking(currentOrderId);
  const bookingResult = getBookingResult(currentOrderId);
  const orderLoading = getOrderLoading(currentOrderId);
  const orderError = getOrderError(currentOrderId);
  const orderSuccess = getOrderSuccess(currentOrderId);

  const courierList = useMemo(() => {
    return serviceability?.data?.available_courier_companies || [];
  }, [serviceability]);

  const bookingOrder = bookingResult?.order || null;
  const shipment = bookingOrder?.shipment || {};

  const basePayload = useMemo(
    () => ({
      pickupPincode,
      pickupLocation,
      weight: Number(weight || 0.5),
      length: Number(length || 10),
      breadth: Number(breadth || 10),
      height: Number(height || 10),
      strategy,
    }),
    [pickupPincode, pickupLocation, weight, length, breadth, height, strategy]
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-none flex-col gap-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
                  <ShieldCheck size={14} />
                  Shiprocket Admin
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  Shipment operations
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Check serviceability, book manually if skipped, and sync tracking cleanly.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
                <StatPill
                  icon={MapPin}
                  label="Pickup locations"
                  value={pickupLocations?.length || 0}
                />
                <StatPill
                  icon={Truck}
                  label="Selected courier"
                  value={selectedCourier?.courier_name || "Not selected"}
                />
                <StatPill
                  icon={Package}
                  label="AWB"
                  value={shipment?.awbNumber || "Not synced"}
                />
                <StatPill
                  icon={RefreshCcw}
                  label="Tracking"
                  value={tracking ? "Available" : "Not synced"}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                    <Search size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">
                      Order actions
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Use one order at a time and trigger Shiprocket actions.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Order ID
                    </label>
                    <input
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter Mongo order id"
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-100 placeholder:text-zinc-400 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Pickup pincode
                    </label>
                    <input
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Pickup location
                    </label>
                    <input
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Weight
                    </label>
                    <input
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Length
                    </label>
                    <input
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Breadth
                    </label>
                    <input
                      value={breadth}
                      onChange={(e) => setBreadth(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Height
                    </label>
                    <input
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Strategy
                    </label>
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    >
                      <option value="cheapest">Cheapest</option>
                      <option value="fastest">Fastest</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!currentOrderId || orderLoading}
                    onClick={() => checkServiceability(currentOrderId, basePayload)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {orderLoading ? <Loader2 size={16} className="animate-spin" /> : "Check serviceability"}
                  </button>

                  <button
                    type="button"
                    disabled={!currentOrderId || orderLoading}
                    onClick={() => autoBookOrder(currentOrderId, basePayload)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Auto book
                  </button>

                  <button
                    type="button"
                    disabled={!currentOrderId || orderLoading}
                    onClick={() => syncTracking(currentOrderId)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Sync tracking
                  </button>

                  <button
                    type="button"
                    disabled={!currentOrderId}
                    onClick={() => clearOrderState(currentOrderId)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-50"
                  >
                    Clear
                  </button>
                </div>

                {!!orderError && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                    <XCircle size={16} className="mt-0.5" />
                    <span>{orderError}</span>
                  </div>
                )}

                {!!orderSuccess && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 size={16} className="mt-0.5" />
                    <span>{orderSuccess}</span>
                  </div>
                )}
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">
                      Manual booking fallback
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Use this if booking was skipped but shipment already exists.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Shipment ID
                    </label>
                    <input
                      value={manualShipmentId}
                      onChange={(e) => setManualShipmentId(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Courier company ID
                    </label>
                    <input
                      value={manualCourierCompanyId}
                      onChange={(e) => setManualCourierCompanyId(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 focus:bg-white focus:ring-zinc-200"
                    />
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={requestPickup}
                    onChange={(e) => setRequestPickup(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  Request pickup as well
                </label>

                <div className="mt-5">
                  <button
                    type="button"
                    disabled={!currentOrderId || orderLoading}
                    onClick={() =>
                      manualBookOrder(currentOrderId, {
                        shipment_id: manualShipmentId,
                        courier_company_id: manualCourierCompanyId,
                        request_pickup: requestPickup,
                      })
                    }
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Manual book shipment
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Serviceability result
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Recommended courier and available options.
                  </p>
                </div>

                {courierList.length > 0 ? (
                  <div className="space-y-3">
                    {courierList.slice(0, 8).map((courier) => {
                      const active =
                        selectedCourier?.courier_company_id ===
                        courier?.courier_company_id;

                      return (
                        <div
                          key={`${courier?.courier_company_id}-${courier?.id || courier?.courier_name}`}
                          className={`rounded-2xl px-4 py-4 ring-1 ${
                            active
                              ? "bg-zinc-950 text-white ring-zinc-950"
                              : "bg-zinc-50 text-zinc-900 ring-zinc-100"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">
                                {courier?.courier_name || "Unknown courier"}
                              </div>
                              <div
                                className={`mt-1 text-xs ${
                                  active ? "text-zinc-300" : "text-zinc-500"
                                }`}
                              >
                                ID: {courier?.courier_company_id || "—"}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                              <span
                                className={`rounded-full px-3 py-1 ${
                                  active ? "bg-white/10" : "bg-white ring-1 ring-zinc-200"
                                }`}
                              >
                                Rate: ₹{courier?.rate ?? "—"}
                              </span>
                              <span
                                className={`rounded-full px-3 py-1 ${
                                  active ? "bg-white/10" : "bg-white ring-1 ring-zinc-200"
                                }`}
                              >
                                ETA: {courier?.estimated_delivery_days || "—"} days
                              </span>
                              <span
                                className={`rounded-full px-3 py-1 ${
                                  active ? "bg-white/10" : "bg-white ring-1 ring-zinc-200"
                                }`}
                              >
                                COD: {courier?.cod ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 ring-1 ring-zinc-100">
                    No serviceability data yet.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Shipment snapshot
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Quick order-linked shipment details.
                  </p>
                </div>

                <div className="divide-y divide-zinc-100">
                  <InfoRow label="Courier" value={shipment?.courierName} />
                  <InfoRow label="AWB" value={shipment?.awbNumber} />
                  <InfoRow label="Tracking number" value={shipment?.trackingNumber} />
                  <InfoRow label="Status" value={shipment?.status} />
                  <InfoRow
                    label="Shipment ID"
                    value={bookingOrder?.shipment?.shiprocket?.shipmentId}
                  />
                  <InfoRow
                    label="Shiprocket order ID"
                    value={bookingOrder?.shipment?.shiprocket?.shiprocketOrderId}
                  />
                  <InfoRow
                    label="Courier company ID"
                    value={bookingOrder?.shipment?.shiprocket?.courierCompanyId}
                  />
                  <InfoRow
                    label="Pickup token"
                    value={bookingOrder?.shipment?.shiprocket?.pickupTokenNumber}
                  />
                  <InfoRow
                    label="Pickup scheduled"
                    value={bookingOrder?.shipment?.shiprocket?.pickupScheduledDate}
                  />
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Pickup locations
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Active pickup addresses from Shiprocket.
                  </p>
                </div>

                {pickupLoading ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-5 text-sm text-zinc-500 ring-1 ring-zinc-100">
                    <Loader2 size={16} className="animate-spin" />
                    Loading pickup locations...
                  </div>
                ) : pickupError ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-700 ring-1 ring-red-100">
                    {pickupError}
                  </div>
                ) : pickupLocations.length ? (
                  <div className="space-y-3">
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
                          {location?.address || "No address"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 ring-1 ring-zinc-100">
                    No pickup locations found.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Raw response preview
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Latest booking or tracking response for debugging.
                  </p>
                </div>

                <pre className="max-h-[520px] overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-200">
{JSON.stringify(
  tracking || bookingResult || serviceability || {},
  null,
  2
)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}