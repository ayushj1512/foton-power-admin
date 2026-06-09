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
  Sparkles,
  Hash,
  FileText,
  X,
  ImagePlus,
} from "lucide-react";

import ProductSelector from "@/components/products/ProductSelector";
import MediaPickerModal from "@/components/media/MediaPickerModal";

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

const getMediaUrl = (media) => {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media.secureUrl || media.url || "";
};

const normalizeMedia = (media) => {
  if (!media) return "";
  return {
    url: media.secureUrl || media.url,
    secureUrl: media.secureUrl || media.url,
    publicId: media.publicId,
  };
};

const inputClass =
  "w-full rounded-2xl bg-[#f7f7f8] px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:bg-white focus:shadow-[0_0_0_1px_rgba(24,24,27,0.14),0_8px_30px_rgba(0,0,0,0.05)]";

const textareaClass =
  "w-full rounded-2xl bg-[#f7f7f8] px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition resize-none focus:bg-white focus:shadow-[0_0_0_1px_rgba(24,24,27,0.14),0_8px_30px_rgba(0,0,0,0.05)]";

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[30px] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-zinc-950">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-zinc-800">{children}</label>
      {hint ? <span className="text-xs text-zinc-400">{hint}</span> : null}
    </div>
  );
}

function MediaSelectBox({ label, value, onSelect, onRemove }) {
  const [open, setOpen] = useState(false);
  const url = getMediaUrl(value);

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>

      <div className="rounded-3xl bg-[#f7f7f8] p-3">
        {url ? (
          <div className="relative overflow-hidden rounded-2xl bg-white">
            <img
              src={url}
              alt={label}
              className="aspect-[4/3] w-full object-cover"
            />

            <button
              type="button"
              onClick={onRemove}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-sm transition hover:bg-white"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl bg-white text-zinc-500 transition hover:bg-zinc-100"
          >
            <ImagePlus size={26} />
            <span className="mt-2 text-sm font-medium">Select image</span>
          </button>
        )}

        {url ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-xs text-zinc-500">{url}</p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:opacity-85"
            >
              Change
            </button>
          </div>
        ) : null}
      </div>

      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(media) => {
          onSelect(normalizeMedia(media));
          setOpen(false);
        }}
        folder="foton/collections"
        resourceType="image"
      />
    </div>
  );
}

function ToggleCard({ icon: Icon, title, text, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-[#f7f7f8] px-4 py-3.5 transition hover:bg-[#f2f2f3]">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${checked ? "bg-black text-white" : "bg-white text-zinc-600"
          }`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="mt-0.5 text-xs leading-5 text-zinc-500">{text}</div>
      </div>

      <div
        className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-black" : "bg-zinc-300"
          }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"
            }`}
        />
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
    </label>
  );
}

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

  const previewSlug = useMemo(
    () => form.slug || slugify(form.name),
    [form.slug, form.name]
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image: getMediaUrl(form.image),
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
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <div className="space-y-5">
          <SectionCard
            icon={Layers3}
            title="Basic Details"
            description="Set up the identity, slug, ordering, and main collection content."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <FieldLabel>Collection Name</FieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Layers3 size={16} />
                  </div>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    placeholder="Creator Essentials"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel hint="Auto preview below">Slug</FieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Hash size={16} />
                  </div>
                  <input
                    value={form.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                    placeholder="creator-essentials"
                    className={`${inputClass} pl-11`}
                  />
                </div>

                <div className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
                  Preview:{" "}
                  <span className="font-medium text-zinc-800">
                    /collections/{previewSlug || "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>Sort Order</FieldLabel>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-4 text-zinc-400">
                    <FileText size={16} />
                  </div>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Write a short collection description..."
                    className={`${textareaClass} pl-11`}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={ImageIcon}
            title="Collection Image"
            description="Select collection image from media library."
          >
            <MediaSelectBox
              label="Image"
              value={form.image}
              onSelect={(media) => setField("image", media)}
              onRemove={() => setField("image", "")}
            />
          </SectionCard>

          <ProductSelector
            label="Collection Products"
            value={form.productCodes}
            onChange={(next) => setField("productCodes", next)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-5">
          <SectionCard
            icon={SlidersHorizontal}
            title="Visibility"
            description="Control live status, featured flag, and homepage presence."
          >
            <div className="space-y-3">
              <ToggleCard
                icon={ShieldCheck}
                title="Active"
                text="Show this collection in active listings."
                checked={Boolean(form.isActive)}
                onChange={(value) => setField("isActive", value)}
              />

              <ToggleCard
                icon={BadgeCheck}
                title="Featured"
                text="Highlight this collection in important sections."
                checked={Boolean(form.isFeatured)}
                onChange={(value) => setField("isFeatured", value)}
              />

              <ToggleCard
                icon={Sparkles}
                title="Homepage"
                text="Allow this collection to appear on the homepage."
                checked={Boolean(form.showOnHomepage)}
                onChange={(value) => setField("showOnHomepage", value)}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Search}
            title="SEO"
            description="Optimize discoverability with title, description, and keywords."
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <FieldLabel>SEO Title</FieldLabel>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setField("seoTitle", e.target.value)}
                  placeholder="Creator Essentials | Brand"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>SEO Description</FieldLabel>
                <textarea
                  rows={4}
                  value={form.seoDescription}
                  onChange={(e) => setField("seoDescription", e.target.value)}
                  placeholder="Short SEO description..."
                  className={textareaClass}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel hint="Comma separated">SEO Keywords</FieldLabel>
                <input
                  value={form.seoKeywords}
                  onChange={(e) => setField("seoKeywords", e.target.value)}
                  placeholder="creator gear, studio setup, content creation"
                  className={inputClass}
                />
              </div>
            </div>
          </SectionCard>

          <div className="sticky top-24 rounded-[30px] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.07)] md:p-6">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                <Save size={12} />
                Final Action
              </div>

              <h3 className="mt-3 text-base font-semibold text-zinc-950">
                Ready to save?
              </h3>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Review the collection details and save changes once everything
                looks right.
              </p>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {form.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Featured
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {form.isFeatured ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Products
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {Array.isArray(form.productCodes)
                    ? form.productCodes.length
                    : 0}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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