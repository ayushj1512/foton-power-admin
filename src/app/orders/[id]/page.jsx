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
  RefreshCcw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import OrderCouponDetailsCard from "@/components/orders/OrderCouponDetailsCard";
import ShiprocketTrackingSyncCard from "@/components/orders/ShiprocketTrackingSyncCard";

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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-medium capitalize text-black/70">
      {String(value || "—").replaceAll("_", " ")}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/[0.025] p-4">
      <p className="text-xs text-black/50">{label}</p>
      <p className="mt-1 font-medium text-black">{value || "—"}</p>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm text-black outline-none ring-1 ring-black/5 placeholder:text-black/35"
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm text-black outline-none ring-1 ring-black/5"
    >
      {children}
    </select>
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border-0 bg-black/[0.04] px-4 py-3 text-sm text-black outline-none ring-1 ring-black/5 placeholder:text-black/35"
    />
  );
}

function SubmitButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SectionCard({ title, icon: Icon, action, children }) {
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

function AddressBlock({ address }) {
  return (
    <div className="space-y-2 text-sm text-black/75">
      <p className="font-medium text-black">{address?.fullName || "—"}</p>
      <p>{address?.phone || "—"}</p>
      <p>{address?.email || "—"}</p>
      <p>{address?.addressLine1 || "—"}</p>
      {address?.addressLine2 ? <p>{address.addressLine2}</p> : null}
      {address?.landmark ? <p>{address.landmark}</p> : null}
      <p>
        {address?.city || "—"}, {address?.state || "—"} - {address?.pincode || "—"}
      </p>
      <p>{address?.country || "India"}</p>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const {
    order,
    error,
    isFetchingOrder,
    isSubmitting,
    fetchOrderById,
    updateOrderStatus,
    updateOrderPayment,
    updateShipmentDetails,
    clearError,
    setOrder,
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
      courierName:
        order.shipment?.courierName ||
        order.shipment?.shiprocket?.courier_name ||
        "",
      awbNumber:
        order.shipment?.awbNumber ||
        order.shipment?.shiprocket?.awb_code ||
        "",
      trackingNumber: order.shipment?.trackingNumber || "",
      trackingUrl:
        order.shipment?.trackingUrl ||
        order.shipment?.shiprocket?.tracking_url ||
        "",
      status:
        order.shipment?.status ||
        order.shipment?.shiprocket?.current_status ||
        "",
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
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-black/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
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
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
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
                <Field label="Customer Name" value={customerName} />
                <Field label="Customer Code" value={order.customer?.customerCode} />
                <Field label="Phone" value={order.customer?.phone} />
                <Field label="Email" value={order.customer?.email} />
              </div>
            </SectionCard>

            <OrderCouponDetailsCard order={order} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SectionCard title="Billing Address" icon={MapPin}>
                <AddressBlock address={order.billingAddress} />
              </SectionCard>

              <SectionCard title="Shipping Address" icon={Truck}>
                <AddressBlock address={order.shippingAddress} />
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
                  <Select
                    value={statusForm.orderStatus}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        orderStatus: e.target.value,
                      }))
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Admin Remarks
                  </label>
                  <Textarea
                    rows={4}
                    value={statusForm.adminRemarks}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        adminRemarks: e.target.value,
                      }))
                    }
                    placeholder="Add remarks..."
                  />
                </div>

                <SubmitButton disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Status"}
                </SubmitButton>
              </form>
            </SectionCard>

            <SectionCard title="Payment Details" icon={CreditCard}>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Method
                    </label>
                    <Select
                      value={paymentForm.method}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          method: e.target.value,
                        }))
                      }
                    >
                      {PAYMENT_METHODS.map((item) => (
                        <option key={item} value={item}>
                          {item.replaceAll("_", " ")}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black">
                      Status
                    </label>
                    <Select
                      value={paymentForm.status}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      {PAYMENT_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {item.replaceAll("_", " ")}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <Input
                  type="number"
                  min="0"
                  placeholder="Amount Paid"
                  value={paymentForm.amountPaid}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      amountPaid: e.target.value,
                    }))
                  }
                />

                <Input
                  type="text"
                  placeholder="Transaction ID"
                  value={paymentForm.transactionId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      transactionId: e.target.value,
                    }))
                  }
                />

                <Input
                  type="text"
                  placeholder="Gateway"
                  value={paymentForm.gateway}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gateway: e.target.value,
                    }))
                  }
                />

                <Input
                  type="text"
                  placeholder="Gateway Order ID"
                  value={paymentForm.gatewayOrderId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gatewayOrderId: e.target.value,
                    }))
                  }
                />

                <Input
                  type="text"
                  placeholder="Gateway Payment ID"
                  value={paymentForm.gatewayPaymentId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      gatewayPaymentId: e.target.value,
                    }))
                  }
                />

                <Textarea
                  rows={3}
                  placeholder="Failure reason"
                  value={paymentForm.failureReason}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      failureReason: e.target.value,
                    }))
                  }
                />

                <SubmitButton disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Payment"}
                </SubmitButton>
              </form>
            </SectionCard>

            {/* <ShiprocketTrackingSyncCard
              order={order}
              onSynced={(updatedOrder) => {
                if (updatedOrder) setOrder(updatedOrder);
              }}
            /> */}

         <SectionCard title="Shipment Details" icon={Truck}>
  <form onSubmit={handleShipmentSubmit} className="space-y-4">
    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Courier Name
      </label>
      <Input
        type="text"
        value={shipmentForm.courierName}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            courierName: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        AWB Number
      </label>
      <Input
        type="text"
        value={shipmentForm.awbNumber}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            awbNumber: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Tracking Number
      </label>
      <Input
        type="text"
        value={shipmentForm.trackingNumber}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            trackingNumber: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Tracking URL
      </label>
      <Input
        type="text"
        value={shipmentForm.trackingUrl}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            trackingUrl: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Shipment Status
      </label>
      <Input
        type="text"
        value={shipmentForm.status}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            status: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Label URL
      </label>
      <Input
        type="text"
        value={shipmentForm.labelUrl}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            labelUrl: e.target.value,
          }))
        }
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        Invoice URL
      </label>
      <Input
        type="text"
        value={shipmentForm.invoiceUrl}
        onChange={(e) =>
          setShipmentForm((prev) => ({
            ...prev,
            invoiceUrl: e.target.value,
          }))
        }
      />
    </div>

    <SubmitButton disabled={isSubmitting}>
      {isSubmitting ? "Updating..." : "Update Shipment"}
    </SubmitButton>
  </form>
</SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}