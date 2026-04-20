"use client";

import { useState } from "react";
import { Save, Settings2 } from "lucide-react";

export default function ShiprocketSettingsPage() {
  const [pickupLocation, setPickupLocation] = useState("Primary");
  const [pickupPincode, setPickupPincode] = useState("");
  const [weight, setWeight] = useState("0.5");
  const [length, setLength] = useState("10");
  const [breadth, setBreadth] = useState("10");
  const [height, setHeight] = useState("10");
  const [strategy, setStrategy] = useState("cheapest");
  const [autoBook, setAutoBook] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500">Configuration</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Shiprocket Settings
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Keep your default pickup and package values here for faster booking flows.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Default Pickup Location"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={pickupPincode}
            onChange={(e) => setPickupPincode(e.target.value)}
            placeholder="Default Pickup Pincode"
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
            placeholder="Default Weight"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Default Length"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={breadth}
            onChange={(e) => setBreadth(e.target.value)}
            placeholder="Default Breadth"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Default Height"
            className="rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700"
          />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Auto booking
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Use saved defaults for quick booking flow.
            </p>
          </div>

          <button
            onClick={() => setAutoBook((prev) => !prev)}
            className={`relative h-7 w-12 rounded-full transition ${
              autoBook ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition dark:bg-neutral-950 ${
                autoBook ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-neutral-900">
            <Save className="h-4 w-4" />
            Save Settings
          </button>

          <button className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900">
            <Settings2 className="h-4 w-4" />
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}