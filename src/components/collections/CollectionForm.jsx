"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ImageIcon,
  Layers3,
  Loader2,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import CollectionProductCodes from "./CollectionProductCodes";

const keywordsToString = (keywords = []) =>
  Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : "";

const parseKeywords = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CollectionForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Collection",
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    bannerImage: initialData?.bannerImage || "",
    sortOrder: initialData?.sortOrder ?? 0,
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    showOnHomepage: initialData?.showOnHomepage ?? false,
    productCodes: Array.isArray(initialData?.productCodes)
      ? initialData.productCodes
      : [],
    seoTitle: initialData?.seo?.title || "",
    seoDescription: initialData?.seo?.description || "",
    seoKeywords: keywordsToString(initialData?.seo?.keywords || []),
  });

  const previewSlug = useMemo(() => form.slug || slugify(form.name), [form.slug, form.name]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      bannerImage: form.bannerImage.trim(),
      sortOrder: Number(form.sortOrder || 0),
      isActive: Boolean(form.isActive),
      isFeatured: Boolean(form.isFeatured),
      showOnHomepage: Boolean(form.showOnHomepage),
      productCodes: form.productCodes || [],
      seo: {
        title: form.seoTitle.trim(),
        description: form.seoDescription.trim(),
        keywords: parseKeywords(form.seoKeywords),
      },
    };

    await onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                <Layers3 size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Basic Details</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Collection identity, slug, and content.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-800">Collection Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                  placeholder="Creator Essentials"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="creator-essentials"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
                <p className="text-xs text-zinc-500">Preview: {previewSlug || "-"}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                  placeholder="0"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-800">Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Write a short collection description..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                <ImageIcon size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Media</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Add collection image and banner image URLs.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setField("image", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Banner Image URL</label>
                <input
                  value={form.bannerImage}
                  onChange={(e) => setField("bannerImage", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <CollectionProductCodes
            value={form.productCodes}
            onChange={(next) => setField("productCodes", next)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Visibility</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Control status, feature state, and homepage visibility.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "isActive",
                  title: "Active",
                  text: "Show this collection in active listings.",
                  icon: ShieldCheck,
                },
                {
                  key: "isFeatured",
                  title: "Featured",
                  text: "Highlight collection in important sections.",
                  icon: BadgeCheck,
                },
                {
                  key: "showOnHomepage",
                  title: "Homepage",
                  text: "Allow this collection to appear on homepage.",
                  icon: SparkleIcon,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-zinc-900">{item.title}</div>
                      <div className="text-xs text-zinc-500">{item.text}</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={Boolean(form[item.key])}
                      onChange={(e) => setField(item.key, e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                <Search size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900">SEO</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Optimize title, description, and keywords.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">SEO Title</label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setField("seoTitle", e.target.value)}
                  placeholder="Creator Essentials | Brand"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">SEO Description</label>
                <textarea
                  rows={4}
                  value={form.seoDescription}
                  onChange={(e) => setField("seoDescription", e.target.value)}
                  placeholder="Short SEO description..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  SEO Keywords
                </label>
                <input
                  value={form.seoKeywords}
                  onChange={(e) => setField("seoKeywords", e.target.value)}
                  placeholder="creator gear, studio setup, content creation"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="sticky top-24 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Ready to save?</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Review the collection details and save changes.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function SparkleIcon(props) {
  return <span {...props} className="text-sm">✦</span>;
}