"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import OrderListRow from "@/components/orders/OrderListRow";

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

const LIMIT_OPTIONS = [10, 20, 50, 100];

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-2xl bg-[#f7f7f7] px-4 text-sm text-black outline-none ring-1 ring-black/5 placeholder:text-black/35 focus:bg-white focus:ring-black/12 ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-2xl bg-[#f7f7f7] px-4 text-sm text-black outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/12 ${className}`}
    >
      {children}
    </select>
  );
}

export default function OrdersListPage() {
  const searchParams = useSearchParams();

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
    customerCode: "",
    phone: "",
    couponCode: "",
    startDate: "",
    endDate: "",
    limit: 10,
  });

  useEffect(() => {
    const queryOrderStatus = searchParams.get("orderStatus") || "";
    const queryPaymentStatus = searchParams.get("paymentStatus") || "";

    const nextFilters = {
      ...filters,
      orderStatus: queryOrderStatus,
      paymentStatus: queryPaymentStatus,
      page: 1,
    };

    setLocalFilters((prev) => ({
      ...prev,
      orderStatus: queryOrderStatus,
      paymentStatus: queryPaymentStatus,
      limit: Number(filters?.limit || 10),
    }));

    fetchOrders(nextFilters).catch(() => {});
  }, [fetchOrders, searchParams]);

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
      limit: Number(localFilters.limit || 10),
    };

    setFilters(nextFilters);
    await fetchOrders(nextFilters);
  };

  const handleReset = async () => {
    resetFilters();

    const nextFilters = {
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
    };

    setLocalFilters({
      search: "",
      orderStatus: "",
      paymentStatus: "",
      paymentMethod: "",
      customerCode: "",
      phone: "",
      couponCode: "",
      startDate: "",
      endDate: "",
      limit: 10,
    });

    await fetchOrders(nextFilters);
  };

  const changePage = async (page) => {
    const nextFilters = {
      ...filters,
      ...localFilters,
      page,
      limit: Number(localFilters.limit || filters?.limit || 10),
    };

    setFilters(nextFilters);
    await fetchOrders(nextFilters);
  };

  const changeLimit = async (limit) => {
    const nextFilters = {
      ...filters,
      ...localFilters,
      page: 1,
      limit: Number(limit || 10),
    };

    setLocalFilters((prev) => ({ ...prev, limit: Number(limit || 10) }));
    setFilters(nextFilters);
    await fetchOrders(nextFilters);
  };

  const currentPage = Number(pagination?.page || 1);
  const totalPages = Number(pagination?.totalPages || 1);

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full flex-col gap-6">
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
                Search, filter, expand, and update orders from one place.
              </p>
            </div>

            <div className="text-sm text-black/45">{totalOrdersText}</div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12"
          >
            <div className="xl:col-span-3">
              <Input
                placeholder="Search order, customer, product"
                value={localFilters.search}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            <div className="xl:col-span-2">
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
            </div>

            <div className="xl:col-span-2">
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
            </div>

            <div className="xl:col-span-2">
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
            </div>

            <div className="xl:col-span-1">
              <Input
                placeholder="Customer code"
                value={localFilters.customerCode}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    customerCode: e.target.value,
                  }))
                }
              />
            </div>

            <div className="xl:col-span-2">
              <Input
                placeholder="Phone"
                value={localFilters.phone}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="xl:col-span-2">
              <Input
                placeholder="Coupon code"
                value={localFilters.couponCode}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    couponCode: e.target.value,
                  }))
                }
              />
            </div>

            <div className="xl:col-span-2">
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
            </div>

            <div className="xl:col-span-2">
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

            <div className="xl:col-span-2">
              <Select
                value={localFilters.limit}
                onChange={(e) => changeLimit(e.target.value)}
              >
                {LIMIT_OPTIONS.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit} / page
                  </option>
                ))}
              </Select>
            </div>

            <div className="xl:col-span-12 flex flex-wrap gap-2">
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
          <div className="hidden grid-cols-[1.2fr_1fr_.7fr_.7fr_.85fr_auto] px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] text-black/40 md:grid">
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Payment</div>
            <div>Amount</div>
            <div>Actions</div>
          </div>

          {isFetchingOrders ? (
            <div className="px-5 py-10 text-sm text-black/50">Loading orders...</div>
          ) : Array.isArray(orders) && orders.length ? (
            <div>
              {orders.map((order) => (
                <OrderListRow key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-sm text-black/50">No orders found.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-black/50">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!pagination?.hasPrevPage}
              onClick={() => changePage(currentPage - 1)}
              className="h-10 rounded-2xl px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex flex-wrap gap-2">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => changePage(page)}
                  className={`h-10 min-w-10 rounded-2xl px-3 text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "text-black ring-1 ring-black/10 hover:bg-black/[0.03]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!pagination?.hasNextPage}
              onClick={() => changePage(currentPage + 1)}
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