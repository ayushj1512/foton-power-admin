"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BadgePercent,
  CalendarRange,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { useAdminCouponStore } from "@/store/adminCouponStore";

const initialForm = {
  couponCode: "",
  couponName: "",
  description: "",
  status: "draft",
  isActive: true,
  isHidden: false,
  autoApply: false,
  discountType: "percentage",
  discountValue: 0,
  maxDiscountAmount: 0,
  minimumOrderValue: 0,
  maximumOrderValue: 0,
  minimumTotalQty: 0,
  totalUsageLimit: 0,
  perCustomerLimit: 1,
  startsAt: "",
  endsAt: "",
  firstOrderOnly: false,
  canCombineWithOtherCoupons: false,
  canCombineWithSale: true,
  appliesOnShipping: false,
  priority: 0,
};

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const toPayload = (form) => ({
  ...form,
  discountValue: Number(form.discountValue || 0),
  maxDiscountAmount: Number(form.maxDiscountAmount || 0),
  minimumOrderValue: Number(form.minimumOrderValue || 0),
  maximumOrderValue: Number(form.maximumOrderValue || 0),
  minimumTotalQty: Number(form.minimumTotalQty || 0),
  totalUsageLimit: Number(form.totalUsageLimit || 0),
  perCustomerLimit: Number(form.perCustomerLimit || 0),
  priority: Number(form.priority || 0),
  startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
  endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
});

const Section = ({ title, hint, children }) => (
  <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-950">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
    </div>
    {children}
  </section>
);

const Field = ({ label, children, hint }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-800">{label}</label>
    {children}
    {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={`h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300 ${props.className || ""}`}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={`min-h-[120px] w-full rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300 ${props.className || ""}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300 ${props.className || ""}`}
  />
);

const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
      checked
        ? "bg-zinc-900 text-white"
        : "bg-zinc-50 text-zinc-800 ring-1 ring-zinc-200"
    }`}
  >
    <span className="text-sm font-medium">{label}</span>
    <span
      className={`h-6 w-11 rounded-full p-1 transition ${
        checked ? "bg-white/20" : "bg-zinc-200"
      }`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </span>
  </button>
);

function AddCouponPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponId = searchParams.get("id");

  const {
    coupon,
    loading,
    actionLoading,
    fetchCouponById,
    createCoupon,
    updateCoupon,
    clearCoupon,
  } = useAdminCouponStore();

  const [form, setForm] = useState(initialForm);

  const isEdit = useMemo(() => Boolean(couponId), [couponId]);

  useEffect(() => {
    if (!couponId) {
      clearCoupon();
      setForm(initialForm);
      return;
    }

    fetchCouponById(couponId).catch(() => {});
  }, [couponId, fetchCouponById, clearCoupon]);

  useEffect(() => {
    if (!coupon || !couponId) return;

    setForm({
      couponCode: coupon.couponCode || "",
      couponName: coupon.couponName || "",
      description: coupon.description || "",
      status: coupon.status || "draft",
      isActive: Boolean(coupon.isActive),
      isHidden: Boolean(coupon.isHidden),
      autoApply: Boolean(coupon.autoApply),
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      minimumOrderValue: coupon.minimumOrderValue || 0,
      maximumOrderValue: coupon.maximumOrderValue || 0,
      minimumTotalQty: coupon.minimumTotalQty || 0,
      totalUsageLimit: coupon.totalUsageLimit || 0,
      perCustomerLimit: coupon.perCustomerLimit || 1,
      startsAt: toInputDateTime(coupon.startsAt),
      endsAt: toInputDateTime(coupon.endsAt),
      firstOrderOnly: Boolean(coupon.firstOrderOnly),
      canCombineWithOtherCoupons: Boolean(coupon.canCombineWithOtherCoupons),
      canCombineWithSale:
        coupon.canCombineWithSale === undefined ? true : Boolean(coupon.canCombineWithSale),
      appliesOnShipping: Boolean(coupon.appliesOnShipping),
      priority: coupon.priority || 0,
    });
  }, [coupon, couponId]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = toPayload(form);

      if (isEdit) {
        await updateCoupon(couponId, payload);
      } else {
        await createCoupon(payload);
      }

      router.push("/coupons");
    } catch (error) {
      alert(error.message || "Failed to save coupon");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/coupons"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to coupons
              </Link>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {isEdit ? "Edit coupon" : "Create coupon"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Set pricing logic, validity window, limits, and customer-facing behavior with a clean premium form.
              </p>
            </div>

            <button
              type="submit"
              disabled={actionLoading || loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Update coupon" : "Save coupon"}
            </button>
          </div>
        </section>

        {loading && isEdit ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white px-6 py-16 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-zinc-500" />
            <span className="text-sm text-zinc-500">Loading coupon...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-2">
                <Section
                  title="Basic details"
                  hint="Coupon naming, visibility, and discount structure"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                      label="Coupon code"
                      hint="Leave blank if backend should auto-generate"
                    >
                      <Input
                        placeholder="CPN-00001"
                        value={form.couponCode}
                        onChange={(e) => updateField("couponCode", e.target.value.toUpperCase())}
                      />
                    </Field>

                    <Field label="Coupon name">
                      <Input
                        placeholder="Festive launch offer"
                        value={form.couponName}
                        onChange={(e) => updateField("couponName", e.target.value)}
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <Field label="Description">
                        <Textarea
                          placeholder="Short internal/public description..."
                          value={form.description}
                          onChange={(e) => updateField("description", e.target.value)}
                        />
                      </Field>
                    </div>

                    <Field label="Status">
                      <Select
                        value={form.status}
                        onChange={(e) => updateField("status", e.target.value)}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                        <option value="archived">Archived</option>
                      </Select>
                    </Field>

                    <Field label="Discount type">
                      <Select
                        value={form.discountType}
                        onChange={(e) => updateField("discountType", e.target.value)}
                      >
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat</option>
                      </Select>
                    </Field>

                    <Field label="Discount value">
                      <Input
                        type="number"
                        min="0"
                        value={form.discountValue}
                        onChange={(e) => updateField("discountValue", e.target.value)}
                      />
                    </Field>

                    <Field label="Max discount amount">
                      <Input
                        type="number"
                        min="0"
                        value={form.maxDiscountAmount}
                        onChange={(e) => updateField("maxDiscountAmount", e.target.value)}
                      />
                    </Field>
                  </div>
                </Section>

                <Section
                  title="Validity and limits"
                  hint="Set date range, usage limits, and order rules"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Starts at">
                      <Input
                        type="datetime-local"
                        value={form.startsAt}
                        onChange={(e) => updateField("startsAt", e.target.value)}
                      />
                    </Field>

                    <Field label="Ends at">
                      <Input
                        type="datetime-local"
                        value={form.endsAt}
                        onChange={(e) => updateField("endsAt", e.target.value)}
                      />
                    </Field>

                    <Field label="Minimum order value">
                      <Input
                        type="number"
                        min="0"
                        value={form.minimumOrderValue}
                        onChange={(e) => updateField("minimumOrderValue", e.target.value)}
                      />
                    </Field>

                    <Field label="Maximum order value">
                      <Input
                        type="number"
                        min="0"
                        value={form.maximumOrderValue}
                        onChange={(e) => updateField("maximumOrderValue", e.target.value)}
                      />
                    </Field>

                    <Field label="Minimum total quantity">
                      <Input
                        type="number"
                        min="0"
                        value={form.minimumTotalQty}
                        onChange={(e) => updateField("minimumTotalQty", e.target.value)}
                      />
                    </Field>

                    <Field label="Total usage limit">
                      <Input
                        type="number"
                        min="0"
                        value={form.totalUsageLimit}
                        onChange={(e) => updateField("totalUsageLimit", e.target.value)}
                      />
                    </Field>

                    <Field label="Per customer limit">
                      <Input
                        type="number"
                        min="0"
                        value={form.perCustomerLimit}
                        onChange={(e) => updateField("perCustomerLimit", e.target.value)}
                      />
                    </Field>

                    <Field label="Priority">
                      <Input
                        type="number"
                        min="0"
                        value={form.priority}
                        onChange={(e) => updateField("priority", e.target.value)}
                      />
                    </Field>
                  </div>
                </Section>
              </div>

              <div className="space-y-6">
                <Section
                  title="Behavior"
                  hint="Control coupon visibility and stacking logic"
                >
                  <div className="space-y-3">
                    <Switch
                      checked={form.isActive}
                      onChange={(v) => updateField("isActive", v)}
                      label="Coupon active"
                    />
                    <Switch
                      checked={form.isHidden}
                      onChange={(v) => updateField("isHidden", v)}
                      label="Hidden from public"
                    />
                    <Switch
                      checked={form.autoApply}
                      onChange={(v) => updateField("autoApply", v)}
                      label="Auto apply"
                    />
                    <Switch
                      checked={form.firstOrderOnly}
                      onChange={(v) => updateField("firstOrderOnly", v)}
                      label="First order only"
                    />
                    <Switch
                      checked={form.canCombineWithOtherCoupons}
                      onChange={(v) => updateField("canCombineWithOtherCoupons", v)}
                      label="Can combine with other coupons"
                    />
                    <Switch
                      checked={form.canCombineWithSale}
                      onChange={(v) => updateField("canCombineWithSale", v)}
                      label="Can combine with sale"
                    />
                    <Switch
                      checked={form.appliesOnShipping}
                      onChange={(v) => updateField("appliesOnShipping", v)}
                      label="Apply on shipping"
                    />
                  </div>
                </Section>

                <Section title="Quick preview" hint="Instant snapshot of your setup">
                  <div className="rounded-[24px] bg-zinc-950 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <BadgePercent className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/70">Coupon code</p>
                        <h3 className="text-lg font-semibold tracking-tight">
                          {form.couponCode || "Auto-generated"}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                          Discount
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {form.discountType === "percentage"
                            ? `${form.discountValue || 0}%`
                            : `₹${form.discountValue || 0}`}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize text-white">
                          {form.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-white/5 p-3">
                      <div className="flex items-center gap-2 text-white/70">
                        <CalendarRange className="h-4 w-4" />
                        <span className="text-sm">Validity window</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">
                        {form.startsAt ? new Date(form.startsAt).toLocaleString("en-IN") : "No start"}
                        {"  "}→{"  "}
                        {form.endsAt ? new Date(form.endsAt).toLocaleString("en-IN") : "No end"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-zinc-50 p-4 ring-1 ring-zinc-200">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-sm font-medium">Clean admin setup</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      This form is intentionally minimal so finishing phase mein fast kaam ho aur unnecessary clutter na aaye.
                    </p>
                  </div>
                </Section>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default function AddCouponPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f6f4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="rounded-[28px] bg-white px-6 py-16 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <span className="text-sm text-zinc-500">Loading coupon form...</span>
          </div>
        </div>
      }
    >
      <AddCouponPageContent />
    </Suspense>
  );
}
