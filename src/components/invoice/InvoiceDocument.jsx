"use client";

import Image from "next/image";
import {
  DOCUMENT_TYPES,
  INVOICE_SETTINGS,
  PACKING_SLIP_SETTINGS,
  SELLER,
} from "@/constants/invoiceConstants";
import {
  FOTON_LOGO_URL,
  buildInvoiceNumber,
  formatCurrency,
  formatDate,
  getApproxGstRate,
  getCustomerDetailsLines,
  getGstFromInclusive,
  getItemHsnCode,
  getPaymentLabel,
  getTaxableFromInclusive,
} from "./InvoiceHelpers";

export default function InvoiceDocument({
  order,
  documentType = DOCUMENT_TYPES.INVOICE,
}) {
  if (!order) return null;

  const isPacking = documentType === DOCUMENT_TYPES.PACKING;
  const showSku = isPacking
    ? PACKING_SLIP_SETTINGS.showSku
    : INVOICE_SETTINGS.showSku;

  const customerLines = getCustomerDetailsLines(order);
  const gstRate = getApproxGstRate(order);
  const items = Array.isArray(order.items) ? order.items : [];

  const sellerFullAddress = [
    SELLER.address,
    [SELLER.city, SELLER.state, SELLER.pincode].filter(Boolean).join(", "),
    SELLER.country,
  ]
    .filter(Boolean)
    .join(" ");

  const totalQty = items.reduce(
    (acc, item) => acc + Number(item?.quantity || item?.qty || 0),
    0
  );

  return (
    <div className="invoice-doc mx-auto w-full max-w-[860px] bg-white text-black print:max-w-none">
      <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.05)] print:rounded-none print:border-black/10 print:shadow-none">
        <div className="p-[22px] print:p-4">
          <div className="grid gap-[18px] border-b border-black/10 pb-[14px] sm:grid-cols-[1.25fr,0.75fr]">
            <div>
              <Image
                src={FOTON_LOGO_URL}
                alt={SELLER.name || "FOTON"}
                width={164}
                height={50}
                className="mb-[10px] h-[50px] w-[164px] object-contain object-left"
                priority
              />

              <p className="mb-[6px] text-[10px] font-bold uppercase tracking-[0.16em] text-black/50">
                {isPacking ? "Dispatch Address" : "Billing Address"}
              </p>

              <p className="mb-1 text-[14px] font-bold text-black">
                {SELLER.name || "FOTON"}
              </p>

              <div className="space-y-0.5 text-[11px] leading-[1.55] text-black/70">
                <p>{sellerFullAddress || "-"}</p>
                {!isPacking && <p>GSTIN: {SELLER.gstin || "-"}</p>}
                {SELLER.pan ? <p>PAN: {SELLER.pan}</p> : null}
                <p>Email: {SELLER.email || "-"}</p>
                <p>Phone: {SELLER.phone || "-"}</p>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-black/[0.05] bg-[#f7f7f8] px-[14px] py-3">
                <p className="mb-2 text-[16px] font-bold tracking-[0.02em] text-black">
                  {isPacking ? "PACKING SLIP" : "TAX INVOICE"}
                </p>

                <div className="space-y-[5px]">
                  {!isPacking && (
                    <MetaRow
                      label="Invoice No"
                      value={buildInvoiceNumber(order)}
                    />
                  )}
                  <MetaRow label="Order No" value={order.orderNumber || "-"} />
                  <MetaRow
                    label={isPacking ? "Date" : "Date"}
                    value={formatDate(order.createdAt)}
                  />
                  {!isPacking && (
                    <MetaRow
                      label="Payment"
                      value={getPaymentLabel(order?.payment?.method)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-black/10 py-[14px]">
            <p className="mb-[6px] text-[10px] font-bold uppercase tracking-[0.14em] text-black/55">
              Customer Details
            </p>

            <div className="space-y-0.5 text-[11px] leading-[1.55] text-black/70">
              {customerLines.length ? (
                customerLines.map((line, i) => <p key={i}>{line}</p>)
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

          {!isPacking && (
            <div className="py-[10px] text-[11px] text-black/72">
              <span className="font-semibold text-black/80">Payment Mode:</span>{" "}
              {getPaymentLabel(order?.payment?.method)}
              {!!Number(order?.couponDiscount || 0) && (
                <>
                  {"  |  "}
                  <span className="font-semibold text-black/80">Discount:</span>{" "}
                  -{formatCurrency(order?.couponDiscount || 0)}
                </>
              )}
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left">
                <TableHead className="w-[5%]">#</TableHead>
                <TableHead className="w-[41%]">Item</TableHead>
                {showSku && <TableHead className="w-[12%]">SKU</TableHead>}
                {!isPacking && <TableHead className="w-[13%]">Code</TableHead>}
                {!isPacking && <TableHead className="w-[14%]">HSN</TableHead>}
                <TableHead align="center" className="w-[8%]">
                  Qty
                </TableHead>
                {!isPacking && (
                  <>
                    <TableHead align="right" className="w-[9%]">
                      Price
                    </TableHead>
                    <TableHead align="right" className="w-[10%]">
                      GST
                    </TableHead>
                    <TableHead align="right" className="w-[12%]">
                      Total
                    </TableHead>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {items.length ? (
                items.map((item, idx) => {
                  const qty = Number(item?.quantity || item?.qty || 0);
                  const lineTotal = Number(item?.linePayableTotal || 0);
                  const gstAmount = getGstFromInclusive(lineTotal, gstRate);
                  const hsn = getItemHsnCode(item);

                  return (
                    <tr
                      key={item?._id || `${item?.sku || "item"}-${idx}`}
                      className="border-b border-black/[0.08] align-top last:border-b-0"
                    >
                      <td className="py-[10px] pr-2 text-[11px] text-black/74">
                        {idx + 1}
                      </td>

                      <td className="py-[10px] pr-2">
                        <div className="text-[11px] font-semibold text-black">
                          {item?.name || "-"}
                        </div>

                        <div className="mt-[3px] text-[10px] text-black/50">
                          {item?.color ? `Color: ${item.color}` : "Color: -"}
                        </div>
                      </td>

                      {showSku && (
                        <td className="py-[10px] pr-2 text-[11px] text-black/74">
                          {item?.sku || "-"}
                        </td>
                      )}

                      {!isPacking && (
                        <td className="py-[10px] pr-2 text-[11px] text-black/74">
                          {item?.productCode || "-"}
                        </td>
                      )}

                      {!isPacking && (
                        <td className="py-[10px] pr-2 text-[11px] text-black/74">
                          {hsn}
                        </td>
                      )}

                      <td className="py-[10px] text-center text-[11px] text-black/74">
                        {qty}
                      </td>

                      {!isPacking && (
                        <>
                          <td className="py-[10px] text-right text-[11px] text-black/74">
                            {formatCurrency(item?.unitPayable || 0)}
                          </td>
                          <td className="py-[10px] text-right text-[11px] text-black/74">
                            {formatCurrency(gstAmount)}
                          </td>
                          <td className="py-[10px] text-right text-[11px] font-medium text-black">
                            {formatCurrency(lineTotal)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={showSku ? (isPacking ? 4 : 8) : isPacking ? 2 : 7}
                    className="py-8 text-center text-[11px] text-black/45"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            className={`mt-[6px] grid gap-[18px] border-t border-black/10 pt-[14px] ${
              isPacking ? "sm:grid-cols-[1fr,240px]" : "sm:grid-cols-[1fr,240px]"
            }`}
          >
            <div>
              {!isPacking ? (
                <>
                  <CompactInfoCard title="Notes">
                    <p>{INVOICE_SETTINGS.footerNote}</p>
                  </CompactInfoCard>

                  {!!INVOICE_SETTINGS.terms?.length && (
                    <CompactInfoCard title="Terms" className="mt-[10px]">
                      <ul className="space-y-1 pl-4">
                        {INVOICE_SETTINGS.terms.map((term, index) => (
                          <li key={index} className="list-disc">
                            {term}
                          </li>
                        ))}
                      </ul>
                    </CompactInfoCard>
                  )}
                </>
              ) : (
                <CompactInfoCard title="Packing Summary">
                  <div className="space-y-1 text-[11px]">
                    <p>Order No: {order.orderNumber || "-"}</p>
                    <p>Total Items: {items.length}</p>
                    <p>Total Qty: {totalQty}</p>
                  </div>
                </CompactInfoCard>
              )}
            </div>

            <div>
              {!isPacking ? (
                <div className="rounded-2xl border border-black/[0.05] bg-[#f7f7f8] p-[14px]">
                  <p className="mb-[6px] text-[10px] font-bold uppercase tracking-[0.14em] text-black/55">
                    Totals
                  </p>

                  <div className="space-y-[5px]">
                    <SummaryRow
                      label="Subtotal"
                      value={formatCurrency(Number(order?.subtotal || 0))}
                    />

                    {!!Number(order?.couponDiscount || 0) && (
                      <SummaryRow
                        label="Discount"
                        value={`-${formatCurrency(
                          Number(order?.couponDiscount || 0)
                        )}`}
                      />
                    )}

                    <SummaryRow
                      label="Tax"
                      value={formatCurrency(Number(order?.taxAmount || 0))}
                    />

                    <div className="mt-[10px] border-t border-black/10 pt-[10px]">
                      <SummaryRow
                        label="Grand Total"
                        value={formatCurrency(Number(order?.payableAmount || 0))}
                        strong
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-black/[0.05] bg-[#f7f7f8] p-[14px]">
                  <p className="mb-[6px] text-[10px] font-bold uppercase tracking-[0.14em] text-black/55">
                    Totals
                  </p>
                  <div className="space-y-[5px]">
                    <SummaryRow label="Items" value={items.length} />
                    <SummaryRow label="Qty" value={totalQty} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-[14px] border-t border-black/10 pt-[10px] text-center text-[10px] leading-[1.55] text-black/70">
            <p>
              <span className="font-semibold text-black/80">
                Registered Address:
              </span>{" "}
              {sellerFullAddress || "-"}
            </p>

            {!isPacking && (
              <p>
                <span className="font-semibold text-black/80">GSTIN:</span>{" "}
                {SELLER.gstin || "-"}
                {SELLER.pan ? (
                  <>
                    {"  |  "}
                    <span className="font-semibold text-black/80">PAN:</span>{" "}
                    {SELLER.pan}
                  </>
                ) : null}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-black/55">{label}</span>
      <span className="text-[11px] font-semibold text-black">{value || "-"}</span>
    </div>
  );
}

function TableHead({ children, align = "left", className = "" }) {
  return (
    <th
      className={`py-2 pr-2 text-[9px] font-bold uppercase tracking-[0.12em] text-black/52 ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      } ${className}`}
    >
      {children}
    </th>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={
          strong
            ? "text-[12px] font-bold text-black"
            : "text-[11px] text-black/60"
        }
      >
        {label}
      </span>
      <span
        className={
          strong
            ? "text-[12px] font-bold text-black"
            : "text-[11px] font-semibold text-black/82"
        }
      >
        {value}
      </span>
    </div>
  );
}

function CompactInfoCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-black/[0.05] bg-[#f7f7f8] p-[14px] ${className}`}>
      <p className="mb-[6px] text-[10px] font-bold uppercase tracking-[0.14em] text-black/55">
        {title}
      </p>
      <div className="text-[11px] leading-[1.55] text-black/70">{children}</div>
    </div>
  );
}