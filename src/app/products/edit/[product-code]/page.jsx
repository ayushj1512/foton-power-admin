"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminProductStore } from "@/store/adminProductStore";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productCode = params?.["product-code"];

  const {
    products,
    product,
    isLoading,
    isSubmitting,
    error,
    message,
    fetchProducts,
    fetchProductById,
    updateProduct,
  } = useAdminProductStore();

  const [form, setForm] = useState(null);

  const matchedProduct = useMemo(() => {
    return products.find((p) => p.productCode === productCode) || null;
  }, [products, productCode]);

  useEffect(() => {
    if (!products.length) {
      fetchProducts({ page: 1, limit: 500 });
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (matchedProduct?._id) {
      fetchProductById(matchedProduct._id);
    }
  }, [matchedProduct, fetchProductById]);

  useEffect(() => {
    if (product?._id) {
      setForm({
        name: product.name || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        color: product.color || "",
        category: product.category?._id || "",
        mrp: product.mrp || "",
        discountPrice: product.discountPrice || "",
        stock: product.stock || "",
        status: product.status || "draft",
        isFeatured: !!product.isFeatured,
        isBestSeller: !!product.isBestSeller,
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        media: Array.isArray(product.media) ? product.media : [],
      });
    }
  }, [product]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?._id || !form) return;

    const payload = {
      ...form,
      mrp: Number(form.mrp || 0),
      discountPrice: Number(form.discountPrice || 0),
      stock: Number(form.stock || 0),
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    const res = await updateProduct(product._id, payload);
    if (res?.success) {
      router.push("/products/manage");
    }
  };

  if (isLoading && !form) {
    return <div className="p-6">Loading product...</div>;
  }

  if (!form) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-black/60">{product?.productCode}</p>
        </div>

        {message ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm lg:grid-cols-2"
        >
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <input
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Color</label>
            <input
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">MRP</label>
            <input
              type="number"
              value={form.mrp}
              onChange={(e) => handleChange("mrp", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Discount Price</label>
            <input
              type="number"
              value={form.discountPrice}
              onChange={(e) => handleChange("discountPrice", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">Short Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              className="min-h-[90px] w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[140px] w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">Tags</label>
            <input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-6 lg:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
              />
              Featured
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => handleChange("isBestSeller", e.target.checked)}
              />
              Best Seller
            </label>
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}