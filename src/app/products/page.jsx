"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  AlertTriangle,
  Eye,
  Star,
  Pencil,
  ImageIcon,
} from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";

function StatCard({ title, value, icon: Icon, href }) {
  return (
    <Link
      href={href || "#"}
      className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-2xl bg-black/5 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm text-black/60">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-black">{value}</h3>
    </Link>
  );
}

function ProductImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-black/5">
        <ImageIcon className="h-4 w-4 text-black/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product"}
      className="h-11 w-11 shrink-0 rounded-xl border border-black/10 bg-black/5 object-cover"
    />
  );
}

export default function ProductsPage() {
  const { products, fetchAllProducts, isLoading, error } = useAdminProductStore();

  useEffect(() => {
    fetchAllProducts({ limit: 100 });
  }, [fetchAllProducts]);

  const stats = {
    total: products.length,
    featured: products.filter((item) => item.isFeatured).length,
    lowStock: products.filter(
      (item) =>
        Number(item.stock || 0) > 0 &&
        Number(item.stock || 0) <= Number(item.lowStockThreshold || 5)
    ).length,
    outOfStock: products.filter((item) => Number(item.stock || 0) <= 0).length,
  };

  const latestProducts = products.slice(0, 8);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-black/60">
            Overview of products, inventory and quick actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/products/manage"
            className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            Manage Products
          </Link>
          <Link
            href="/products/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Create Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.total}
          icon={Package}
          href="/products/manage"
        />
        <StatCard
          title="Featured"
          value={stats.featured}
          icon={Star}
          href="/products/manage?featured=true"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          href="/products/low-stock"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={Eye}
          href="/products/low-stock"
        />
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Latest Products</h2>
            <p className="text-sm text-black/60">
              All products loaded with pagination batches of 100
            </p>
          </div>
          <Link href="/products/manage" className="text-sm font-medium underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-black/60">Loading products...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : latestProducts.length === 0 ? (
          <p className="text-sm text-black/60">No products found.</p>
        ) : (
          <div className="space-y-3">
            {latestProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <ProductImage src={item.displayImage} alt={item.name} />

                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-black/60">
                      Code: {item.productCode || "-"} • Status: {item.status || "-"} •
                      Stock: {item.stock || 0}
                    </p>
                    <p className="mt-1 text-sm font-medium text-black">
                      ₹{Number(item.discountPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
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
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
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