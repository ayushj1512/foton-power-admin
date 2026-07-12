"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgePercent,
  CalendarClock,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  TicketPercent,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useAdminCouponStore } from "@/store/adminCouponStore";

const statusToneMap = {
  active: "bg-emerald-50 text-emerald-700",
  draft: "bg-slate-100 text-slate-700",
  inactive: "bg-amber-50 text-amber-700",
  expired: "bg-rose-50 text-rose-700",
  archived: "bg-zinc-100 text-zinc-600",
};

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

const StatCard = ({ icon: Icon, title, value, hint }) => (
  <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
      {title}
    </p>
    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
      {value}
    </h3>
    {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
  </div>
);

export default function CouponsPage() {
  const {
    coupons,
    loading,
    actionLoading,
    pagination,
    filters,
    fetchCoupons,
    setFilters,
    setPage,
    updateCouponStatus,
    toggleCouponVisibility,
    deleteCoupon,
    resetFilters,
  } = useAdminCouponStore();

  const [searchText, setSearchText] = useState(filters.search || "");

  useEffect(() => {
    fetchCoupons().catch(() => {});
  }, [fetchCoupons]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== filters.search) {
        setFilters({ search: searchText });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText, filters.search, setFilters]);

  useEffect(() => {
    fetchCoupons().catch(() => {});
  }, [
    filters.search,
    filters.status,
    filters.isActive,
    filters.isHidden,
    filters.autoApply,
    filters.discountType,
    filters.sortBy,
    filters.sortOrder,
    pagination.page,
    pagination.limit,
    fetchCoupons,
  ]);

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((item) => item.status === "active").length;
    const expired = coupons.filter((item) => item.status === "expired").length;
    const hidden = coupons.filter((item) => item.isHidden).length;

    return { total, active, expired, hidden };
  }, [coupons]);

  const handleDelete = async (couponId) => {
    const ok = window.confirm("Delete this coupon?");
    if (!ok) return;

    try {
      await deleteCoupon(couponId);
    } catch (error) {
      alert(error.message || "Failed to delete coupon");
    }
  };

  const handleStatusToggle = async (coupon) => {
    try {
      await updateCouponStatus(coupon._id, {
        status: coupon.status === "active" ? "inactive" : "active",
        isActive: coupon.status !== "active",
      });
    } catch (error) {
      alert(error.message || "Failed to update status");
    }
  };

  const empty = !loading && coupons.length === 0;

  return (
    <div className="min-h-screen bg-[#f6f6f4]">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <section className="rounded-[24px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:rounded-[28px] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                <TicketPercent className="h-3.5 w-3.5" />
                Coupons
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Premium coupon management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Create, manage, hide, activate, and track coupon availability from one clean dashboard.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-end">
              <button
                onClick={() => fetchCoupons().catch(() => {})}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-medium text-white transition hover:bg-white/15 sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <Link
                href="/coupons/add"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Add coupon
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BadgePercent}
            title="Visible loaded"
            value={stats.total}
            hint="Current list result"
          />
          <StatCard
            icon={ToggleRight}
            title="Active"
            value={stats.active}
            hint="Ready for use"
          />
          <StatCard
            icon={CalendarClock}
            title="Expired"
            value={stats.expired}
            hint="Past validity"
          />
          <StatCard
            icon={EyeOff}
            title="Hidden"
            value={stats.hidden}
            hint="Not shown publicly"
          />
        </section>

        <section className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="relative lg:col-span-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by code, name, description..."
                className="h-12 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-zinc-300 lg:col-span-2"
            >
              <option value="">All status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filters.discountType}
              onChange={(e) => setFilters({ discountType: e.target.value })}
              className="h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-zinc-300 lg:col-span-2"
            >
              <option value="">All discount types</option>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>

            <select
              value={filters.isHidden}
              onChange={(e) => setFilters({ isHidden: e.target.value })}
              className="h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-zinc-300 lg:col-span-2"
            >
              <option value="">Visibility</option>
              <option value="false">Visible</option>
              <option value="true">Hidden</option>
            </select>

            <div className="flex gap-3 lg:col-span-2">
              <button
                onClick={() => {
                  resetFilters();
                  setSearchText("");
                  setTimeout(() => fetchCoupons().catch(() => {}), 0);
                }}
                className="h-12 w-full flex-1 rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                All coupons
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage coupon state, visibility, and edits
              </p>
            </div>

            {actionLoading ? (
              <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            ) : null}
          </div>

          <div className="hidden min-[980px]:block">
            <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <div className="col-span-3">Coupon</div>
              <div className="col-span-2">Discount</div>
              <div className="col-span-2">Validity</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Usage</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center px-5 py-16 text-zinc-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading coupons...
              </div>
            ) : empty ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                  <TicketPercent className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No coupons found
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Try changing filters or create your first coupon.
                </p>
              </div>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 transition hover:bg-zinc-50/70"
                >
                  <div className="col-span-3 min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-950">
                      {coupon.couponCode}
                    </p>
                    <p className="mt-1 truncate text-sm text-zinc-600">
                      {coupon.couponName || "Untitled coupon"}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                      {coupon.description || "No description"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-zinc-900">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue || 0}% off`
                        : `${formatMoney(coupon.discountValue)} off`}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Max: {formatMoney(coupon.maxDiscountAmount)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-zinc-900">
                      {formatDate(coupon.startsAt)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      to {formatDate(coupon.endsAt)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusToneMap[coupon.status] || "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {coupon.status || "draft"}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          coupon.isHidden
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {coupon.isHidden ? "Hidden" : "Visible"}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          coupon.autoApply
                            ? "bg-violet-50 text-violet-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {coupon.autoApply ? "Auto apply" : "Manual"}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {coupon.usedCount || 0}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      / {coupon.totalUsageLimit || "∞"}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-start justify-end gap-2">
                    <Link
                      href={`/coupons/add?id=${coupon._id}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleStatusToggle(coupon)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                    >
                      {coupon.status === "active" ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleCouponVisibility(coupon._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                    >
                      {coupon.isHidden ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 p-4 min-[980px]:hidden">
            {loading ? (
              <div className="flex items-center justify-center rounded-3xl bg-zinc-50 px-4 py-12 text-zinc-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading coupons...
              </div>
            ) : empty ? (
              <div className="rounded-3xl bg-zinc-50 px-4 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zinc-500 ring-1 ring-zinc-200">
                  <TicketPercent className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No coupons found
                </h3>
              </div>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="rounded-[24px] bg-zinc-50 p-3 ring-1 ring-zinc-200/70 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-950">
                        {coupon.couponCode}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {coupon.couponName || "Untitled coupon"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        statusToneMap[coupon.status] || "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {coupon.status || "draft"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 text-sm">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                        Discount
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue || 0}% off`
                          : `${formatMoney(coupon.discountValue)} off`}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                        Used
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {coupon.usedCount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusToggle(coupon)}
                      className="rounded-2xl bg-white px-3 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 transition hover:bg-zinc-100"
                    >
                      Toggle status
                    </button>
                    <button
                      onClick={() => toggleCouponVisibility(coupon._id)}
                      className="rounded-2xl bg-white px-3 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 transition hover:bg-zinc-100"
                    >
                      {coupon.isHidden ? "Make visible" : "Hide"}
                    </button>
                    <Link
                      href={`/coupons/add?id=${coupon._id}`}
                      className="rounded-2xl bg-white px-3 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 transition hover:bg-zinc-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Page {pagination.page || 1} of {pagination.pages || 1}
            </p>

            <div className="flex gap-2">
              <button
                disabled={(pagination.page || 1) <= 1}
                onClick={() => setPage((pagination.page || 1) - 1)}
                className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={(pagination.page || 1) >= (pagination.pages || 1)}
                onClick={() => setPage((pagination.page || 1) + 1)}
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
