"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, RefreshCcw, Hash } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CustomerWishlistPage({ params }) {
  const customerCode = useMemo(
    () => String(params?.customer_code || "").trim().toUpperCase(),
    [params]
  );

  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomerWishlist = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(
        `${BACKEND_URL}/api/wishlist/customer/${encodeURIComponent(
          customerCode
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch customer wishlist");
      }

      setWishlist(Array.isArray(data?.wishlist) ? data.wishlist : []);
    } catch (err) {
      console.error("fetchCustomerWishlist error:", err);
      setError(err.message || "Something went wrong");
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerCode) {
      fetchCustomerWishlist();
    }
  }, [customerCode]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/wishlist/list"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-black transition hover:bg-black/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <button
          onClick={fetchCustomerWishlist}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-black transition hover:bg-black/5"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-black/5 p-3">
            <Heart className="h-6 w-6 text-black" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Customer Wishlist
            </p>
            <h1 className="mt-1 text-xl font-bold text-black sm:text-2xl">
              {customerCode || "Customer"}
            </h1>
            <p className="mt-1 text-sm text-black/60">
              Product codes saved by this customer.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm sm:p-8">
          Loading customer wishlist...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm sm:p-8">
          {error}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm sm:p-8">
          No wishlist items found for this customer.
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-black/60">Total Saved Products</p>
            <h2 className="mt-1 text-2xl font-bold text-black">
              {wishlist.length}
            </h2>
          </div>

          <div className="grid gap-4 min-[420px]:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-black/5 p-3">
                  <Hash className="h-5 w-5 text-black" />
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Product Code
                </p>
                <h3 className="mt-1 text-xl font-bold text-black">
                  {item.productCode}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-black/60">
                  <p>
                    <span className="font-medium text-black">Customer:</span>{" "}
                    {item.customerCode}
                  </p>
                  <p>
                    <span className="font-medium text-black">Added:</span>{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
