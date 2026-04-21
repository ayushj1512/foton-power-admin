"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCcw,
  Search,
  Users,
} from "lucide-react";
import { useAdminCustomerStore } from "@/store/adminCustomerStore";

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    filters,
    pagination,
    fetchCustomers,
    setSearch,
    setStatusFilter,
    setPage,
    clearError,
  } = useAdminCustomerStore();

  const [searchValue, setSearchValue] = useState(filters.search || "");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        setSearch(searchValue);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, setSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [filters.search, filters.isActive, filters.page, filters.limit, fetchCustomers]);

  const totalCustomers = pagination?.total || 0;

  const activeCount = useMemo(
    () => customers.filter((item) => item.isActive).length,
    [customers]
  );

  const inactiveCount = useMemo(
    () => customers.filter((item) => !item.isActive).length,
    [customers]
  );

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400">
              Customer Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
              Customers
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Search, filter, and manage customer records in one place.
            </p>
          </div>

          <button
            onClick={() => fetchCustomers()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Total
                </p>
                <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
                  {totalCustomers}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              Active on this page
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
              {activeCount}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              Inactive on this page
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
              {inactiveCount}
            </h3>
          </div>
        </div>

        {/* filters */}
        <div className="rounded-[28px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by name, code, phone, email..."
                className="h-12 w-full rounded-2xl bg-neutral-50 px-11 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:ring-neutral-200"
              />
            </div>

            <select
              value={filters.isActive}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <select
              value={filters.limit}
              onChange={(e) => {
                const nextLimit = Number(e.target.value) || 10;
                useAdminCustomerStore.getState().setLimit(nextLimit);
              }}
              className="h-12 rounded-2xl bg-neutral-50 px-4 text-sm text-neutral-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-neutral-200"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          {error ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="font-medium text-red-700 transition hover:opacity-80"
              >
                Dismiss
              </button>
            </div>
          ) : null}
        </div>

        {/* desktop table */}
        <div className="hidden overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_rgba(0,0,0,0.03)] lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Updated
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, index) => (
                    <tr key={index} className="border-b border-neutral-100 last:border-b-0">
                      <td className="px-6 py-4" colSpan={7}>
                        <div className="h-10 animate-pulse rounded-2xl bg-neutral-100" />
                      </td>
                    </tr>
                  ))
                ) : customers.length ? (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-neutral-100 transition hover:bg-neutral-50/70 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-700">
                            {getInitials(customer.name)}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-neutral-950">
                              {customer.name || "Unnamed Customer"}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              {customer.firebaseUid || "No Firebase UID"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-neutral-700">
                        {customer.customerCode || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {customer.phone || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {customer.email || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            customer.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {formatDate(customer.updatedAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          <Eye size={15} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-16 text-center" colSpan={7}>
                      <p className="text-base font-medium text-neutral-900">
                        No customers found
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">
                        Try changing search or filter values.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* mobile cards */}
        <div className="grid gap-4 lg:hidden">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.03)]"
              >
                <div className="space-y-3">
                  <div className="h-5 w-40 animate-pulse rounded-lg bg-neutral-100" />
                  <div className="h-4 w-full animate-pulse rounded-lg bg-neutral-100" />
                  <div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-100" />
                </div>
              </div>
            ))
          ) : customers.length ? (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-[24px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-700">
                    {getInitials(customer.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="truncate text-sm font-semibold text-neutral-950">
                          {customer.name || "Unnamed Customer"}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {customer.customerCode || "-"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          customer.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm text-neutral-600">
                      <p>{customer.phone || "-"}</p>
                      <p className="truncate">{customer.email || "-"}</p>
                      <p className="text-xs text-neutral-400">
                        Updated {formatDate(customer.updatedAt)}
                      </p>
                    </div>

                    <Link
                      href={`/customers/${customer.id}`}
                      className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      <Eye size={15} />
                      View customer
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-white px-5 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.03)]">
              <p className="text-base font-medium text-neutral-900">No customers found</p>
              <p className="mt-2 text-sm text-neutral-500">
                Try changing search or filter values.
              </p>
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="flex flex-col gap-4 rounded-[28px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-neutral-500">
            Showing page{" "}
            <span className="font-semibold text-neutral-900">
              {pagination.page || 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-900">
              {pagination.pages || 1}
            </span>{" "}
            • Total{" "}
            <span className="font-semibold text-neutral-900">
              {pagination.total || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max((pagination.page || 1) - 1, 1))}
              disabled={(pagination.page || 1) <= 1 || loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <button
              onClick={() =>
                setPage(
                  Math.min(
                    (pagination.page || 1) + 1,
                    pagination.pages || 1
                  )
                )
              }
              disabled={
                (pagination.page || 1) >= (pagination.pages || 1) || loading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}