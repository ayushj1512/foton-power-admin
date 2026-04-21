"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarX2,
  Clock3,
  Loader2,
  Plus,
  TicketPercent,
} from "lucide-react";
import { useAdminCouponStore } from "@/store/adminCouponStore";

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ExpiredCouponsPage() {
  const { coupons, loading, fetchCoupons, setFilters } = useAdminCouponStore();

  useEffect(() => {
    setFilters({ status: "expired" });
    fetchCoupons({ status: "expired", page: 1 }).catch(() => {});
  }, [setFilters, fetchCoupons]);

  const expiredCoupons = useMemo(
    () => coupons.filter((item) => item.status === "expired"),
    [coupons]
  );

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-[28px] bg-gradient-to-br from-rose-950 via-zinc-900 to-zinc-800 px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                <CalendarX2 className="h-3.5 w-3.5" />
                Expired coupons
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Expired coupon history
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Review old campaigns, clone them, or reuse their setup for future launches.
              </p>
            </div>

            <Link
              href="/coupons/add"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              <Plus className="h-4 w-4" />
              Add coupon
            </Link>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white px-6 py-16 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-zinc-500" />
            <span className="text-sm text-zinc-500">Loading expired coupons...</span>
          </div>
        ) : expiredCoupons.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
              <TicketPercent className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-zinc-950">
              No expired coupons found
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Old campaigns will appear here once they expire.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {expiredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
                      {coupon.couponCode}
                    </p>
                    <h3 className="mt-2 truncate text-xl font-semibold tracking-tight text-zinc-950">
                      {coupon.couponName || "Untitled coupon"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {coupon.description || "No description added for this coupon."}
                    </p>
                  </div>

                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    Expired
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Discount
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-950">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue || 0}% off`
                        : `${formatMoney(coupon.discountValue)} off`}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Used count
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-950">
                      {coupon.usedCount || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Expired window</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-900">
                    {formatDate(coupon.startsAt)} → {formatDate(coupon.endsAt)}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/coupons/add?id=${coupon._id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Reuse / edit
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/coupons"
                    className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
                  >
                    View all
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}