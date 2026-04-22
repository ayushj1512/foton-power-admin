"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import OrderCouponDetailsCard from "@/components/orders/OrderCouponDetailsCard";

const ORDER_STATUSES = [
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

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "refund_pending",
  "partially_paid",
  "partially_refunded",
  "not_applicable",
];

const PAYMENT_METHODS = [
  "cod",
  "razorpay",
  "upi",
  "bank_transfer",
  "not_applicable",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function StatusBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-medium capitalize text-black/70">
      {String(value || "—").replaceAll("_", " ")}
    </span>
  );
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-black/5 p-2.5">
            <Icon className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-base font-semibold text-black sm:text-lg">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const {
    order,
    isFetchingOrder,
    isSubmitting,
    error,
    fetchOrderById,
    updateOrderStatus,
    updateOrderPayment,
    updateShipmentDetails,
    clearError,
  } = useAdminOrderStore();

  const [statusForm, setStatusForm] = useState({
    orderStatus: "",
    adminRemarks: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    method: "cod",
    status: "pending",
    amountPaid: 0,
    transactionId: "",
    gateway: "",
    gatewayOrderId: "",
    gatewayPaymentId: "",
    failureReason: "",
  });

  const [shipmentForm, setShipmentForm] = useState({
    courierName: "",
    awbNumber: "",
    trackingNumber: "",
    trackingUrl: "",
    status: "",
    labelUrl: "",
    invoiceUrl: "",
  });

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (!order) return;

    setStatusForm({
      orderStatus: order.orderStatus || "processing",
      adminRemarks: order.adminRemarks || "",
    });

    setPaymentForm({
      method: order.payment?.method || "cod",
      status: order.payment?.status || "pending",
      amountPaid: order.payment?.amountPaid || 0,
      transactionId: order.payment?.transactionId || "",
      gateway: order.payment?.gateway || "",
      gatewayOrderId: order.payment?.gatewayOrderId || "",
      gatewayPaymentId: order.payment?.gatewayPaymentId || "",
      failureReason: order.payment?.failureReason || "",
    });

    setShipmentForm({
      courierName: order.shipment?.courierName || "",
      awbNumber: order.shipment?.awbNumber || "",
      trackingNumber: order.shipment?.trackingNumber || "",
      trackingUrl: order.shipment?.trackingUrl || "",
      status: order.shipment?.status || "",
      labelUrl: order.shipment?.labelUrl || "",
      invoiceUrl: order.shipment?.invoiceUrl || "",
    });
  }, [order]);

  const customerName = useMemo(() => {
    if (!order?.customer) return "—";
    return (
      order.customer.fullName ||
      `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() ||
      "—"
    );
  }, [order]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      clearError?.();
      await updateOrderStatus(id, statusForm);
    } catch {}
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      clearError?.();
      await updateOrderPayment(id, {
        ...paymentForm,
        amountPaid: Number(paymentForm.amountPaid || 0),
      });
    } catch {}
  };

  const handleShipmentSubmit = async (e) => {
    e.preventDefault();
    try {
      clearError?.();
      await updateShipmentDetails(id, shipmentForm);
    } catch {}
  };

  if (isFetchingOrder) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-black/60">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-black">Order not found.</p>
            <Link
              href="/orders/list"
              className="mt-4 inline-flex rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href="/orders/list"
                className="mb-3 inline-flex items-center gap-2 text-sm text-black/60 transition hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to orders
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                  {order.orderNumber || "Order Details"}
                </h1>
                <StatusBadge value={order.orderStatus} />
                <StatusBadge value={order.payment?.status} />
              </div>

              <p className="mt-2 text-sm text-black/60">
                Created on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="grid min-w-full grid-cols-2 gap-3 sm:min-w-0 sm:grid-cols-4">
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <p className="text-xs text-black/50">Payable</p>
                <p className="mt-1 text-lg font-semibold text-black">
                  {formatCurrency(order.payableAmount)}
                </p>
              </div>
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <p className="text-xs text-black/50">Items</p>
                <p className="mt-1 text-lg font-semibold text-black">
                  {order.totalQty || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <p className="text-xs text-black/50">Payment</p>
                <p className="mt-1 text-lg font-semibold capitalize text-black">
                  {order.payment?.method || "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <p className="text-xs text-black/50">Confirmed</p>
                <p className="mt-1 text-lg font-semibold text-black">
                  {order.isConfirmed ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <SectionCard title="Order Items" icon={ShoppingBag}>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 rounded-2xl bg-black/[0.025] p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-black/40" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-black">{item.name}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-black/55">
                          <span>Code: {item.productCode || "—"}</span>
                          <span>SKU: {item.sku || "—"}</span>
                          <span>Size: {item.size || "—"}</span>
                          <span>Color: {item.color || "—"}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/55">
                          <span>Qty: {item.quantity || 0}</span>
                          <span>MRP: {formatCurrency(item.mrp)}</span>
                          <span>Price: {formatCurrency(item.unitPayable)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-black/50">Line total</p>
                      <p className="mt-1 text-base font-semibold text-black">
                        {formatCurrency(item.linePayableTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Customer Details" icon={User}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-black/[0.025] p-4">
                  <p className="text-xs text-black/50">Customer Name</p>
                  <p className="mt-1 font-medium text-black">{customerName}</p>
                </div>
                <div className="rounded-2xl bg-black/[0.025] p-4">
                  <p className="text-xs text-black/50">Customer Code</p>
                  <p className="mt-1 font-medium text-black">
                    {order.customer?.customerCode || "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-black/[0.025] p-4">
                  <p className="text-xs text-black/50">Phone</p>
                  <p className="mt-1 font-medium text-black">
                    {order.customer?.phone || "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-black/[0.025] p-4">
                  <p className="text-xs text-black/50">Email</p>
                  <p className="mt-1 font-medium text-black">
                    {order.customer?.email || "—"}
                  </p>
                </div>
              </div>
            </SectionCard>

            <OrderCouponDetailsCard order={order} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SectionCard title="Billing Address" icon={MapPin}>
                <div className="space-y-2 text-sm text-black/75">
                  <p className="font-medium text-black">
                    {order.billingAddress?.fullName || "—"}
                  </p>
                  <p>{order.billingAddress?.phone || "—"}</p>
                  <p>{order.billingAddress?.email || "—"}</p>
                  <p>{order.billingAddress?.addressLine1 || "—"}</p>
                  {order.billingAddress?.addressLine2 ? (
                    <p>{order.billingAddress.addressLine2}</p>
                  ) : null}
                  {order.billingAddress?.landmark ? (
                    <p>{order.billingAddress.landmark}</p>
                  ) : null}
                  <p>
                    {order.billingAddress?.city || "—"},{" "}
                    {order.billingAddress?.state || "—"} -{" "}
                    {order.billingAddress?.pincode || "—"}
                  </p>
                  <p>{order.billingAddress?.country || "India"}</p>
                </div>
              </SectionCard>

              <SectionCard title="Shipping Address" icon={Truck}>
                <div className="space-y-2 text-sm text-black/75">
                  <p className="font-medium text-black">
                    {order.shippingAddress?.fullName || "—"}
                  </p>
                  <p>{order.shippingAddress?.phone || "—"}</p>
                  <p>{order.shippingAddress?.email || "—"}</p>
                  <p>{order.shippingAddress?.addressLine1 || "—"}</p>
                  {order.shippingAddress?.addressLine2 ? (
                    <p>{order.shippingAddress.addressLine2}</p>
                  ) : null}
                  {order.shippingAddress?.landmark ? (
                    <p>{order.shippingAddress.landmark}</p>
                  ) : null}
                  <p>
                    {order.shippingAddress?.city || "—"},{" "}
                    {order.shippingAddress?.state || "—"} -{" "}
                    {order.shippingAddress?.pincode || "—"}
                  </p>
                  <p>{order.shippingAddress?.country || "India"}</p>
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionCard
              title="Amount Summary"
              icon={BadgeIndianRupee}
              action={
                <Link
                  href="/orders/invoice"
                  className="rounded-2xl bg-black px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
                >
                  Invoice
                </Link>
              }
            >
              <div className="space-y-3 text-sm">
                {[
                  ["Items MRP Total", formatCurrency(order.itemsMrpTotal)],
                  ["Items Discount", formatCurrency(order.itemsDiscountTotal)],
                  ["Coupon Discount", formatCurrency(order.couponDiscount)],
                  ["Additional Discount", formatCurrency(order.additionalDiscount)],
                  ["Subtotal", formatCurrency(order.subtotal)],
                  ["Shipping", formatCurrency(order.shippingCharge)],
                  ["COD Charge", formatCurrency(order.codCharge)],
                  ["Tax", formatCurrency(order.taxAmount)],
                  ["Round Off", formatCurrency(order.roundOff)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <p className="text-black/60">{label}</p>
                    <p className="font-medium text-black">{value}</p>
                  </div>
                ))}

                <div className="my-2 h-px bg-black/10" />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-base font-semibold text-black">Payable Amount</p>
                  <p className="text-base font-semibold text-black">
                    {formatCurrency(order.payableAmount)}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Update Order Status" icon={RefreshCcw}>
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Order Status
                  </label>
                  <select
                    value={statusForm.orderStatus}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        orderStatus: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm text-black outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-black/10"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Admin Remarks
                  </label>
                  <textarea
                    rows={4}
                    value={statusForm.adminRemarks}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        adminRemarks: e.target.value,
                      }))
                    }
                    placeholder="Add remarks..."
                    className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm text-black outline-none ring-1 ring-black/5 placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update Status"}
                </button>
              </form>
            </SectionCard>

            <SectionCard title="Payment Details" icon={CreditCard}>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Method
                    </label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          method: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5"
                    >
                      {PAYMENT_METHODS.map((item) => (
                        <option key={item} value={item}>
                          {item.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Status
                    </label>
                    <select
                      value={paymentForm.status}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5"
                    >
                      {PAYMENT_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {item.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paymentForm.amountPaid}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        amountPaid: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={paymentForm.transactionId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      transactionId: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Gateway"
                  value={paymentForm.gateway}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gateway: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Gateway Order ID"
                  value={paymentForm.gatewayOrderId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gatewayOrderId: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Gateway Payment ID"
                  value={paymentForm.gatewayPaymentId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gatewayPaymentId: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <textarea
                  rows={3}
                  placeholder="Failure reason"
                  value={paymentForm.failureReason}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      failureReason: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update Payment"}
                </button>
              </form>
            </SectionCard>

            <SectionCard title="Shipment Details" icon={Truck}>
              <form onSubmit={handleShipmentSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Courier Name"
                  value={shipmentForm.courierName}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      courierName: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="AWB Number"
                  value={shipmentForm.awbNumber}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      awbNumber: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Tracking Number"
                  value={shipmentForm.trackingNumber}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      trackingNumber: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Tracking URL"
                  value={shipmentForm.trackingUrl}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      trackingUrl: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Shipment Status"
                  value={shipmentForm.status}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Label URL"
                  value={shipmentForm.labelUrl}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      labelUrl: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <input
                  type="text"
                  placeholder="Invoice URL"
                  value={shipmentForm.invoiceUrl}
                  onChange={(e) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      invoiceUrl: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-black/35"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update Shipment"}
                </button>
              </form>
            </SectionCard>

      
          </div>
        </div>
      </div>
    </div>
  );
}