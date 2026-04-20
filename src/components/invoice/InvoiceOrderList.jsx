"use client";

import { CheckSquare, Eye, RefreshCcw, Square } from "lucide-react";
import { formatCurrency, formatDate, getOrderDisplayName } from "./InvoiceHelpers";

export default function InvoiceOrderList({
  orders,
  selectedOrderNumbers,
  previewOrderNumber,
  onRefresh,
  onToggleSelectOne,
  onToggleSelectAll,
  onPreview,
}) {
  const isAllSelected =
    orders.length > 0 && selectedOrderNumbers.length === orders.length;

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Loaded Orders</h2>

        <div className="flex gap-2">
          <button
            onClick={onToggleSelectAll}
            disabled={!orders.length}
            className="inline-flex items-center gap-2 rounded-2xl bg-black/5 px-3 py-2 text-sm font-medium hover:bg-black/10 disabled:opacity-40"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {isAllSelected ? "Unselect All" : "Select All"}
          </button>

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl bg-black/5 px-3 py-2 text-sm font-medium hover:bg-black/10"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {!orders.length ? (
        <div className="rounded-3xl bg-[#fafafa] p-5 text-sm text-black/50 ring-1 ring-black/5">
          No orders loaded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const checked = selectedOrderNumbers.includes(order.orderNumber);
            const active = previewOrderNumber === order.orderNumber;

            return (
              <div
                key={order._id || order.orderNumber}
                className={`rounded-3xl p-4 transition ring-1 ${
                  active
                    ? "bg-black text-white ring-black"
                    : "bg-[#fafafa] text-black ring-black/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleSelectOne(order.orderNumber)}
                    className={`mt-0.5 rounded-xl p-1 ${
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
                    onClick={() => onPreview(order.orderNumber)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {order.orderNumber}
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
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
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
                        active ? "text-white/75" : "text-black/50"
                      }`}
                    >
                      <p>{formatDate(order.createdAt)}</p>
                      <p className="text-right">
                        {formatCurrency(order.payableAmount)}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => onPreview(order.orderNumber)}
                    className={`rounded-xl p-2 ${
                      active ? "bg-white/10" : "bg-black/5"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}