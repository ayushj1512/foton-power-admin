"use client";

import { Download, FileText, Package, Printer, Search, X } from "lucide-react";
import { DOCUMENT_TYPES } from "@/constants/invoiceConstants";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function InvoiceToolbar({
  documentType,
  setDocumentType,
  searchInput,
  setSearchInput,
  parsedOrderNumbers,
  orders,
  selectedOrderNumbers,
  isLoading,
  onFetchOrders,
  onClear,
  onPrintSelected,
  onDownloadSelected,
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/45">
            Orders / Invoice Module
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            Invoice & Packing Slip
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-black/55">
            Search order numbers, preview documents, print in bulk and download.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDocumentType(DOCUMENT_TYPES.INVOICE)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
              documentType === DOCUMENT_TYPES.INVOICE
                ? "bg-black text-white"
                : "bg-black/5 text-black hover:bg-black/10"
            }`}
          >
            <FileText className="h-4 w-4" />
            Invoice
          </button>

          <button
            onClick={() => setDocumentType(DOCUMENT_TYPES.PACKING)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
              documentType === DOCUMENT_TYPES.PACKING
                ? "bg-black text-white"
                : "bg-black/5 text-black hover:bg-black/10"
            }`}
          >
            <Package className="h-4 w-4" />
            Packing Slip
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="rounded-3xl bg-[#fafafa] p-4 ring-1 ring-black/5">
          <label className="mb-2 block text-sm font-medium">
            Enter order numbers
          </label>

          <textarea
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-2xl border-0 bg-white p-4 text-sm outline-none ring-1 ring-black/10 placeholder:text-black/30 focus:ring-2 focus:ring-black"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={onFetchOrders}
              disabled={isLoading || !parsedOrderNumbers.length}
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {isLoading ? "Fetching..." : "Fetch Orders"}
            </button>

            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/10"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-[#fafafa] p-4 ring-1 ring-black/5">
          <p className="text-sm font-medium">Quick Summary</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatCard label="Parsed" value={parsedOrderNumbers.length} />
            <StatCard label="Loaded" value={orders.length} />
            <StatCard label="Selected" value={selectedOrderNumbers.length} />
            <StatCard
              label="Type"
              value={
                documentType === DOCUMENT_TYPES.INVOICE ? "Invoice" : "Packing"
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onPrintSelected}
              disabled={!orders.length}
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              Print Selected
            </button>

            <button
              onClick={onDownloadSelected}
              disabled={!orders.length}
              className="inline-flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-2 text-sm font-medium text-black hover:bg-black/10 disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}