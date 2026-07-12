"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  Square,
  Truck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useAdminShiprocketStore } from "@/store/adminShiprocketStore";
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

function SelectionButton({ checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
    >
      {checked ? (
        <CheckSquare className="h-4 w-4" />
      ) : (
        <Square className="h-4 w-4" />
      )}
      {checked ? "Unselect All Trackable" : "Select All Trackable"}
    </button>
  );
}

function OrdersListPageContent() {
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

  const { syncTracking } = useAdminShiprocketStore();

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

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkSyncLoading, setBulkSyncLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");

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
    setBulkMessage("");
    setBulkError("");

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
    setBulkMessage("");
    setBulkError("");
    setSelectedIds([]);

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

  const trackableOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      const shipment = order?.shipment || {};
      const shiprocket = shipment?.shiprocket || {};
      return (
        shiprocket?.isBooked ||
        shipment?.awbNumber ||
        shiprocket?.shipmentId
      );
    });
  }, [orders]);

  const selectedTrackableIds = useMemo(() => {
    const trackableSet = new Set(trackableOrders.map((order) => order?._id));
    return selectedIds.filter((id) => trackableSet.has(id));
  }, [selectedIds, trackableOrders]);

  const areAllTrackableSelected =
    trackableOrders.length > 0 &&
    selectedTrackableIds.length === trackableOrders.length;

  const toggleSelect = (id) => {
    setBulkMessage("");
    setBulkError("");

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllTrackable = () => {
    setBulkMessage("");
    setBulkError("");

    if (areAllTrackableSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !trackableOrders.some((order) => order?._id === id))
      );
      return;
    }

    const allIds = trackableOrders.map((order) => order?._id).filter(Boolean);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  const runBulkSync = async (ids = []) => {
    if (!ids.length) return;

    setBulkSyncLoading(true);
    setBulkMessage("");
    setBulkError("");

    try {
      const results = await Promise.allSettled(ids.map((id) => syncTracking(id)));

      const successCount = results.filter(
        (item) => item.status === "fulfilled"
      ).length;
      const failCount = results.length - successCount;

      setBulkMessage(
        `Tracking synced for ${successCount} order${
          successCount !== 1 ? "s" : ""
        }${failCount ? `, ${failCount} failed` : ""}.`
      );

      await fetchOrders({
        ...filters,
        ...localFilters,
        page: currentPage,
        limit: Number(localFilters.limit || filters?.limit || 10),
      });

      if (!failCount) {
        setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      }
    } catch (err) {
      setBulkError(err?.message || "Failed to sync tracking");
    } finally {
      setBulkSyncLoading(false);
    }
  };

  const handleSyncSelected = async () => {
    if (!selectedTrackableIds.length) {
      setBulkError("Please select at least one booked / trackable order.");
      setBulkMessage("");
      return;
    }

    await runBulkSync(selectedTrackableIds);
  };

  const handleSyncAll = async () => {
    if (!trackableOrders.length) {
      setBulkError("No booked / trackable orders found on this page.");
      setBulkMessage("");
      return;
    }

    await runBulkSync(trackableOrders.map((order) => order?._id).filter(Boolean));
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Orders
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                All Orders
              </h1>
              <p className="mt-2 text-sm text-black/55">
                Search, filter and manage orders from one place.
              </p>
            </div>

            <div className="text-sm text-black/45">{totalOrdersText}</div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-12"
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

            <div className="xl:col-span-12 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Shiprocket Sync
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-black">
                Sync selected or sync all
              </h2>
              <p className="mt-1 text-sm text-black/55">
                Only booked / trackable orders on this page will be synced.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
              <SelectionButton
                checked={areAllTrackableSelected}
                onClick={toggleSelectAllTrackable}
              />

              <button
                type="button"
                disabled={bulkSyncLoading || !selectedTrackableIds.length}
                onClick={handleSyncSelected}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {bulkSyncLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Truck className="h-4 w-4" />
                )}
                Sync Selected ({selectedTrackableIds.length})
              </button>

              <button
                type="button"
                disabled={bulkSyncLoading || !trackableOrders.length}
                onClick={handleSyncAll}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {bulkSyncLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Sync All ({trackableOrders.length})
              </button>
            </div>
          </div>

          {bulkError ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              {bulkError}
            </div>
          ) : null}

          {bulkMessage ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
              {bulkMessage}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="hidden grid-cols-[56px_1.15fr_1fr_.7fr_.8fr_.75fr_1fr_auto] px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] text-black/40 md:grid">
            <div>Select</div>
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Payment</div>
            <div>Amount</div>
            <div>Shiprocket</div>
            <div>Actions</div>
          </div>

          {isFetchingOrders ? (
            <div className="px-5 py-10 text-sm text-black/50">Loading orders...</div>
          ) : Array.isArray(orders) && orders.length ? (
            <div>
              {orders.map((order) => (
                <OrderListRow
                  key={order._id}
                  order={order}
                  selectable
                  selected={selectedIds.includes(order?._id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-sm text-black/50">No orders found.</div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] bg-white px-4 py-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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

            <div className="hidden flex-wrap gap-2 sm:flex">
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

export default function OrdersListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f7f7]">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:p-6">
              <p className="text-sm text-black/55">Loading orders...</p>
            </div>
          </div>
        </div>
      }
    >
      <OrdersListPageContent />
    </Suspense>
  );
}
