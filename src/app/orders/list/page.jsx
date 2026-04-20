"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, RotateCcw, FileText } from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";

const STATUS_OPTIONS = [
  "",
  "processing",
  "packed",
  "picked",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
  "rto",
  "failed",
];

const PAYMENT_STATUS_OPTIONS = [
  "",
  "pending",
  "paid",
  "failed",
  "refunded",
  "refund_pending",
  "partially_paid",
  "partially_refunded",
  "not_applicable",
];

const PAYMENT_METHOD_OPTIONS = [
  "",
  "cod",
  "razorpay",
  "upi",
  "bank_transfer",
  "not_applicable",
];

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-2xl bg-[#f7f7f7] px-4 text-sm text-black outline-none ring-1 ring-black/5 placeholder:text-black/35 focus:bg-white focus:ring-black/12 ${props.className || ""}`}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-2xl bg-[#f7f7f7] px-4 text-sm text-black outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/12 ${props.className || ""}`}
    >
      {children}
    </select>
  );
}

function StatusBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-medium capitalize text-black/70">
      {value?.replaceAll("_", " ") || "—"}
    </span>
  );
}

export default function OrdersListPage() {
  const {
    orders,
    pagination,
    filters,
    isFetchingOrders,
    error,
    setFilters,
    resetFilters,
    fetchOrders,
  } = useAdminOrderStore();

  const [localFilters, setLocalFilters] = useState({
    search: "",
    orderStatus: "",
    paymentStatus: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchOrders(filters).catch(() => {});
  }, [fetchOrders]);

  const totalOrdersText = useMemo(
    () => `${pagination?.total || 0} orders`,
    [pagination]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const nextFilters = {
      ...filters,
      ...localFilters,
      page: 1,
    };
    setFilters(nextFilters);
    await fetchOrders(nextFilters);
  };

  const handleReset = async () => {
    resetFilters();
    setLocalFilters({
      search: "",
      orderStatus: "",
      paymentStatus: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
    });

    await fetchOrders({
      search: "",
      orderStatus: "",
      paymentStatus: "",
      paymentMethod: "",
      source: "",
      customerCode: "",
      phone: "",
      email: "",
      couponCode: "",
      isConfirmed: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });
  };

  const changePage = async (page) => {
    const nextFilters = {
      ...filters,
      page,
    };
    setFilters(nextFilters);
    await fetchOrders(nextFilters);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Orders
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                All Orders
              </h1>
              <p className="mt-2 text-sm text-black/55">
                Search, filter and manage all orders from one place.
              </p>
            </div>

            <div className="text-sm text-black/45">{totalOrdersText}</div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6"
          >
            <div className="xl:col-span-2">
              <Input
                placeholder="Search order, name, phone, product code"
                value={localFilters.search}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            <Select
              value={localFilters.orderStatus}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  orderStatus: e.target.value,
                }))
              }
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.filter(Boolean).map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>

            <Select
              value={localFilters.paymentStatus}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  paymentStatus: e.target.value,
                }))
              }
            >
              <option value="">Payment Status</option>
              {PAYMENT_STATUS_OPTIONS.filter(Boolean).map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>

            <Select
              value={localFilters.paymentMethod}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
            >
              <option value="">Payment Method</option>
              {PAYMENT_METHOD_OPTIONS.filter(Boolean).map((method) => (
                <option key={method} value={method}>
                  {method.replaceAll("_", " ")}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3 xl:col-span-1">
              <Input
                type="date"
                value={localFilters.startDate}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
              <Input
                type="date"
                value={localFilters.endDate}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="xl:col-span-6 flex flex-wrap gap-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="hidden grid-cols-[1.2fr_1fr_.7fr_.7fr_.8fr_auto] px-6 py-4 text-xs font-medium uppercase tracking-[0.16em] text-black/40 md:grid">
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Payment</div>
            <div>Amount</div>
            <div>Action</div>
          </div>

          {isFetchingOrders ? (
            <div className="px-6 py-10 text-sm text-black/50">Loading orders...</div>
          ) : orders?.length ? (
            <div className="divide-y divide-black/5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-1 gap-3 px-6 py-5 md:grid-cols-[1.2fr_1fr_.7fr_.7fr_.8fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {order.orderNumber || "—"}
                    </p>
                    <p className="mt-1 text-xs text-black/45">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-black">
                      {order.customer?.fullName || "No name"}
                    </p>
                    <p className="mt-1 text-xs text-black/45">
                      {order.customer?.phone || order.customer?.email || "—"}
                    </p>
                  </div>

                  <div>
                    <StatusBadge value={order.orderStatus} />
                  </div>

                  <div>
                    <StatusBadge value={order.payment?.status} />
                  </div>

                  <div className="text-sm font-semibold text-black">
                    ₹{Number(order.payableAmount || 0).toLocaleString("en-IN")}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-black px-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>

                    <Link
                      href={`/orders/invoice?orderNumber=${order.orderNumber}`}
                      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-sm text-black/50">No orders found.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-black/50">
            Page {pagination?.page || 1} of {pagination?.totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!pagination?.hasPrevPage}
              onClick={() => changePage((pagination?.page || 1) - 1)}
              className="h-10 rounded-2xl px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={!pagination?.hasNextPage}
              onClick={() => changePage((pagination?.page || 1) + 1)}
              className="h-10 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}