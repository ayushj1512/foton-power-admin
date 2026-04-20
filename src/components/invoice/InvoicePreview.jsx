"use client";

import InvoiceDocument from "./InvoiceDocument";

export default function InvoicePreview({ order, documentType }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Preview</h2>
        <p className="mt-1 text-sm text-black/55">
          Live preview for selected order.
        </p>
      </div>

      {!order ? (
        <div className="rounded-3xl bg-[#fafafa] p-6 text-sm text-black/50 ring-1 ring-black/5">
          Select or fetch an order to preview invoice.
        </div>
      ) : (
        <InvoiceDocument order={order} documentType={documentType} />
      )}
    </div>
  );
}