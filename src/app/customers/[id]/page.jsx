"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  PencilLine,
  Save,
  ShieldCheck,
  User2,
} from "lucide-react";
import { useAdminCustomerStore } from "@/store/adminCustomerStore";

const formatDateTime = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const getInitials = (name = "") => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "CU";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

const emptyAddress = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  companyName: "",
  gstNumber: "",
  label: "",
  isDefault: false,
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id;

  const {
    customer,
    loadingCustomer,
    submitting,
    error,
    successMessage,
    fetchCustomerById,
    updateCustomer,
    addCustomerAddress,
    clearStatus,
  } = useAdminCustomerStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    firebaseUid: "",
    notes: "",
    isActive: true,
  });

  const [addressForm, setAddressForm] = useState(emptyAddress);

  useEffect(() => {
    if (!customerId) return;
    fetchCustomerById(customerId);
  }, [customerId, fetchCustomerById]);

  useEffect(() => {
    if (!customer) return;

    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      firebaseUid: customer.firebaseUid || "",
      notes: customer.notes || "",
      isActive: Boolean(customer.isActive),
    });
  }, [customer]);

  const infoItems = useMemo(
    () => [
      {
        label: "Customer Code",
        value: customer?.customerCode || "-",
      },
      {
        label: "Created",
        value: formatDateTime(customer?.createdAt),
      },
      {
        label: "Updated",
        value: formatDateTime(customer?.updatedAt),
      },
      {
        label: "Last Login",
        value: formatDateTime(customer?.lastLoginAt),
      },
      {
        label: "Last Order",
        value: formatDateTime(customer?.lastOrderAt),
      },
    ],
    [customer]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveCustomer = async () => {
    if (!customerId) return;

    await updateCustomer(customerId, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      firebaseUid: form.firebaseUid,
      notes: form.notes,
      isActive: form.isActive,
    });
  };

  const handleAddAddress = async () => {
    if (!customerId) return;

    const result = await addCustomerAddress(customerId, addressForm);

    if (result?.success) {
      setAddressForm(emptyAddress);
    }
  };

  if (loadingCustomer) {
    return (
      <section className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-10 w-40 animate-pulse rounded-2xl bg-neutral-200" />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="h-[320px] animate-pulse rounded-[32px] bg-white" />
            <div className="h-[320px] animate-pulse rounded-[32px] bg-white" />
          </div>
          <div className="h-[260px] animate-pulse rounded-[32px] bg-white" />
        </div>
      </section>
    );
  }

  if (!customer) {
    return (
      <section className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)]">
          <p className="text-lg font-semibold text-neutral-900">
            Customer not found
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            The customer you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/customers")}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to customers
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
            >
              <ArrowLeft size={16} />
              Back to customers
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-base font-semibold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.03)]">
                {getInitials(customer.name)}
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                  Customer Profile
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                  {customer.name || "Unnamed Customer"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                    {customer.customerCode || "-"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      customer.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveCustomer}
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save changes
          </button>
        </div>

        {/* alerts */}
        {error ? (
          <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              onClick={clearStatus}
              className="font-medium text-red-700 transition hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {successMessage ? (
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{successMessage}</span>
            <button
              onClick={clearStatus}
              className="font-medium text-emerald-800 transition hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {/* top grid */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {/* basic info */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <User2 size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                  Basic Information
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  Customer details
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <input
                name="firebaseUid"
                value={form.firebaseUid}
                onChange={handleChange}
                placeholder="Firebase UID"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows={5}
                className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <label className="sm:col-span-2 flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-neutral-800">
                  Customer is active
                </span>
              </label>
            </div>
          </div>

          {/* meta info */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                  Snapshot
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  System information
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 px-4 py-3"
                >
                  <span className="text-sm text-neutral-500">{item.label}</span>
                  <span className="text-right text-sm font-medium text-neutral-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {customer.defaultAddress ? (
              <div className="mt-6 rounded-3xl bg-neutral-950 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Default Address
                </p>
                <p className="mt-3 text-sm font-medium">
                  {customer.defaultAddress.fullName || "-"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {customer.defaultAddress.phone || "-"}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  {[
                    customer.defaultAddress.addressLine1,
                    customer.defaultAddress.addressLine2,
                    customer.defaultAddress.city,
                    customer.defaultAddress.state,
                    customer.defaultAddress.pincode,
                    customer.defaultAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* addresses */}
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          {/* saved addresses */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                  Addresses
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  Saved addresses
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {customer.addresses?.length ? (
                customer.addresses.map((address, index) => (
                  <div
                    key={`${address.addressLine1}-${index}`}
                    className="rounded-[24px] bg-neutral-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-950">
                          {address.fullName || "Unnamed"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {address.label || "Address"} • {address.phone || "-"}
                        </p>
                      </div>

                      {address.isDefault ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          <Check size={12} />
                          Default
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 space-y-1 text-sm leading-6 text-neutral-600">
                      <p>{address.email || "-"}</p>
                      <p>{address.addressLine1 || "-"}</p>
                      {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
                      <p>
                        {[address.city, address.state, address.pincode]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </p>
                      <p>{address.country || "-"}</p>
                      {address.companyName ? (
                        <p>Company: {address.companyName}</p>
                      ) : null}
                      {address.gstNumber ? <p>GST: {address.gstNumber}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] bg-neutral-50 px-5 py-12 text-center">
                  <p className="text-base font-medium text-neutral-900">
                    No addresses saved
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Add a new address from the form.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* add address */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <PencilLine size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                  New Address
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  Add or update address
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                name="fullName"
                value={addressForm.fullName}
                onChange={handleAddressChange}
                placeholder="Full name"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressChange}
                placeholder="Phone"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="email"
                value={addressForm.email}
                onChange={handleAddressChange}
                placeholder="Email"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <input
                name="label"
                value={addressForm.label}
                onChange={handleAddressChange}
                placeholder="Label (Home / Office)"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <input
                name="addressLine1"
                value={addressForm.addressLine1}
                onChange={handleAddressChange}
                placeholder="Address line 1"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <input
                name="addressLine2"
                value={addressForm.addressLine2}
                onChange={handleAddressChange}
                placeholder="Address line 2"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200 sm:col-span-2"
              />

              <input
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="state"
                value={addressForm.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                placeholder="Country"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="companyName"
                value={addressForm.companyName}
                onChange={handleAddressChange}
                placeholder="Company name"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <input
                name="gstNumber"
                value={addressForm.gstNumber}
                onChange={handleAddressChange}
                placeholder="GST number"
                className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
              />

              <label className="sm:col-span-2 flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-neutral-800">
                  Mark as default address
                </span>
              </label>

              <button
                onClick={handleAddAddress}
                disabled={submitting}
                className="sm:col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save address
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}