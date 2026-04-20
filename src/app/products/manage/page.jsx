"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";

function getProductImage(product) {
  if (!product) return "";

  if (Array.isArray(product.media) && product.media.length > 0) {
    const primary =
      product.media.find((item) => item?.isPrimary && item?.url) ||
      product.media.find((item) => item?.url);

    if (primary?.url) return primary.url;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const image = product.images.find((item) => item?.url) || product.images[0];
    if (image?.url) return image.url;
  }

  if (product.image?.url) return product.image.url;
  if (typeof product.image === "string") return product.image;

  return "";
}

function truncateTitle(text = "", max = 40) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function ProductImage({ src, onClick }) {
  if (!src) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5">
        <ImageIcon className="h-4 w-4 text-black/40" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block rounded-lg focus:outline-none"
    >
      <img
        src={src}
        alt="product"
        className="h-10 w-10 shrink-0 rounded-lg bg-black/5 object-cover transition hover:opacity-90"
      />
    </button>
  );
}

function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const currentImage = images[currentIndex] || "";
  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/5 p-2 text-black/70 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-black/[0.03] p-4">
          <img
            src={currentImage}
            alt="Preview"
            className="max-h-[260px] w-auto max-w-full rounded-2xl object-contain"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1 rounded-xl bg-black/[0.04] px-3 py-2 text-xs font-medium text-black/70 transition hover:bg-black/[0.07]"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <p className="text-xs font-medium text-black/50">
            {currentIndex + 1} / {images.length}
          </p>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1 rounded-xl bg-black/[0.04] px-3 py-2 text-xs font-medium text-black/70 transition hover:bg-black/[0.07]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageProductsPage() {
  const {
    products,
    isLoading,
    page,
    pages,
    total,
    filters,
    fetchProducts,
    setFilters,
    resetFilters,
    setPage,
    deleteProduct,
  } = useAdminProductStore();

  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetchProducts({ page, limit: 100 });
  }, [fetchProducts, page, filters]);

  const previewImages = useMemo(
    () => products.map((item) => getProductImage(item)).filter(Boolean),
    [products]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex < 0) return;

      if (e.key === "Escape") setLightboxIndex(-1);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev <= 0 ? previewImages.length - 1 : prev - 1
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev >= previewImages.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, previewImages.length]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    const res = await deleteProduct(id);
    if (res.success) fetchProducts({ page, limit: 100 });
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-sm text-black/60">
            Search, filter and manage all products.
          </p>
        </div>

        <Link
          href="/products/create"
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </Link>
      </div>

      <div className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6">
        <input
          value={filters.search}
          onChange={(e) => {
            setPage(1);
            setFilters({ search: e.target.value });
          }}
          placeholder="Search product..."
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm outline-none"
        />

        <select
          value={filters.status}
          onChange={(e) => {
            setPage(1);
            setFilters({ status: e.target.value });
          }}
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>

        <input
          value={filters.category}
          onChange={(e) => {
            setPage(1);
            setFilters({ category: e.target.value });
          }}
          placeholder="Category"
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm outline-none"
        />

        <input
          value={filters.collection}
          onChange={(e) => {
            setPage(1);
            setFilters({ collection: e.target.value });
          }}
          placeholder="Collection"
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm outline-none"
        />

        <select
          value={filters.sort}
          onChange={(e) => {
            setPage(1);
            setFilters({ sort: e.target.value });
          }}
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price Low to High</option>
          <option value="price_desc">Price High to Low</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
          <option value="best_selling">Best Selling</option>
        </select>

        <button
          onClick={() => {
            resetFilters();
            setPage(1);
          }}
          className="rounded-2xl bg-black/[0.03] px-4 py-2.5 text-sm font-medium hover:bg-black/[0.05]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products ({total})</h2>
          <div className="inline-flex items-center gap-2 text-sm text-black/60">
            <Search className="h-4 w-4" />
            Live filters
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-black/60">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-black/60">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-x-4 border-spacing-y-1 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-black/50">
                  <th className="w-[72px] px-1 py-2">Image</th>
                  <th className="w-[240px] px-1 py-2">Title</th>
                  <th className="px-1 py-2">Code</th>
                  <th className="px-1 py-2">Category</th>
                  <th className="px-1 py-2">Price</th>
                  <th className="px-1 py-2">Stock</th>
                  <th className="px-1 py-2">Status</th>
                  <th className="px-1 py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => {
                  const image = getProductImage(item);
                  const imageIndex = image ? previewImages.indexOf(image) : -1;

                  return (
                    <tr key={item._id} className="align-middle">
                      <td className="rounded-2xl bg-black/[0.02] px-1 py-2">
                        <ProductImage
                          src={image}
                          onClick={() => {
                            if (imageIndex >= 0) setLightboxIndex(imageIndex);
                          }}
                        />
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2">
                        <p className="text-xs font-medium text-black/90">
                          {truncateTitle(item.name, 40)}
                        </p>
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2 text-xs">
                        {item.productCode}
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2 text-xs">
                        {item.category?.name || "-"}
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2 text-xs">
                        ₹{Number(item.discountPrice || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2 text-xs">
                        {item.stock || 0}
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2 text-xs capitalize">
                        {item.status}
                      </td>

                      <td className="rounded-2xl bg-black/[0.02] px-2 py-2">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/products/${item.productCode}`}
                            className="rounded-lg bg-white px-2.5 py-1.5 text-xs hover:bg-black/5"
                          >
                            View
                          </Link>

                          <Link
                            href={`/products/edit/${item.productCode}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs hover:bg-black/5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl bg-black/[0.03] px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-black/60">
            Page {page} of {pages || 1}
          </p>

          <button
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="rounded-xl bg-black/[0.03] px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <ImageLightbox
          images={previewImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev <= 0 ? previewImages.length - 1 : prev - 1
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev >= previewImages.length - 1 ? 0 : prev + 1
            )
          }
        />
      )}
    </div>
  );
}