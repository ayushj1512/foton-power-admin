"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";

export default function LowStockPage() {
  const { products, isLoading, fetchProducts } = useAdminProductStore();

  useEffect(() => {
    fetchProducts({ limit: 100 });
  }, [fetchProducts]);

  const lowStockProducts = products.filter((item) => {
    const stock = Number(item.stock || 0);
    const threshold = Number(item.lowStockThreshold || 5);
    return stock <= threshold;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-50 p-3 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Low Stock Products</h1>
            <p className="text-sm text-black/60">
              Products below their stock threshold.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-black/60">Loading...</p>
        ) : lowStockProducts.length === 0 ? (
          <p className="text-sm text-black/60">No low stock products found.</p>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-black/60">
                    Code: {item.productCode} • Stock: {item.stock || 0} • Threshold:{" "}
                    {item.lowStockThreshold || 5}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/products/${item.productCode}`}
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/5"
                  >
                    View
                  </Link>
                  <Link
                    href={`/products/edit/${item.productCode}`}
                    className="rounded-xl bg-black px-3 py-2 text-sm text-white"
                  >
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}