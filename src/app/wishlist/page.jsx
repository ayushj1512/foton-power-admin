"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Heart,
  Search,
  Users,
  List,
  ArrowRight,
  FolderHeart,
} from "lucide-react";

export default function WishlistHomePage() {
  const [customerCode, setCustomerCode] = useState("");

  const normalizedCustomerCode = useMemo(
    () => customerCode.trim().toUpperCase(),
    [customerCode]
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-black/5 p-3">
            <Heart className="h-6 w-6 text-black" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-black sm:text-2xl">
              Wishlist
            </h1>
            <p className="mt-1 text-sm text-black/60">
              View grouped customer wishlists and customer-specific saved
              product codes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-black/5 p-3">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">
                Search customer wishlist
              </h2>
              <p className="text-sm text-black/60">
                Open one customer’s wishlist quickly.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
              placeholder="Enter customer code"
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black/30"
            />

            <Link
              href={
                normalizedCustomerCode
                  ? `/wishlist/${encodeURIComponent(normalizedCustomerCode)}`
                  : "#"
              }
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium transition ${
                normalizedCustomerCode
                  ? "bg-black text-white hover:opacity-90"
                  : "cursor-not-allowed bg-black/10 text-black/40"
              }`}
            >
              Open
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-black/5 p-3">
              <FolderHeart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">
                View grouped list
              </h2>
              <p className="text-sm text-black/60">
                See all wishlist data grouped by customer code.
              </p>
            </div>
          </div>

          <Link
            href="/wishlist/list"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Open Wishlist List
            <List className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-black">
            Group by customer
          </h3>
          <p className="mt-1 text-sm text-black/60">
            Easy to scan and manage each customer’s saved products.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-black">
            Wishlist tracking
          </h3>
          <p className="mt-1 text-sm text-black/60">
            Quickly inspect which product codes are being saved.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <List className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-black">
            Clean admin flow
          </h3>
          <p className="mt-1 text-sm text-black/60">
            One page for grouped list, one page for customer detail.
          </p>
        </div>
      </div>
    </div>
  );
}
