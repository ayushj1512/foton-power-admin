"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Hash,
  ImagePlus,
  Package,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useAdminBlogStore } from "@/store/adminBlogStore";
import MediaPickerModal from "@/components/media/MediaPickerModal";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

const parseCommaText = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function CreateBlogPage() {
  const router = useRouter();
  const { createBlog, isSubmitting, error, message, clearMessages } =
    useAdminBlogStore();

  const [openMedia, setOpenMedia] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    hashtagsText: "",
    productCodesText: "",
    images: [],
    isPublished: true,
  });

  const computedSlug = useMemo(() => {
    if (form.slug.trim()) return slugify(form.slug);
    return slugify(form.title);
  }, [form.slug, form.title]);

  const handleChange = (key, value) => {
    clearMessages?.();
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMediaSelect = (selected) => {
    const mediaItems = Array.isArray(selected) ? selected : [selected];

    const formatted = mediaItems
      .filter(Boolean)
      .map((item) => ({
        url: item?.secureUrl || item?.url || "",
        public_id: item?.publicId || item?.public_id || "",
      }))
      .filter((item) => item.url);

    setForm((prev) => ({
      ...prev,
      images: formatted,
    }));

    setOpenMedia(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      slug: computedSlug,
      content: form.content.trim(),
      hashtags: parseCommaText(form.hashtagsText),
      productCodes: parseCommaText(form.productCodesText),
      images: form.images,
      isPublished: form.isPublished,
    };

    const res = await createBlog(payload);

    if (res?.success !== false) {
      router.push("/blogs");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f4f5f7] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex w-full flex-col gap-6">
          <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="border-b border-neutral-200 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/60 p-5 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push("/blogs")}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 text-sm font-medium text-black transition hover:bg-neutral-50"
                  >
                    <ArrowLeft size={16} />
                    Back to Blogs
                  </button>

                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      <Sparkles size={14} />
                      Admin Blog Editor
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                      Create Blog
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                      Create a rich blog post with content, linked products,
                      hashtags, and media from your admin library.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/45">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {form.isPublished ? "Published" : "Draft"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/45">
                      Images
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {form.images.length}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 shadow-sm sm:col-span-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/45">
                      Slug
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-black">
                      {computedSlug || "auto-generated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-7">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  {(error || message) && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${
                        error
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {error || message}
                    </div>
                  )}

                  <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-black">
                        Basic Details
                      </h2>
                      <p className="mt-1 text-sm text-black/55">
                        Add the main blog information here.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black">
                          Title
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          placeholder="Enter blog title"
                          className="h-12 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-black">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) =>
                            handleChange("slug", e.target.value)
                          }
                          placeholder="Auto-generated from title"
                          className="h-12 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        />
                        <p className="mt-2 text-xs text-black/45">
                          Final slug:{" "}
                          <span className="font-semibold text-black/70">
                            {computedSlug || "—"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-black">
                        Content
                      </label>
                      <textarea
                        rows={14}
                        value={form.content}
                        onChange={(e) =>
                          handleChange("content", e.target.value)
                        }
                        placeholder="Write blog content..."
                        className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-black">
                        Media
                      </h2>
                      <p className="mt-1 text-sm text-black/55">
                        Select blog images directly from your media library.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenMedia(true)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
                      >
                        <ImagePlus size={16} />
                        {form.images.length ? "Manage Images" : "Select Images"}
                      </button>

                      {form.images.length > 0 && (
                        <span className="rounded-full border border-neutral-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                          {form.images.length} image
                          {form.images.length > 1 ? "s" : ""} selected
                        </span>
                      )}
                    </div>

                    {form.images.length > 0 ? (
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {form.images.map((image, index) => (
                          <div
                            key={`${image.url}-${index}`}
                            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm"
                          >
                            <img
                              src={image.url}
                              alt={`Blog image ${index + 1}`}
                              className="aspect-[4/4.5] h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-black shadow-sm transition hover:scale-105"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
                          <ImagePlus size={20} className="text-slate-700" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-black">
                          No images selected
                        </p>
                        <p className="mt-1 text-xs text-black/50">
                          Open media picker and choose one or more blog images.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-black">
                        Meta Details
                      </h2>
                      <p className="mt-1 text-sm text-black/55">
                        Optional metadata for better organization.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                          <Hash size={16} />
                          Hashtags
                        </label>
                        <input
                          type="text"
                          value={form.hashtagsText}
                          onChange={(e) =>
                            handleChange("hashtagsText", e.target.value)
                          }
                          placeholder="summer, outfit ideas, co-ord set"
                          className="h-12 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        />
                        <p className="mt-2 text-xs text-black/45">
                          Add comma separated hashtags.
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                          <Package size={16} />
                          Product Codes
                        </label>
                        <input
                          type="text"
                          value={form.productCodesText}
                          onChange={(e) =>
                            handleChange("productCodesText", e.target.value)
                          }
                          placeholder="000123, 000124"
                          className="h-12 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        />
                        <p className="mt-2 text-xs text-black/45">
                          Optional. Add comma separated product codes.
                        </p>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-gradient-to-br from-neutral-50 to-slate-50 px-4 py-4 transition hover:from-white hover:to-slate-50">
                        <input
                          type="checkbox"
                          checked={form.isPublished}
                          onChange={(e) =>
                            handleChange("isPublished", e.target.checked)
                          }
                          className="mt-0.5 h-4 w-4 rounded border-neutral-400"
                        />
                        <div>
                          <p className="text-sm font-medium text-black">
                            Publish this blog now
                          </p>
                          <p className="mt-1 text-xs text-black/50">
                            Keep this enabled to publish immediately after save.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-black">
                        Quick Preview
                      </h2>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-slate-50 p-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40">
                          Title
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-black">
                          {form.title || "Your blog title will appear here"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40">
                          Slug
                        </p>
                        <p className="mt-1 break-all text-sm text-black/70">
                          /blogs/{computedSlug || "your-blog-slug"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40">
                          Linked Products
                        </p>
                        <p className="mt-1 text-sm text-black/70">
                          {parseCommaText(form.productCodesText).length || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40">
                          Visibility
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                          <CheckCircle2 size={14} />
                          {form.isPublished ? "Published" : "Draft"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save size={16} />
                        {isSubmitting ? "Saving..." : "Create Blog"}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/blogs")}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-300 bg-neutral-100 px-5 text-sm font-medium text-black transition hover:bg-neutral-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <MediaPickerModal
        open={openMedia}
        onClose={() => setOpenMedia(false)}
        onSelect={handleMediaSelect}
        multiple
        folder="miray/blogs"
        resourceType="image"
      />
    </>
  );
}