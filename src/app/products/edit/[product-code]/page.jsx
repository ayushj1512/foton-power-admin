"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";
import ProductMediaManager from "@/components/products/ProductMediaManager";

const input =
  "w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30";
const label = "mb-1 block text-sm font-medium text-black";

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

  const { categories, fetchCategories, getSubcategoryOptions } =
    useAdminCategoryStore();

  const {
    collections,
    fetchCollections,
    addProductCodesToCollection,
    removeProductCodesFromCollection,
  } = useAdminCollectionStore();

  const [form, setForm] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState([]);

  const matchedProduct = useMemo(
    () =>
      products.find((p) => String(p.productCode) === String(productCode)) ||
      null,
    [products, productCode]
  );

  useEffect(() => {
    if (!products.length) fetchProducts({ page: 1, limit: 500 });
    fetchCategories({ page: 1, limit: 500 });
    fetchCollections();
  }, [products.length, fetchProducts, fetchCategories, fetchCollections]);

  useEffect(() => {
    if (matchedProduct?._id) fetchProductById(matchedProduct._id);
  }, [matchedProduct?._id, fetchProductById]);

  useEffect(() => {
    if (!product?._id) return;

    setForm({
      name: product.name || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      color: product.color || "",
      category: product.category?._id || product.category || "",
      subcategory:
        product.subcategoryDetails?._id ||
        product.subcategory?._id ||
        product.subcategory ||
        "",
      mrp: product.mrp || "",
      discountPrice: product.discountPrice || "",
      stock: product.stock || "",
      status: product.status || "draft",
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      media: Array.isArray(product.media) ? product.media : [],
    });
  }, [product]);

  useEffect(() => {
    if (!product?.productCode || !collections?.length) return;

    const code = String(product.productCode);
    setSelectedCollections(
      collections
        .filter((c) => (c.productCodes || []).some((p) => String(p) === code))
        .map((c) => c._id)
    );
  }, [product?.productCode, collections]);

  const subcategories = useMemo(
    () => getSubcategoryOptions(form?.category),
    [form?.category, getSubcategoryOptions]
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "category" ? { subcategory: "" } : {}),
    }));
  };

  const toggleCollection = (id) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const syncCollections = async () => {
    const code = product?.productCode;
    if (!code) return;

    const oldIds = collections
      .filter((c) => (c.productCodes || []).some((p) => String(p) === String(code)))
      .map((c) => c._id);

    const toAdd = selectedCollections.filter((id) => !oldIds.includes(id));
    const toRemove = oldIds.filter((id) => !selectedCollections.includes(id));

    await Promise.all([
      ...toAdd.map((id) => addProductCodesToCollection(id, [code])),
      ...toRemove.map((id) => removeProductCodesFromCollection(id, [code])),
    ]);
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
      await syncCollections();
      router.push(`/products/${product.productCode}`);
    }
  };

  if (isLoading && !form) return <div className="p-6">Loading product...</div>;
  if (!form) return <div className="p-6">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-black">Edit Product</h1>
          <p className="mt-1 text-sm text-black/50">
            Code: {product?.productCode}
          </p>
        </div>

        {message && (
          <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <ProductMediaManager
  value={form.media}
  onChange={(media) => handleChange("media", media)}
  folder="foton/products"
/>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:grid-cols-2"
        >
          <div className="lg:col-span-2">
            <label className={label}>Product Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={input}
              required
            />
          </div>

          <div>
            <label className={label}>Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={input}
              required
            >
              <option value="">Select category</option>
              {categories
                .filter((c) => c?.isActive !== false)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className={label}>Subcategory</label>
            <select
              value={form.subcategory}
              onChange={(e) => handleChange("subcategory", e.target.value)}
              className={input}
            >
              <option value="">Select subcategory</option>
              {subcategories.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className={label}>Collections</label>
            <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
              {collections.length ? (
                collections.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => toggleCollection(c._id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      selectedCollections.includes(c._id)
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-black/20"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No collections found</p>
              )}
            </div>
          </div>

          <div>
            <label className={label}>Color</label>
            <input
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className={input}
            />
          </div>

          <div>
            <label className={label}>Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={input}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className={label}>MRP</label>
            <input
              type="number"
              value={form.mrp}
              onChange={(e) => handleChange("mrp", e.target.value)}
              className={input}
            />
          </div>

          <div>
            <label className={label}>Discount Price</label>
            <input
              type="number"
              value={form.discountPrice}
              onChange={(e) => handleChange("discountPrice", e.target.value)}
              className={input}
            />
          </div>

          <div>
            <label className={label}>Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className={input}
            />
          </div>

          <div>
            <label className={label}>Tags</label>
            <input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="camera, lens, tripod"
              className={input}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={label}>Short Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              className={`${input} min-h-[90px]`}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${input} min-h-[140px]`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 lg:col-span-2">
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
              className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}