import {
  DOCUMENT_TYPES,
  PAYMENT_LABELS,
  SELLER,
} from "@/constants/invoiceConstants";
import { INVOICE_SETTINGS } from "@/constants/invoiceConstants";

export const FOTON_LOGO_URL =
  "https://res.cloudinary.com/dcayfmx5m/image/upload/v1776768134/foton_media/general/zvur9sbtdv9mrubnbdun.png";

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

export const getCustomerDetailsLines = (order = {}) => {
  const shipping = getAddressLines(order?.shippingAddress || {});
  const billing = getAddressLines(order?.billingAddress || {});
  return shipping.length ? shipping : billing;
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
  return +((price * 100) / (100 + gstRate)).toFixed(2);
};

export const getGstFromInclusive = (price = 0, gstRate = 0) => {
  if (!price || !gstRate) return 0;
  const taxable = getTaxableFromInclusive(price, gstRate);
  return +(Number(price) - Number(taxable)).toFixed(2);
};

export const getItemHsnCode = (item = {}) =>
  String(
    item?.hsnCode ||
      item?.productSnapshot?.hsnCode ||
      item?.product?.hsnCode ||
      item?.productId?.hsnCode ||
      "62105000"
  ).trim() || "62105000";

export const buildInvoiceNumber = (order = {}) => {
  const raw =
    order?.invoiceNumber ||
    order?.invoiceNo ||
    order?.documentNumber ||
    order?.orderNumber ||
    "DRAFT";

  return String(raw).trim();
};

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

const escapeHtml = (value = "") =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderLinesHtml = (lines = []) =>
  lines.length
    ? lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")
    : "<div>-</div>";

const renderTermsHtml = (terms = []) => {
  if (!terms.length) return "";
  return terms.map((term) => `<li>${escapeHtml(term)}</li>`).join("");
};

const getSellerAddressString = () =>
  [
    SELLER.address,
    [SELLER.city, SELLER.state, SELLER.pincode].filter(Boolean).join(", "),
    SELLER.country,
  ]
    .filter(Boolean)
    .join(", ");

export const renderPrintableInvoiceBlock = (
  order = {},
  documentType = DOCUMENT_TYPES.INVOICE
) => {
  const isPacking = documentType === DOCUMENT_TYPES.PACKING;
  const items = Array.isArray(order?.items) ? order.items : [];
  const customerLines = getCustomerDetailsLines(order);
  const gstRate = getApproxGstRate(order);
  const totalQty = items.reduce(
    (acc, item) => acc + Number(item?.quantity || item?.qty || 0),
    0
  );

  const sellerAddress = getSellerAddressString();

  const rowsHtml = items.length
    ? items
        .map((item, idx) => {
          const qty = Number(item?.quantity || item?.qty || 0);
          const lineTotal = Number(item?.linePayableTotal || 0);
          const gstAmount = getGstFromInclusive(lineTotal, gstRate);
          const hsn = getItemHsnCode(item);

          return `
            <tr>
              <td>${idx + 1}</td>
              <td>
                <div class="item-name">${escapeHtml(item?.name || "-")}</div>
                <div class="item-meta">Color: ${escapeHtml(item?.color || "-")}</div>
              </td>
              ${
                isPacking
                  ? ""
                  : `<td>${escapeHtml(item?.productCode || "-")}</td>`
              }
              ${isPacking ? "" : `<td>${escapeHtml(hsn)}</td>`}
              <td class="text-center">${qty}</td>
              ${
                isPacking
                  ? ""
                  : `
                    <td class="text-right">${escapeHtml(
                      formatCurrency(item?.unitPayable || 0)
                    )}</td>
                    <td class="text-right">${escapeHtml(
                      formatCurrency(gstAmount)
                    )}</td>
                    <td class="text-right">${escapeHtml(
                      formatCurrency(lineTotal)
                    )}</td>
                  `
              }
            </tr>
          `;
        })
        .join("")
    : `
      <tr>
        <td colspan="${isPacking ? 3 : 8}" class="empty-state">No items found.</td>
      </tr>
    `;

  const notesHtml = isPacking
    ? `
      <div class="note-card">
        <p class="section-title">Packing Summary</p>
        <div class="note-text">
          <div>Order No: ${escapeHtml(order?.orderNumber || "-")}</div>
          <div>Total Items: ${items.length}</div>
          <div>Total Qty: ${totalQty}</div>
        </div>
      </div>
    `
    : `
      <div class="note-card">
        <p class="section-title">Notes</p>
        <div class="note-text">
          ${escapeHtml(
            INVOICE_SETTINGS?.footerNote ||
              "This is a computer generated invoice and does not require a physical signature."
          )}
        </div>
      </div>

      ${
        INVOICE_SETTINGS?.terms?.length
          ? `
            <div class="note-card note-card-spaced">
              <p class="section-title">Terms</p>
              <div class="note-text">
                <ul class="terms-list">
                  ${renderTermsHtml(INVOICE_SETTINGS.terms)}
                </ul>
              </div>
            </div>
          `
          : ""
      }
    `;

  const totalsHtml = isPacking
    ? `
      <div class="totals-card">
        <p class="section-title">Totals</p>
        <div class="summary-row"><span>Items</span><span>${items.length}</span></div>
        <div class="summary-row"><span>Qty</span><span>${totalQty}</span></div>
      </div>
    `
    : `
      <div class="totals-card">
        <p class="section-title">Totals</p>

        <div class="summary-row">
          <span>Subtotal</span>
          <span>${escapeHtml(formatCurrency(Number(order?.subtotal || 0)))}</span>
        </div>

        ${
          Number(order?.couponDiscount || 0)
            ? `
              <div class="summary-row">
                <span>Discount</span>
                <span>-${escapeHtml(
                  formatCurrency(Number(order?.couponDiscount || 0))
                )}</span>
              </div>
            `
            : ""
        }

        <div class="summary-row">
          <span>Tax</span>
          <span>${escapeHtml(formatCurrency(Number(order?.taxAmount || 0)))}</span>
        </div>

        <div class="summary-row total">
          <span>Grand Total</span>
          <span>${escapeHtml(
            formatCurrency(Number(order?.payableAmount || 0))
          )}</span>
        </div>
      </div>
    `;

  return `
    <div class="page">
      <div class="sheet">
        <div class="inner">
          <div class="top">
            <div>
              <img
                class="logo"
                src="${escapeHtml(FOTON_LOGO_URL)}"
                alt="${escapeHtml(SELLER.name || "FOTON")}"
              />

              <p class="eyebrow">${isPacking ? "Dispatch Address" : "Billing Address"}</p>
              <p class="seller-name">${escapeHtml(SELLER.name || "FOTON")}</p>

              <div class="seller-lines">
                <div>${escapeHtml(sellerAddress || "-")}</div>
                ${!isPacking ? `<div>GSTIN: ${escapeHtml(SELLER.gstin || "-")}</div>` : ""}
                ${SELLER.pan ? `<div>PAN: ${escapeHtml(SELLER.pan)}</div>` : ""}
                <div>Email: ${escapeHtml(SELLER.email || "-")}</div>
                <div>Phone: ${escapeHtml(SELLER.phone || "-")}</div>
              </div>
            </div>

            <div>
              <div class="meta-card">
                <p class="doc-title">${isPacking ? "PACKING SLIP" : "TAX INVOICE"}</p>
                <div class="meta-list">
                  ${
                    !isPacking
                      ? `<div class="meta-row"><span>Invoice No</span><span>${escapeHtml(
                          buildInvoiceNumber(order)
                        )}</span></div>`
                      : ""
                  }
                  <div class="meta-row"><span>Order No</span><span>${escapeHtml(
                    order?.orderNumber || "-"
                  )}</span></div>
                  <div class="meta-row"><span>Date</span><span>${escapeHtml(
                    formatDate(order?.createdAt)
                  )}</span></div>
                  ${
                    !isPacking
                      ? `<div class="meta-row"><span>Payment</span><span>${escapeHtml(
                          getPaymentLabel(order?.payment?.method)
                        )}</span></div>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="address-wrap">
            <p class="section-title">Customer Details</p>
            <div class="address-lines">
              ${renderLinesHtml(customerLines)}
            </div>
          </div>

          ${
            !isPacking
              ? `
                <div class="payment-line">
                  <strong>Payment Mode:</strong> ${escapeHtml(
                    getPaymentLabel(order?.payment?.method)
                  )}
                  ${
                    Number(order?.couponDiscount || 0)
                      ? `&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Discount:</strong> -${escapeHtml(
                          formatCurrency(order?.couponDiscount || 0)
                        )}`
                      : ""
                  }
                </div>
              `
              : ""
          }

          <table>
            <thead>
              <tr>
                <th style="width: 4%">#</th>
                <th style="width: 43%">Item</th>
                ${isPacking ? "" : '<th style="width: 12%">Code</th>'}
                ${isPacking ? "" : '<th style="width: 13%">HSN</th>'}
                <th style="width: 7%" class="text-center">Qty</th>
                ${
                  isPacking
                    ? ""
                    : `
                      <th style="width: 8%" class="text-right">Price</th>
                      <th style="width: 7%" class="text-right">GST</th>
                      <th style="width: 10%" class="text-right">Total</th>
                    `
                }
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="bottom">
            <div>
              ${notesHtml}
            </div>
            <div>
              ${totalsHtml}
            </div>
          </div>

          <div class="footer">
            <div>
              <strong>Registered Address:</strong>
              ${escapeHtml(sellerAddress || "-")}
            </div>
            ${
              !isPacking
                ? `
                  <div>
                    <strong>GSTIN:</strong> ${escapeHtml(SELLER.gstin || "-")}
                    ${
                      SELLER.pan
                        ? ` &nbsp; | &nbsp; <strong>PAN:</strong> ${escapeHtml(
                            SELLER.pan
                          )}`
                        : ""
                    }
                  </div>
                `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
};

export const buildPrintableHtml = ({
  orders = [],
  documentType,
  renderHtml,
}) => {
  const content = orders
    .map((order, index) => {
      const pageBreak =
        index === orders.length - 1
          ? ""
          : '<div class="page-break"></div>';

      const docHtml =
        typeof renderHtml === "function"
          ? renderHtml(order, documentType)
          : renderPrintableInvoiceBlock(order, documentType);

      return `${docHtml}${pageBreak}`;
    })
    .join("");

  return `
    <html>
      <head>
        <title>${
          documentType === DOCUMENT_TYPES.INVOICE ? "Invoices" : "Packing Slips"
        }</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          :root {
            --bg: #f3f4f6;
            --card: #ffffff;
            --muted: #6b7280;
            --soft: #f7f7f8;
            --line: rgba(17, 24, 39, 0.08);
            --text: #111827;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Inter, Arial, Helvetica, sans-serif;
          }

          body {
            padding: 10px;
          }

          .invoice-print-root {
            width: 100%;
          }

          .page {
            max-width: 840px;
            margin: 0 auto;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .page-break {
            page-break-after: always;
            break-after: page;
            height: 0;
          }

          .sheet {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .inner {
            padding: 12px 14px;
          }

          .top {
            display: grid;
            grid-template-columns: 1.22fr 0.78fr;
            gap: 12px;
            align-items: start;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--line);
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .logo {
            width: 138px;
            height: 38px;
            object-fit: contain;
            object-position: left center;
            display: block;
            margin-bottom: 6px;
          }

          .eyebrow {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.13em;
            text-transform: uppercase;
            color: rgba(17, 24, 39, 0.48);
            margin: 0 0 3px;
          }

          .seller-name {
            font-size: 11px;
            font-weight: 700;
            margin: 0 0 2px;
          }

          .seller-lines,
          .meta-list,
          .address-lines,
          .note-text,
          .footer {
            font-size: 9px;
            line-height: 1.32;
            color: rgba(17, 24, 39, 0.72);
          }

          .meta-card,
          .totals-card,
          .note-card {
            background: var(--soft);
            border: 1px solid rgba(17, 24, 39, 0.04);
            border-radius: 10px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .meta-card {
            padding: 8px 10px;
          }

          .doc-title {
            font-size: 12px;
            font-weight: 700;
            margin: 0 0 5px;
            letter-spacing: 0.01em;
          }

          .meta-row,
          .summary-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .meta-row + .meta-row,
          .summary-row + .summary-row {
            margin-top: 3px;
          }

          .meta-row span:first-child,
          .summary-row span:first-child {
            color: rgba(17, 24, 39, 0.55);
          }

          .meta-row span:last-child,
          .summary-row span:last-child {
            font-weight: 600;
            color: var(--text);
          }

          .address-wrap {
            padding: 8px 0;
            border-bottom: 1px solid var(--line);
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .section-title {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(17, 24, 39, 0.52);
            margin: 0 0 4px;
          }

          .payment-line {
            padding: 6px 0 7px;
            font-size: 9px;
            color: rgba(17, 24, 39, 0.72);
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .payment-line strong {
            color: rgba(17, 24, 39, 0.82);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          thead th {
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.11em;
            color: rgba(17, 24, 39, 0.52);
            text-align: left;
            padding: 5px 5px 5px 0;
            border-bottom: 1px solid var(--line);
            line-height: 1.1;
          }

          tbody td {
            font-size: 8px;
            color: rgba(17, 24, 39, 0.74);
            padding: 6px 5px 6px 0;
            border-bottom: 1px solid rgba(17, 24, 39, 0.06);
            vertical-align: top;
            line-height: 1.2;
          }

          tbody tr:last-child td {
            border-bottom: none;
          }

          tr,
          td,
          th {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .text-center {
            text-align: center;
          }

          .text-right {
            text-align: right;
          }

          .item-name {
            font-weight: 600;
            color: var(--text);
            margin-bottom: 1px;
            line-height: 1.2;
          }

          .item-meta {
            font-size: 7px;
            color: rgba(17, 24, 39, 0.48);
            line-height: 1.15;
          }

          .bottom {
            display: grid;
            grid-template-columns: 1fr 190px;
            gap: 10px;
            padding-top: 8px;
            border-top: 1px solid var(--line);
            margin-top: 3px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .note-card,
          .totals-card {
            padding: 8px 10px;
          }

          .note-card-spaced {
            margin-top: 6px;
          }

          .terms-list {
            margin: 0;
            padding-left: 12px;
          }

          .terms-list li {
            line-height: 1.2;
          }

          .terms-list li + li {
            margin-top: 2px;
          }

          .totals-card .summary-row.total {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid var(--line);
          }

          .totals-card .summary-row.total span {
            font-size: 9px;
            font-weight: 700;
            color: var(--text);
          }

          .footer {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid var(--line);
            text-align: center;
            font-size: 7px;
            line-height: 1.25;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .empty-state {
            text-align: center;
            color: rgba(17, 24, 39, 0.45);
            padding: 14px 0;
          }

          @page {
            size: A4;
            margin: 6mm;
          }

          @media print {
            html,
            body {
              background: #ffffff !important;
            }

            body {
              padding: 0 !important;
            }

            .page {
              max-width: none !important;
              margin: 0 !important;
            }

            .sheet {
              border-radius: 0 !important;
              box-shadow: none !important;
              border: 1px solid rgba(17, 24, 39, 0.1) !important;
            }

            .inner {
              padding: 10px 12px !important;
            }

            .meta-card,
            .note-card,
            .totals-card {
              background: #f7f7f8 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-print-root">
          ${content}
        </div>
      </body>
    </html>
  `;
};