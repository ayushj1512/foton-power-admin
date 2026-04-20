"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  IndianRupee,
  CheckCircle2,
  Truck,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";

function StatCard({ title, value, icon: Icon, subtitle, href }) {
  return (
    <Link
      href={href}
      className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-black/50">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-black">
            {value}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-black/45">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5">
          <Icon className="h-5 w-5 text-black" />
        </div>
      </div>
    </Link>
  );
}

function RecentOrderRow({ order }) {
  return (
    <Link
      href={`/orders/${order._id}`}
      className="grid grid-cols-1 gap-3 rounded-2xl px-4 py-4 transition hover:bg-black/[0.03] md:grid-cols-[1.2fr_1fr_.8fr_.8fr_auto]"
    >
      <div>
        <p className="text-sm font-medium text-black">
          {order.orderNumber || "—"}
        </p>
        <p className="mt-1 text-xs text-black/50">
          {order.customer?.fullName || order.customer?.firstName || "No customer"}
        </p>
      </div>

      <div className="text-sm text-black/70">
        {order.customer?.phone || order.customer?.email || "—"}
      </div>

      <div className="text-sm text-black/70">
        {order.orderStatus || "—"}
      </div>

      <div className="text-sm font-medium text-black">
        ₹{Number(order.payableAmount || 0).toLocaleString("en-IN")}
      </div>

      <div className="flex items-center text-sm font-medium text-black">
        View
      </div>
    </Link>
  );
}

export default function OrdersOverviewPage() {
  const {
    orders,
    stats,
    fetchOrders,
    fetchOrderStats,
    isFetchingOrders,
    isLoading,
    error,
  } = useAdminOrderStore();

  useEffect(() => {
    fetchOrderStats({ limit: 10 }).catch(() => {});
    fetchOrders({ page: 1, limit: 8, sortBy: "createdAt", sortOrder: "desc" }).catch(
      () => {}
    );
  }, [fetchOrderStats, fetchOrders]);

  const recentOrders = useMemo(() => orders?.slice(0, 6) || [], [orders]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Orders
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                Orders Overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-black/55">
                Quick snapshot of orders, revenue, delivery progress and active issues.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/orders/list"
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                All Orders
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/orders/invoice"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black ring-1 ring-black/10 transition hover:bg-black/[0.03]"
              >
                Invoice
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={isLoading ? "..." : stats?.totalOrders || 0}
            subtitle="All tracked orders"
            icon={Package}
            href="/orders/list"
          />
          <StatCard
            title="Revenue"
            value={
              isLoading
                ? "..."
                : `₹${Number(stats?.totalRevenue || 0).toLocaleString("en-IN")}`
            }
            subtitle="Payable value"
            icon={IndianRupee}
            href="/orders/list"
          />
          <StatCard
            title="Delivered"
            value={isLoading ? "..." : stats?.deliveredOrders || 0}
            subtitle="Completed deliveries"
            icon={CheckCircle2}
            href="/orders/list?orderStatus=delivered"
          />
          <StatCard
            title="Issues"
            value={
              isLoading
                ? "..."
                : (stats?.cancelledOrders || 0) + (stats?.pendingPayments || 0)
            }
            subtitle="Cancelled + pending payments"
            icon={AlertTriangle}
            href="/orders/list"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_.8fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-black">Recent Orders</h2>
                <p className="text-sm text-black/50">
                  Latest orders from your system
                </p>
              </div>

              <Link
                href="/orders/list"
                className="text-sm font-medium text-black/70 transition hover:text-black"
              >
                View all
              </Link>
            </div>

            <div className="rounded-3xl bg-[#fafafa] p-2">
              <div className="hidden grid-cols-[1.2fr_1fr_.8fr_.8fr_auto] px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-black/40 md:grid">
                <div>Order</div>
                <div>Contact</div>
                <div>Status</div>
                <div>Amount</div>
                <div>Action</div>
              </div>

              <div className="space-y-1">
                {isFetchingOrders ? (
                  <div className="px-4 py-8 text-sm text-black/50">
                    Loading orders...
                  </div>
                ) : recentOrders.length ? (
                  recentOrders.map((order) => (
                    <RecentOrderRow key={order._id} order={order} />
                  ))
                ) : (
                  <div className="px-4 py-8 text-sm text-black/50">
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/orders/list?orderStatus=processing"
              className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/50">Processing Queue</p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    Active workbench
                  </h3>
                </div>
                <div className="rounded-2xl bg-black/5 p-3">
                  <ShoppingBag className="h-5 w-5 text-black" />
                </div>
              </div>
            </Link>

            <Link
              href="/orders/list?orderStatus=shipped"
              className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/50">Shipped Orders</p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    Track dispatches
                  </h3>
                </div>
                <div className="rounded-2xl bg-black/5 p-3">
                  <Truck className="h-5 w-5 text-black" />
                </div>
              </div>
            </Link>

            <Link
              href="/orders/list?paymentStatus=pending"
              className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/50">Pending Payments</p>
                  <h3 className="mt-2 text-xl font-semibold text-black">
                    Check payment issues
                  </h3>
                </div>
                <div className="rounded-2xl bg-black/5 p-3">
                  <IndianRupee className="h-5 w-5 text-black" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}