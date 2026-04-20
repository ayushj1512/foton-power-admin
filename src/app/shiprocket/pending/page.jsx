"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Search, Truck } from "lucide-react";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";

export default function ShiprocketPendingPage() {
  const {
    loading,
    bookingLoading,
    error,
    checkServiceability,
    autoBookOrder,
    clearShiprocketError,
  } = useAdminShiprocketStore();

  const [orderId, setOrderId] = useState("");
  const [pickupPincode, setPickupPincode] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Primary");
  const [weight, setWeight] = useState("0.5");
  const [length, setLength] = useState("10");
  const [breadth, setBreadth] = useState("10");
  const [height, setHeight] = useState("10");
  const [strategy, setStrategy] = useState("cheapest");
  const [message, setMessage] = useState("");

  const payload = {
    pickupPincode,
    pickupLocation,
    weight: Number(weight),
    length: Number(length),
    breadth: Number(breadth),
    height: Number(height),
    strategy,
  };

  const handleCheck = async () => {
    try {
      clearShiprocketError();
      setMessage("");
      const res = await checkServiceability(orderId, payload);
      setMessage(res?.message || "Serviceability checked successfully");
    } catch {}
  };

  const handleAutoBook = async () => {
    try {
      clearShiprocketError();
      setMessage("");
      const res = await autoBookOrder(orderId, payload);
      setMessage(res?.message || "Order booked successfully");
    } catch {}
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500">Recovery Flow</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Pending Shiprocket Booking
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Use this page to check serviceability and book any order that did not reach Shiprocket.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={pickupPincode}
            onChange={(e) => setPickupPincode(e.target.value)}
            placeholder="Pickup Pincode"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Pickup Location"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          >
            <option value="cheapest">Cheapest</option>
            <option value="fastest">Fastest</option>
          </select>

          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Length"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={breadth}
            onChange={(e) => setBreadth(e.target.value)}
            placeholder="Breadth"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleCheck}
            disabled={!orderId || !pickupPincode || loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Check Serviceability
          </button>

          <button
            onClick={handleAutoBook}
            disabled={!orderId || !pickupPincode || bookingLoading}
            className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            {bookingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Truck className="h-4 w-4" />
            )}
            Auto Book Order
          </button>

          <button
            onClick={() => {
              setOrderId("");
              setPickupPincode("");
              setPickupLocation("Primary");
              setWeight("0.5");
              setLength("10");
              setBreadth("10");
              setHeight("10");
              setStrategy("cheapest");
              setMessage("");
              clearShiprocketError();
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
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
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Recommended usage
        </h2>
        <div className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p>1. Enter order ID and pickup pincode.</p>
          <p>2. Run serviceability first.</p>
          <p>3. If valid, auto book the shipment.</p>
          <p>4. If auto booking fails, use manual booking from order detail page.</p>
        </div>
      </div>
    </div>
  );
}