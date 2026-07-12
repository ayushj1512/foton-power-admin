"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  Search,
  ChevronRight,
  RefreshCcw,
  FolderOpen,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function WishlistListPage() {
  const [wishlist, setWishlist] = useState([]);
  const [groupedWishlist, setGroupedWishlist] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchAllWishlist = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/wishlist/all`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch wishlist");
      }

      const items = Array.isArray(data?.wishlist) ? data.wishlist : [];
      setWishlist(items);
    } catch (err) {
      console.error("fetchAllWishlist error:", err);
      setError(err.message || "Something went wrong");
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWishlist();
  }, []);

  useEffect(() => {
    const grouped = wishlist.reduce((acc, item) => {
      const customerCode = String(item?.customerCode || "").toUpperCase().trim();
      if (!customerCode) return acc;

      if (!acc[customerCode]) {
        acc[customerCode] = [];
      }

      acc[customerCode].push(item);
      return acc;
    }, {});

    setGroupedWishlist(grouped);
  }, [wishlist]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toUpperCase();

    const entries = Object.entries(groupedWishlist);

    if (!q) return entries;

    return entries.filter(([customerCode, items]) => {
      const matchCustomer = customerCode.includes(q);
      const matchProduct = items.some((item) =>
        String(item?.productCode || "").toUpperCase().includes(q)
      );

      return matchCustomer || matchProduct;
    });
  }, [groupedWishlist, search]);

  const totalCustomers = Object.keys(groupedWishlist).length;
  const totalItems = wishlist.length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-black/5 p-3">
              <Heart className="h-6 w-6 text-black" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-black sm:text-2xl">
                Wishlist List
              </h1>
              <p className="mt-1 text-sm text-black/60">
                All wishlist items grouped by customer code.
              </p>
            </div>
          </div>

          <button
            onClick={fetchAllWishlist}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-black transition hover:bg-black/5"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-sm text-black/60">Unique Customers</p>
          <h3 className="mt-1 text-2xl font-bold text-black">
            {totalCustomers}
          </h3>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <Heart className="h-5 w-5" />
          </div>
          <p className="text-sm text-black/60">Total Wishlist Items</p>
          <h3 className="mt-1 text-2xl font-bold text-black">{totalItems}</h3>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-3">
            <FolderOpen className="h-5 w-5" />
          </div>
          <p className="text-sm text-black/60">Visible Groups</p>
          <h3 className="mt-1 text-2xl font-bold text-black">
            {filteredGroups.length}
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer code or product code"
            className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black/30"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm sm:p-8">
          Loading wishlist...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm sm:p-8">
          {error}
          <p className="mt-2 text-xs text-red-500">
            This page needs a backend route like: GET /api/wishlist/all
          </p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm sm:p-8">
          No wishlist groups found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map(([customerCode, items]) => (
            <div
              key={customerCode}
              className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                    Customer Code
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-black">
                    {customerCode}
                  </h2>
                  <p className="mt-1 text-sm text-black/60">
                    {items.length} product{items.length > 1 ? "s" : ""} in
                    wishlist
                  </p>
                </div>

                <Link
                  href={`/wishlist/${encodeURIComponent(customerCode)}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Open Customer Wishlist
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item._id}
                    className="inline-flex items-center rounded-2xl bg-black/5 px-3 py-2 text-sm font-medium text-black"
                  >
                    {item.productCode}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
