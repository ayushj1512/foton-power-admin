"use client";

import {
  BadgePercent,
  CircleDollarSign,
  Percent,
  Receipt,
  Sparkles,
  TicketPercent,
} from "lucide-react";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDiscountLabel(coupon = {}) {
  const type = String(coupon?.discountType || "").toLowerCase();
  const value = Number(coupon?.discountValue || 0);

  if (type === "percentage") return `${value}% off`;
  if (type === "fixed") return `${formatCurrency(value)} off`;
  return "Offer applied";
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-black/[0.03] p-4 ring-1 ring-black/5">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-semibold text-black">{value || "—"}</p>
    </div>
  );
}

export default function OrderCouponDetailsCard({ order }) {
  const coupon = order?.coupon || null;
  const couponCode = coupon?.code || order?.couponCode || "";
  const hasCoupon =
    !!couponCode ||
    Number(order?.couponDiscount || 0) > 0 ||
    Number(coupon?.discountAmount || 0) > 0;

  if (!hasCoupon) {
    return (
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-black/5 p-2.5">
            <TicketPercent className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-black sm:text-lg">
              Coupon Details
            </h2>
            <p className="mt-1 text-sm text-black/55">
              No discount coupon was applied on this order.
            </p>
          </div>
        </div>

        <div className="rounded-[26px] bg-[linear-gradient(135deg,rgba(0,0,0,0.03),rgba(0,0,0,0.01))] p-5 ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5">
              <Sparkles className="h-5 w-5 text-black/65" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">No coupon used</p>
              <p className="mt-1 text-sm text-black/55">
                Order was placed without any discount code.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-black/5 p-2.5">
            <TicketPercent className="h-5 w-5 text-black" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-black sm:text-lg">
              Coupon Details
            </h2>
            <p className="mt-1 text-sm text-black/55">
              Discount information applied on this order.
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-full bg-black px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          Applied
        </div>
      </div>

      <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02))] p-5 ring-1 ring-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
              Coupon Code
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5">
              <Receipt className="h-4 w-4 text-black/65" />
              <span className="text-base font-semibold tracking-[0.08em] text-black">
                {couponCode || "—"}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
              Saved on this order
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black">
              {formatCurrency(order?.couponDiscount || coupon?.discountAmount || 0)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoPill
            icon={BadgePercent}
            label="Offer Type"
            value={
              coupon?.discountType
                ? String(coupon.discountType).replaceAll("_", " ")
                : "—"
            }
          />
          <InfoPill
            icon={Percent}
            label="Offer Value"
            value={formatDiscountLabel(coupon)}
          />
          <InfoPill
            icon={CircleDollarSign}
            label="Discount Applied"
            value={formatCurrency(order?.couponDiscount || coupon?.discountAmount || 0)}
          />
        </div>

        {coupon?.description ? (
          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-black/70">
              {coupon.description}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}