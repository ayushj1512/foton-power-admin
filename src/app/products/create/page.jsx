"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Palette, Trash2 } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";
import MediaPickerModal from "@/components/media/MediaPickerModal";
import CategorySubcategoryDropdown from "@/components/common/CategorySubcategoryDropdown";
import CollectionDropdown from "@/components/collections/CollectionDropdown";

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Grey",
  "Blue",
  "Navy",
  "Red",
  "Pink",
  "Green",
  "Yellow",
  "Beige",
  "Brown",
  "Maroon",
  "Purple",
  "Orange",
];

const initialForm = {
  name: "",
  shortDescription: "",
  description: "",
  category: "",
  subcategory: "",
  collection: "",
  color: "",
  mrp: "",
  discountPrice: "",
  stock: "",
  hsnCode: "",
  taxClass: "18%",
  status: "draft",
  isFeatured: false,
  isBestSeller: false,
  tags: "",
  media: [],
  variants: [],
};

const inputClass =
  "w-full rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300";

const textareaClass =
  "w-full rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300";

const labelClass = "mb-2 block text-sm font-medium text-zinc-800";

function Field({ title, children, optional = false }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className={labelClass}>{title}</label>
        {optional ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
            Optional
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct, isSubmitting, error, message } = useAdminProductStore();

  const [form, setForm] = useState(initialForm);
  const [mediaOpen, setMediaOpen] = useState(false);

  const selectedMedia = useMemo(
    () => (Array.isArray(form.media) ? form.media : []),
    [form.media]
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMediaSelect = (items) => {
    const picked = Array.isArray(items) ? items : items ? [items] : [];

    setForm((prev) => ({
      ...prev,
      media: picked.map((item) => ({
        _id: item?._id || "",
        publicId: item?.publicId || "",
        secureUrl: item?.secureUrl || item?.url || "",
        url: item?.url || item?.secureUrl || "",
        originalName: item?.originalName || "",
        resourceType: item?.resourceType || "image",
      })),
    }));

    setMediaOpen(false);
  };

  const removeMedia = (index) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      mrp: Number(form.mrp || 0),
      discountPrice: Number(form.discountPrice || 0),
      stock: Number(form.stock || 0),
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      media: selectedMedia.map((item) => ({
        publicId: item.publicId || "",
        url: item.secureUrl || item.url || "",
        secureUrl: item.secureUrl || item.url || "",
        originalName: item.originalName || "",
        resourceType: item.resourceType || "image",
      })),
    };

    const res = await createProduct(payload);

    if (res?.success) {
      const code = res.data?.product?.productCode;
      router.push(code ? `/products/${code}` : "/products/manage");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900">Create Product</h1>
          <p className="text-sm text-zinc-500">
            Add media and product details below.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl bg-zinc-50/70 p-4 ring-1 ring-zinc-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Product Media
              </h2>
              <p className="text-xs text-zinc-500">
                Upload or select product images/videos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMediaOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <ImagePlus size={16} />
              {selectedMedia.length ? "Update Media" : "Upload Media"}
            </button>
          </div>

          {selectedMedia.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedMedia.map((item, index) => {
                const src = item?.secureUrl || item?.url;

                return (
                  <div
                    key={`${item?.publicId || item?._id || "media"}-${index}`}
                    className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200"
                  >
                    {item?.resourceType === "video" ? (
                      <video
                        src={src}
                        className="h-36 w-full object-cover"
                        controls
                        playsInline
                      />
                    ) : (
                      <img
                        src={src}
                        alt={item?.originalName || `media-${index}`}
                        className="h-36 w-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute right-2 top-2 rounded-full bg-white p-2 text-zinc-700 shadow-sm ring-1 ring-zinc-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMediaOpen(true)}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white px-4 py-10 text-center ring-1 ring-dashed ring-zinc-300 transition hover:bg-zinc-50"
            >
              <ImagePlus size={20} className="text-zinc-700" />
              <span className="text-sm font-medium text-zinc-900">
                Upload or select media
              </span>
              <span className="text-xs text-zinc-500">
                Click here to open media library
              </span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <Field title="Product Name">
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <div>
            <div className="mb-2">
              <label className={labelClass}>Category &amp; Subcategory</label>
            </div>

            <CategorySubcategoryDropdown
              categoryId={form.category}
              subcategoryId={form.subcategory}
              onCategoryChange={(value) => handleChange("category", value)}
              onSubcategoryChange={(value) => handleChange("subcategory", value)}
              required
            />
          </div>

          <CollectionDropdown
            value={form.collection}
            onChange={(value) => handleChange("collection", value)}
            label="Collection"
            placeholder="Select collection"
            helperText="You can leave this empty."
          />

          <div className="space-y-3 rounded-2xl bg-zinc-50/70 p-4 ring-1 ring-zinc-200">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-zinc-500" />
              <p className="text-sm font-medium text-zinc-900">Color</p>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
                Optional
              </span>
            </div>

            <input
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className={inputClass}
            />

            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => {
                const isActive =
                  String(form.color || "").trim().toLowerCase() ===
                  color.toLowerCase();

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          <Field title="Tags" optional>
            <input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field title="MRP">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                Rs
              </span>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => handleChange("mrp", e.target.value)}
                className="w-full rounded-2xl bg-zinc-50 py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
                required
              />
            </div>
          </Field>

          <Field title="Discount Price">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                Rs
              </span>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => handleChange("discountPrice", e.target.value)}
                className="w-full rounded-2xl bg-zinc-50 py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
                required
              />
            </div>
          </Field>

          <Field title="Stock" optional>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field title="Status">
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </Field>

          <Field title="HSN Code" optional>
            <input
              value={form.hsnCode}
              onChange={(e) => handleChange("hsnCode", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field title="Tax Rate" optional>
            <input
              value={form.taxClass}
              onChange={(e) => handleChange("taxClass", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field title="Short Description" optional>
            <textarea
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              rows={3}
              className={textareaClass}
            />
          </Field>

          <Field title="Description" optional>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={6}
              className={textareaClass}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-zinc-50/70 p-4 ring-1 ring-zinc-200 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => handleChange("isFeatured", e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => handleChange("isBestSeller", e.target.checked)}
            />
            Best Seller
          </label>
        </div>

        {(error || message) && (
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 ring-1 ring-zinc-200">
            {error || message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>

      <MediaPickerModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={handleMediaSelect}
        multiple
        folder="miray/products"
      />
    </div>
  );
}