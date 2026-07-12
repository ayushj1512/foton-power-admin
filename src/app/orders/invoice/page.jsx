"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Package,
  Search,
  RefreshCcw,
  CheckSquare,
  Square,
  Eye,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { DOCUMENT_TYPES } from "@/constants/invoiceConstants";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import {
  buildPrintableHtml,
  fetchOrderByOrderNumber,
  formatCurrency,
  formatDate,
  getOrderDisplayName,
  sanitizeOrderNumbers,
} from "@/components/invoice/InvoiceHelpers";
import { useAdminOrderStore } from "@/store/adminOrderStore";

const PAGE_SIZE = 10;

function SegmentedButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-black text-white"
          : "bg-black/[0.04] text-black hover:bg-black/[0.07]"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/5">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

function OrderRow({
  order,
  checked,
  active,
  onToggle,
  onPreview,
}) {
  return (
    <div
      className={`rounded-3xl p-4 transition ring-1 ${
        active
          ? "bg-black text-white ring-black"
          : "bg-white text-black ring-black/5 hover:bg-black/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(order.orderNumber)}
          className={`mt-0.5 rounded-xl p-1.5 transition ${
            active ? "bg-white/10" : "bg-black/5"
          }`}
        >
          {checked ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onPreview(order.orderNumber)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {order.orderNumber || "—"}
              </p>
              <p
                className={`mt-1 truncate text-sm ${
                  active ? "text-white/75" : "text-black/55"
                }`}
              >
                {getOrderDisplayName(order)}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                active
                  ? "bg-white/10 text-white"
                  : "bg-black/5 text-black/70"
              }`}
            >
              {order.orderStatus || "processing"}
            </span>
          </div>

          <div
            className={`mt-3 grid grid-cols-2 gap-2 text-xs ${
              active ? "text-white/70" : "text-black/50"
            }`}
          >
            <p>{formatDate(order.createdAt)}</p>
            <p className="text-right">
              {formatCurrency(order.payableAmount || 0)}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPreview(order.orderNumber)}
          className={`rounded-xl p-2 transition ${
            active ? "bg-white/10" : "bg-black/5"
          }`}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function OrdersInvoicePage() {
  const {
    orders: storeOrders = [],
    pagination,
    fetchOrders,
    isFetchingOrders,
    isLoading,
    error,
  } = useAdminOrderStore();

  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES.INVOICE);
  const [searchInput, setSearchInput] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);
  const [previewOrderNumber, setPreviewOrderNumber] = useState(null);
  const [page, setPage] = useState(1);
  const [storeSearch, setStoreSearch] = useState("");
  const [manualOrdersMap, setManualOrdersMap] = useState({});

  const parsedOrderNumbers = useMemo(
    () => sanitizeOrderNumbers(searchInput),
    [searchInput]
  );

  const loadOrders = useCallback(async () => {
    await fetchOrders({
      page,
      limit: PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: storeSearch || undefined,
      orderNumber: storeSearch || undefined,
    }).catch(() => {});
  }, [fetchOrders, page, storeSearch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const mergedOrders = useMemo(() => {
    const map = new Map();

    storeOrders.forEach((order) => {
      if (order?.orderNumber) {
        map.set(order.orderNumber, order);
      }
    });

    Object.values(manualOrdersMap).forEach((order) => {
      if (order?.orderNumber) {
        map.set(order.orderNumber, order);
      }
    });

    return Array.from(map.values());
  }, [storeOrders, manualOrdersMap]);

  const currentListOrders = useMemo(() => {
    const manualSet = new Set(parsedOrderNumbers);
    if (!manualSet.size) return storeOrders;

    const preferred = mergedOrders.filter((order) =>
      manualSet.has(order?.orderNumber)
    );

    return preferred.length ? preferred : storeOrders;
  }, [mergedOrders, parsedOrderNumbers, storeOrders]);

  const selectedOrders = useMemo(() => {
    return mergedOrders.filter((order) =>
      selectedOrderNumbers.includes(order?.orderNumber)
    );
  }, [mergedOrders, selectedOrderNumbers]);

  const previewOrder = useMemo(() => {
    return (
      mergedOrders.find((order) => order?.orderNumber === previewOrderNumber) ||
      selectedOrders[0] ||
      currentListOrders[0] ||
      mergedOrders[0] ||
      null
    );
  }, [mergedOrders, previewOrderNumber, selectedOrders, currentListOrders]);

  const handleFetchByOrderNumbers = async () => {
    const orderNumbers = sanitizeOrderNumbers(searchInput);
    if (!orderNumbers.length) return;

    setManualLoading(true);

    try {
      const results = await Promise.all(
        orderNumbers.map((orderNumber) => fetchOrderByOrderNumber(orderNumber))
      );

      const validOrders = results.filter(Boolean);

      const nextMap = {};
      validOrders.forEach((order) => {
        if (order?.orderNumber) nextMap[order.orderNumber] = order;
      });

      setManualOrdersMap((prev) => ({
        ...prev,
        ...nextMap,
      }));

      if (validOrders.length) {
        setSelectedOrderNumbers((prev) => {
          const set = new Set(prev);
          validOrders.forEach((o) => {
            if (o?.orderNumber) set.add(o.orderNumber);
          });
          return Array.from(set);
        });

        setPreviewOrderNumber(validOrders[0]?.orderNumber || null);
      }
    } finally {
      setManualLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadOrders();

    if (parsedOrderNumbers.length) {
      await handleFetchByOrderNumbers();
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setManualOrdersMap({});
  };

  const handleToggleSelectOne = (orderNumber) => {
    setSelectedOrderNumbers((prev) =>
      prev.includes(orderNumber)
        ? prev.filter((v) => v !== orderNumber)
        : [...prev, orderNumber]
    );
  };

  const handleToggleSelectAll = () => {
    const visibleOrderNumbers = currentListOrders
      .map((o) => o?.orderNumber)
      .filter(Boolean);

    const allSelected =
      visibleOrderNumbers.length > 0 &&
      visibleOrderNumbers.every((num) => selectedOrderNumbers.includes(num));

    if (allSelected) {
      setSelectedOrderNumbers((prev) =>
        prev.filter((num) => !visibleOrderNumbers.includes(num))
      );
    } else {
      setSelectedOrderNumbers((prev) => {
        const set = new Set(prev);
        visibleOrderNumbers.forEach((num) => set.add(num));
        return Array.from(set);
      });
    }
  };

  const renderHtml = (order, type) =>
    renderToStaticMarkup(
      <InvoiceDocument order={order} documentType={type} />
    );

const handlePrintSelected = () => {
  const docs = selectedOrders.length ? selectedOrders : currentListOrders;
  if (!docs.length) return;

  const html = buildPrintableHtml({
    orders: docs,
    documentType,
  });

  const win = window.open("", "_blank", "width=1200,height=900");
  if (!win) return;

  win.document.open();
  win.document.write(html);
  win.document.close();

  const triggerPrint = () => {
    win.focus();
    win.print();
  };

  if (win.document.readyState === "complete") {
    setTimeout(triggerPrint, 700);
  } else {
    win.onload = () => setTimeout(triggerPrint, 700);
  }
};
  const handleDownloadSelected = () => {
    const docs = selectedOrders.length ? selectedOrders : currentListOrders;
    if (!docs.length) return;

    const html = buildPrintableHtml({
      orders: docs,
      documentType,
      renderHtml,
    });

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download =
      documentType === DOCUMENT_TYPES.INVOICE
        ? "foton-invoices.html"
        : "foton-packing-slips.html";

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(
    1,
    Number(pagination?.totalPages || pagination?.pages || 1)
  );

  const visibleSelectedCount = currentListOrders.filter((order) =>
    selectedOrderNumbers.includes(order?.orderNumber)
  ).length;

  const isVisibleAllSelected =
    currentListOrders.length > 0 &&
    visibleSelectedCount === currentListOrders.length;

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-black">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="flex w-full flex-col gap-5">
          <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/45">
                  Orders / Invoice
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Invoice & Packing Slip
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-black/55">
                  Browse paginated orders, search order numbers, preview invoices,
                  and print or download selected documents.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <SegmentedButton
                  active={documentType === DOCUMENT_TYPES.INVOICE}
                  onClick={() => setDocumentType(DOCUMENT_TYPES.INVOICE)}
                  icon={FileText}
                >
                  Invoice
                </SegmentedButton>

                <SegmentedButton
                  active={documentType === DOCUMENT_TYPES.PACKING}
                  onClick={() => setDocumentType(DOCUMENT_TYPES.PACKING)}
                  icon={Package}
                >
                  Packing Slip
                </SegmentedButton>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-[24px] bg-[#fafafa] p-4 ring-1 ring-black/5">
                <label className="mb-2 block text-sm font-medium">
                  Search invoice by order number
                </label>

                <textarea
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  rows={4}
                  placeholder="1,2,3"
                  className="w-full resize-none rounded-2xl border-0 bg-white p-4 text-sm outline-none ring-1 ring-black/10 placeholder:text-black/30 focus:ring-2 focus:ring-black"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleFetchByOrderNumbers}
                    disabled={manualLoading || !parsedOrderNumbers.length}
                    className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {manualLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {manualLoading ? "Fetching..." : "Fetch Invoice Orders"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-2 rounded-2xl bg-black/[0.05] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.08]"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-2xl bg-black/[0.05] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.08]"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SummaryCard label="Loaded" value={currentListOrders.length} />
                <SummaryCard label="Selected" value={selectedOrders.length} />
                <SummaryCard
                  label="Page"
                  value={`${page} / ${totalPages}`}
                />
                <SummaryCard
                  label="Type"
                  value={
                    documentType === DOCUMENT_TYPES.INVOICE
                      ? "Invoice"
                      : "Packing"
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handlePrintSelected}
                disabled={!currentListOrders.length}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
              >
                <Printer className="h-4 w-4" />
                Print Selected
              </button>

              <button
                type="button"
                onClick={handleDownloadSelected}
                disabled={!currentListOrders.length}
                className="inline-flex items-center gap-2 rounded-2xl bg-black/[0.05] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.08] disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                Download Selected
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[360px,minmax(0,1fr)]">
            <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">Orders</h2>
                  <p className="mt-1 text-sm text-black/50">
                    Paginated orders with invoice preview
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  disabled={!currentListOrders.length}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black/[0.05] px-3 py-2 text-sm font-medium transition hover:bg-black/[0.08] disabled:opacity-40"
                >
                  {isVisibleAllSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {isVisibleAllSelected ? "Unselect" : "Select All"}
                </button>
              </div>

              <div className="mt-4">
                <div className="rounded-2xl bg-[#fafafa] p-2 ring-1 ring-black/5">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-black/5">
                    <Search className="h-4 w-4 text-black/45" />
                    <input
                      value={storeSearch}
                      onChange={(e) => {
                        setStoreSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search order number / customer"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {isFetchingOrders || isLoading ? (
                  <div className="rounded-3xl bg-[#fafafa] px-4 py-10 text-center text-sm text-black/50 ring-1 ring-black/5">
                    Loading orders...
                  </div>
                ) : currentListOrders.length ? (
                  currentListOrders.map((order) => (
                    <OrderRow
                      key={order._id || order.orderNumber}
                      order={order}
                      checked={selectedOrderNumbers.includes(order.orderNumber)}
                      active={previewOrderNumber === order.orderNumber}
                      onToggle={handleToggleSelectOne}
                      onPreview={setPreviewOrderNumber}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl bg-[#fafafa] px-4 py-10 text-center text-sm text-black/50 ring-1 ring-black/5">
                    No orders found.
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-black/50">
                  Showing page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 transition hover:bg-black/[0.02] disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page >= totalPages}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 transition hover:bg-black/[0.02] disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <InvoicePreview
              order={previewOrder}
              documentType={documentType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
