"use client";

import Image from "next/image";
import {
  DOCUMENT_TYPES,
  INVOICE_SETTINGS,
  PACKING_SLIP_SETTINGS,
  SELLER,
} from "@/constants/invoiceConstants";
import {
  buildInvoiceNumber,
  formatCurrency,
  formatDate,
  getAddressLines,
  getApproxGstRate,
  getGstFromInclusive,
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

  const billingLines = getAddressLines(order.billingAddress || {});
  const shippingLines = getAddressLines(order.shippingAddress || {});
  const gstRate = getApproxGstRate(order);

  const sellerFullAddress = [
    SELLER.address,
    [SELLER.city, SELLER.state, SELLER.pincode].filter(Boolean).join(", "),
    SELLER.country,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 print:rounded-none print:p-0 print:shadow-none print:ring-0">
      <div className="rounded-[28px] border border-black/10 bg-white p-5 print:rounded-none print:border print:border-black/20 sm:p-6">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#fafafa] ring-1 ring-black/5">
              {SELLER.logo ? (
                <Image
                  src={SELLER.logo}
                  alt={SELLER.brand || SELLER.name}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              ) : null}
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                {SELLER.name}
              </h2>

              <p className="mt-1 max-w-md text-sm leading-6 text-black/60">
                {sellerFullAddress}
              </p>

              <div className="mt-2 space-y-1 text-xs text-black/55">
                <p>Phone: {SELLER.phone || "-"}</p>
                <p>Email: {SELLER.email || "-"}</p>
                <p>Website: {SELLER.website || "-"}</p>
                {!isPacking && <p>GSTIN: {SELLER.gstin || "-"}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm ring-1 ring-black/5 sm:min-w-[250px]">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/45">
              {isPacking ? "Packing Slip" : "Tax Invoice"}
            </p>

            <div className="mt-3 space-y-1.5">
              {!isPacking && (
                <InfoRow label="Invoice No." value={buildInvoiceNumber(order)} />
              )}

              <InfoRow label="Order No." value={order.orderNumber || "-"} />

              <InfoRow
                label={isPacking ? "Created" : "Invoice Date"}
                value={formatDate(order.createdAt)}
              />

              {!isPacking && (
                <InfoRow
                  label="Payment"
                  value={getPaymentLabel(order?.payment?.method)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AddressCard title="Billing Address" lines={billingLines} />
          <AddressCard title="Shipping Address" lines={shippingLines} />
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[#fafafa]">
                <tr className="border-b border-black/10">
                  <TableHead>#</TableHead>
                  <TableHead>Item</TableHead>
                  {showSku && <TableHead>SKU</TableHead>}
                  <TableHead>Qty</TableHead>

                  {!isPacking && (
                    <>
                      <TableHead align="right">Unit Price</TableHead>
                      <TableHead align="right">Taxable</TableHead>
                      <TableHead align="right">GST</TableHead>
                      <TableHead align="right">Total</TableHead>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {(order.items || []).map((item, index) => {
                  const lineTotal = Number(item?.linePayableTotal || 0);
                  const taxable = getTaxableFromInclusive(lineTotal, gstRate);
                  const gstAmount = getGstFromInclusive(lineTotal, gstRate);

                  return (
                    <tr
                      key={item?._id || `${item?.sku || "item"}-${index}`}
                      className="border-b border-black/10 last:border-b-0"
                    >
                      <td className="px-4 py-3 align-top text-black/70">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-black">
                          {item?.name || "-"}
                        </p>

                        <div className="mt-1 text-xs text-black/50">
                          {item?.productCode ? (
                            <p>Code: {item.productCode}</p>
                          ) : null}
                          {item?.color ? <p>Color: {item.color}</p> : null}
                          {item?.size ? <p>Size: {item.size}</p> : null}
                          {!isPacking &&
                          INVOICE_SETTINGS.showHsn &&
                          item?.hsnCode ? (
                            <p>HSN: {item.hsnCode}</p>
                          ) : null}
                        </div>
                      </td>

                      {showSku && (
                        <td className="px-4 py-3 align-top text-black/70">
                          {item?.sku || "-"}
                        </td>
                      )}

                      <td className="px-4 py-3 align-top text-black/70">
                        {item?.quantity || 0}
                      </td>

                      {!isPacking && (
                        <>
                          <td className="px-4 py-3 text-right align-top text-black/70">
                            {formatCurrency(item?.unitPayable || 0)}
                          </td>
                          <td className="px-4 py-3 text-right align-top text-black/70">
                            {formatCurrency(taxable)}
                          </td>
                          <td className="px-4 py-3 text-right align-top text-black/70">
                            {formatCurrency(gstAmount)}
                          </td>
                          <td className="px-4 py-3 text-right align-top font-medium text-black">
                            {formatCurrency(lineTotal)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {!isPacking && (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr,340px]">
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Notes & Terms
              </p>

              <div className="mt-3 space-y-2 text-sm text-black/65">
                <p>{INVOICE_SETTINGS.footerNote}</p>

                {!!INVOICE_SETTINGS.terms?.length && (
                  <ul className="list-disc space-y-1 pl-5">
                    {INVOICE_SETTINGS.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                )}
              </div>

              {!!order?.shipment?.courierName && (
                <div className="mt-4 rounded-2xl bg-[#fafafa] p-4 ring-1 ring-black/5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                    Shipment Details
                  </p>

                  <div className="mt-2 space-y-1.5 text-sm text-black/65">
                    <p>Courier: {order?.shipment?.courierName || "-"}</p>
                    <p>AWB: {order?.shipment?.awbNumber || "-"}</p>
                    <p>Tracking: {order?.shipment?.trackingNumber || "-"}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                Amount Summary
              </p>

              <div className="mt-3 space-y-2 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(order?.subtotal || 0)}
                />

                {!!Number(order?.couponDiscount || 0) && (
                  <SummaryRow
                    label="Coupon Discount"
                    value={`- ${formatCurrency(order?.couponDiscount || 0)}`}
                  />
                )}

                {!!Number(order?.additionalDiscount || 0) && (
                  <SummaryRow
                    label="Additional Discount"
                    value={`- ${formatCurrency(
                      order?.additionalDiscount || 0
                    )}`}
                  />
                )}

                {!!Number(order?.shippingCharge || 0) && (
                  <SummaryRow
                    label="Shipping"
                    value={formatCurrency(order?.shippingCharge || 0)}
                  />
                )}

                {!!Number(order?.codCharge || 0) && (
                  <SummaryRow
                    label="COD Charges"
                    value={formatCurrency(order?.codCharge || 0)}
                  />
                )}

                {!!Number(order?.taxAmount || 0) && (
                  <>
                    <SummaryRow
                      label={`GST (${gstRate}%)`}
                      value={formatCurrency(order?.taxAmount || 0)}
                    />
                    <SummaryRow
                      label="CGST"
                      value={formatCurrency(Number(order?.taxAmount || 0) / 2)}
                    />
                    <SummaryRow
                      label="SGST"
                      value={formatCurrency(Number(order?.taxAmount || 0) / 2)}
                    />
                  </>
                )}

                {!!Number(order?.roundOff || 0) && (
                  <SummaryRow
                    label="Round Off"
                    value={formatCurrency(order?.roundOff || 0)}
                  />
                )}

                <div className="my-2 border-t border-dashed border-black/10" />

                <SummaryRow
                  label="Grand Total"
                  value={formatCurrency(order?.payableAmount || 0)}
                  strong
                />
              </div>

              <div className="mt-5 border-t border-black/10 pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                  For {SELLER.name}
                </p>

                {SELLER.signature ? (
                  <div className="relative mt-3 h-16 w-32">
                    <Image
                      src={SELLER.signature}
                      alt="Authorized Signature"
                      fill
                      sizes="128px"
                      className="object-contain object-left"
                    />
                  </div>
                ) : null}

                <p className="mt-2 text-sm text-black/60">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-black/55">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function AddressCard({ title, lines = [] }) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
        {title}
      </p>
      <div className="mt-3 space-y-1.5 text-sm text-black/70">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function TableHead({ children, align = "left" }) {
  return (
    <th
      className={`px-4 py-3 font-medium text-black/65 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-semibold text-black" : "text-black/60"}>
        {label}
      </span>
      <span className={strong ? "font-semibold text-black" : "text-black/80"}>
        {value}
      </span>
    </div>
  );
}