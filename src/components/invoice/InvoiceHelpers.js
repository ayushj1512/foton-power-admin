import {
  DOCUMENT_TYPES,
  PAYMENT_LABELS,
  SELLER,
} from "@/constants/invoiceConstants";

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SELLER.currency || "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN");
};

export const sanitizeOrderNumbers = (input = "") => {
  return [
    ...new Set(
      String(input)
        .split(/[\n,\s]+/)
        .map((v) => v.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
};

export const getAddressLines = (address = {}) => {
  return [
    address?.fullName,
    [address?.addressLine1, address?.addressLine2].filter(Boolean).join(", "),
    address?.landmark,
    [address?.city, address?.district, address?.state, address?.pincode]
      .filter(Boolean)
      .join(", "),
    address?.country,
    address?.phone ? `Phone: ${address.phone}` : "",
    address?.email ? `Email: ${address.email}` : "",
  ].filter(Boolean);
};

export const getOrderDisplayName = (order = {}) =>
  order?.customer?.fullName ||
  order?.billingAddress?.fullName ||
  order?.shippingAddress?.fullName ||
  "Customer";

export const getPaymentLabel = (method) =>
  PAYMENT_LABELS[method] || method || "-";

export const getApproxGstRate = (order = {}) => {
  if (Number(order?.taxAmount) > 0 && Number(order?.subtotal) > 0) {
    const rate = (Number(order.taxAmount) / Number(order.subtotal)) * 100;
    return Number(rate.toFixed(2));
  }
  return Number(SELLER.defaultGst || 0);
};

export const getTaxableFromInclusive = (price = 0, gstRate = 0) => {
  if (!price || !gstRate) return Number(price || 0);
  return +(price * 100 / (100 + gstRate)).toFixed(2);
};

export const getGstFromInclusive = (price = 0, gstRate = 0) => {
  if (!price || !gstRate) return 0;
  const taxable = getTaxableFromInclusive(price, gstRate);
  return +(Number(price) - Number(taxable)).toFixed(2);
};

export const buildInvoiceNumber = (order = {}) =>
  `INV-${order?.orderNumber || "DRAFT"}`;

export const fetchOrderByOrderNumber = async (orderNumber) => {
  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const res = await fetch(
      `${base}/api/orders/order-number/${encodeURIComponent(orderNumber)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch order");

    const data = await res.json();
    return data?.order || data?.data || data;
  } catch {
    return null;
  }
};

export const buildPrintableHtml = ({ orders = [], documentType, renderHtml }) => {
  const content = orders
    .map((order, index) => {
      const pageBreak =
        index === orders.length - 1
          ? ""
          : '<div style="page-break-after: always;"></div>';
      return `${renderHtml(order, documentType)}${pageBreak}`;
    })
    .join("");

  return `
    <html>
      <head>
        <title>${
          documentType === DOCUMENT_TYPES.INVOICE ? "Invoices" : "Packing Slips"
        }</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 24px;
            color: #111827;
            background: #ffffff;
          }
          .invoice-doc {
            width: 100%;
            max-width: 920px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            background: white;
            padding: 24px;
          }
          .row { display: flex; gap: 16px; }
          .between {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .box {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 12px;
          }
          .muted { color: #6b7280; font-size: 12px; }
          .title { font-size: 24px; font-weight: 700; margin: 0 0 6px; }
          .sub { font-size: 13px; color: #6b7280; margin: 0; }
          .logo {
            width: 84px;
            height: 84px;
            object-fit: contain;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: left;
            vertical-align: top;
            font-size: 12px;
          }
          th {
            background: #f9fafb;
          }
          .text-right { text-align: right; }
          .mt-16 { margin-top: 16px; }
          .mt-24 { margin-top: 24px; }
          .small { font-size: 11px; }
          .strong { font-weight: 700; }
          .signature {
            width: 120px;
            height: auto;
            object-fit: contain;
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `;
};