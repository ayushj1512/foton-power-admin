"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";

const initialForm = {
  name: "",
  code: "",
  slug: "",
  description: "",
  image: "",
  bannerImage: "",
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
};

export default function CreateCategoryPage() {
  const router = useRouter();
  const { createCategory, isLoading, error, message, clearMessages } =
    useAdminCategoryStore();

  const [form, setForm] = useState(initialForm);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder) || 0,
      };

      await createCategory(payload);
      router.push("/categories");
    } catch {}
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm text-black/60 transition hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to Categories
            </Link>
          </div>

          <h1 className="text-2xl font-semibold text-black">
            Create Category
          </h1>
          <p className="text-sm text-black/60">
            Add a new category with basic details and SEO fields
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button onClick={clearMessages} className="font-medium">
              Close
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center justify-between gap-3">
            <span>{message}</span>
            <button onClick={clearMessages} className="font-medium">
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">Basic Details</h2>
            <p className="text-sm text-black/60">
              Main category information
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter category name"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Enter category code"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="Enter category slug"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter category description"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">Media</h2>
            <p className="text-sm text-black/60">
              Add image URLs for category
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Image URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="https://example.com/category-image.jpg"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Banner Image URL
              </label>
              <input
                type="text"
                value={form.bannerImage}
                onChange={(e) => handleChange("bannerImage", e.target.value)}
                placeholder="https://example.com/banner-image.jpg"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">SEO</h2>
            <p className="text-sm text-black/60">
              Optional SEO metadata for category page
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                SEO Title
              </label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                placeholder="Enter SEO title"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                SEO Description
              </label>
              <textarea
                rows={4}
                value={form.seoDescription}
                onChange={(e) =>
                  handleChange("seoDescription", e.target.value)
                }
                placeholder="Enter SEO description"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">Settings</h2>
            <p className="text-sm text-black/60">
              Control visibility and homepage priority
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-black">Active</p>
                <p className="text-xs text-black/50">
                  Show this category publicly
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-black">Featured</p>
                <p className="text-xs text-black/50">
                  Highlight this category
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:bg-black/5"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}