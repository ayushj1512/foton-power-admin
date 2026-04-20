"use client";

import { useMemo, useState } from "react";
import { DOCUMENT_TYPES } from "@/constants/invoiceConstants";
import InvoiceToolbar from "@/components/invoice/InvoiceToolbar";
import InvoiceOrderList from "@/components/invoice/InvoiceOrderList";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import {
  buildPrintableHtml,
  fetchOrderByOrderNumber,
  sanitizeOrderNumbers,
} from "@/components/invoice/InvoiceHelpers";
import { renderToStaticMarkup } from "react-dom/server";

export default function OrdersInvoicePage() {
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES.INVOICE);
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);
  const [previewOrderNumber, setPreviewOrderNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const parsedOrderNumbers = useMemo(
    () => sanitizeOrderNumbers(searchInput),
    [searchInput]
  );

  const selectedOrders = useMemo(() => {
    return orders.filter((order) =>
      selectedOrderNumbers.includes(order?.orderNumber)
    );
  }, [orders, selectedOrderNumbers]);

  const previewOrder = useMemo(() => {
    return (
      orders.find((order) => order?.orderNumber === previewOrderNumber) ||
      selectedOrders[0] ||
      orders[0] ||
      null
    );
  }, [orders, previewOrderNumber, selectedOrders]);

  const handleFetchOrders = async () => {
    const orderNumbers = sanitizeOrderNumbers(searchInput);
    if (!orderNumbers.length) return;

    setIsLoading(true);

    try {
      const results = await Promise.all(
        orderNumbers.map((orderNumber) => fetchOrderByOrderNumber(orderNumber))
      );

      const validOrders = results.filter(Boolean);

      setOrders(validOrders);
      setSelectedOrderNumbers(validOrders.map((o) => o.orderNumber));
      setPreviewOrderNumber(validOrders[0]?.orderNumber || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    handleFetchOrders();
  };

  const handleClear = () => {
    setSearchInput("");
    setOrders([]);
    setSelectedOrderNumbers([]);
    setPreviewOrderNumber(null);
  };

  const handleToggleSelectOne = (orderNumber) => {
    setSelectedOrderNumbers((prev) =>
      prev.includes(orderNumber)
        ? prev.filter((v) => v !== orderNumber)
        : [...prev, orderNumber]
    );
  };

  const handleToggleSelectAll = () => {
    const isAllSelected =
      orders.length > 0 && selectedOrderNumbers.length === orders.length;

    if (isAllSelected) {
      setSelectedOrderNumbers([]);
    } else {
      setSelectedOrderNumbers(orders.map((o) => o.orderNumber));
    }
  };

  const renderHtml = (order, type) =>
    renderToStaticMarkup(
      <InvoiceDocument order={order} documentType={type} />
    );

  const handlePrintSelected = () => {
    const docs = selectedOrders.length ? selectedOrders : orders;
    if (!docs.length) return;

    const html = buildPrintableHtml({
      orders: docs,
      documentType,
      renderHtml,
    });

    const win = window.open("", "_blank", "width=1200,height=900");
    if (!win) return;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
    }, 300);
  };

  const handleDownloadSelected = () => {
    const docs = selectedOrders.length ? selectedOrders : orders;
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
        ? "miray-invoices.html"
        : "miray-packing-slips.html";

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-black">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <InvoiceToolbar
          documentType={documentType}
          setDocumentType={setDocumentType}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          parsedOrderNumbers={parsedOrderNumbers}
          orders={orders}
          selectedOrderNumbers={selectedOrderNumbers}
          isLoading={isLoading}
          onFetchOrders={handleFetchOrders}
          onClear={handleClear}
          onPrintSelected={handlePrintSelected}
          onDownloadSelected={handleDownloadSelected}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[360px,1fr]">
          <InvoiceOrderList
            orders={orders}
            selectedOrderNumbers={selectedOrderNumbers}
            previewOrderNumber={previewOrderNumber}
            onRefresh={handleRefresh}
            onToggleSelectOne={handleToggleSelectOne}
            onToggleSelectAll={handleToggleSelectAll}
            onPreview={setPreviewOrderNumber}
          />

          <InvoicePreview
            order={previewOrder}
            documentType={documentType}
          />
        </div>
      </div>
    </div>
  );
}