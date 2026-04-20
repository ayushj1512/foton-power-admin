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
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30";

const textareaClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30";

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
        className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Create Product</h1>
          <p className="text-sm text-black/60">
            Upload media first, then fill product details.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-black/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Product Media</h2>
              <p className="text-xs text-black/60">
                Select images or videos from media library.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMediaOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <ImagePlus size={16} />
              {selectedMedia.length ? "Change Media" : "Upload / Select Media"}
            </button>
          </div>

          {selectedMedia.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedMedia.map((item, index) => {
                const src = item?.secureUrl || item?.url;

                return (
                  <div
                    key={`${item?.publicId || item?._id || "media"}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-black/10 bg-black/5"
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
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-black shadow-sm"
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
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 px-4 py-10 text-center transition hover:bg-black/[0.02]"
            >
              <ImagePlus size={20} />
              <span className="text-sm font-medium">No media selected</span>
              <span className="text-xs text-black/50">
                Click here to upload or pick media
              </span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Product name"
            className={inputClass}
            required
          />

          <CategorySubcategoryDropdown
            categoryId={form.category}
            subcategoryId={form.subcategory}
            onCategoryChange={(value) => handleChange("category", value)}
            onSubcategoryChange={(value) => handleChange("subcategory", value)}
            required
          />

          <CollectionDropdown
            value={form.collection}
            onChange={(value) => handleChange("collection", value)}
            label="Collection"
            placeholder="Select collection"
            helperText="Optional. Link this product to a collection."
          />

          <div className="space-y-3 rounded-2xl border border-black/10 p-4">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-black/50" />
              <p className="text-sm font-medium">Color</p>
            </div>

            <input
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              placeholder="Color"
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
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          <input
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="Tags comma separated"
            className={inputClass}
          />

          <input
            type="number"
            value={form.mrp}
            onChange={(e) => handleChange("mrp", e.target.value)}
            placeholder="MRP"
            className={inputClass}
            required
          />

          <input
            type="number"
            value={form.discountPrice}
            onChange={(e) => handleChange("discountPrice", e.target.value)}
            placeholder="Discount Price"
            className={inputClass}
            required
          />

          <input
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            placeholder="Stock"
            className={inputClass}
          />

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

          <input
            value={form.hsnCode}
            onChange={(e) => handleChange("hsnCode", e.target.value)}
            placeholder="HSN Code"
            className={inputClass}
          />

          <input
            value={form.taxClass}
            onChange={(e) => handleChange("taxClass", e.target.value)}
            placeholder="Tax Rate"
            className={inputClass}
          />

          <textarea
            value={form.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            placeholder="Short description"
            rows={3}
            className={textareaClass}
          />

          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
            rows={6}
            className={textareaClass}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => handleChange("isFeatured", e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => handleChange("isBestSeller", e.target.checked)}
            />
            Best Seller
          </label>
        </div>

        {(error || message) && (
          <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm">
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