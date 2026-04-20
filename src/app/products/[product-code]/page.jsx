"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAdminProductStore } from "@/store/adminProductStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const productCode = params?.["product-code"];

  const { products, isLoading, fetchProducts } = useAdminProductStore();

  useEffect(() => {
    if (!products.length) {
      fetchProducts({ page: 1, limit: 500 });
    }
  }, [products.length, fetchProducts]);

  const product = useMemo(() => {
    return products.find((p) => p.productCode === productCode) || null;
  }, [products, productCode]);

  if (isLoading && !product) {
    return <div className="p-6">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  const primaryImage =
    product.media?.find((m) => m.isPrimary)?.url ||
    product.media?.[0]?.url ||
    "https://placehold.co/600x600?text=No+Image";

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-[420px] w-full rounded-2xl object-cover"
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-black/50">{product.productCode}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-sm text-black/60">
              {product.category?.name || "No Category"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.discountPrice}</span>
            {product.mrp > product.discountPrice ? (
              <span className="text-base text-black/40 line-through">
                ₹{product.mrp}
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/50">Stock</p>
              <p className="mt-1 text-lg font-semibold">{product.stock || 0}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/50">Status</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {product.status}
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/50">Color</p>
              <p className="mt-1 text-lg font-semibold">{product.color || "—"}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/50">Variants</p>
              <p className="mt-1 text-lg font-semibold">
                {product.variants?.length || 0}
              </p>
            </div>
          </div>

          {product.shortDescription ? (
            <div>
              <h2 className="font-semibold">Short Description</h2>
              <p className="mt-2 text-sm text-black/70">
                {product.shortDescription}
              </p>
            </div>
          ) : null}

          {product.description ? (
            <div>
              <h2 className="font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-black/70">
                {product.description}
              </p>
            </div>
          ) : null}

          <div className="flex gap-3">
            <Link
              href={`/products/edit/${product.productCode}`}
              className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
            >
              Edit Product
            </Link>
            <Link
              href="/products/manage"
              className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium"
            >
              Back to Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}