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

  const hashtags = parseCommaText(form.hashtagsText);
  const linkedProducts = parseCommaText(form.productCodesText);

  return (
    <>
      <div className="min-h-screen bg-[#f6f6f7] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push("/blogs")}
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-black transition hover:bg-black/[0.02]"
              >
                <ArrowLeft size={16} />
                Back to Blogs
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  <Sparkles size={13} />
                  Admin Blog Editor
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                    Create Blog
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                    Clean, premium blog creation flow with media, hashtags,
                    linked products, and instant publish controls.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  {form.isPublished ? "Published" : "Draft"}
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
                  Images
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  {form.images.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
                  Products
                </p>
                <p className="mt-1 text-sm font-semibold text-black">
                  {linkedProducts.length}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
              <div className="space-y-6">
                {(error || message) && (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.04)] ring-1 ${
                      error
                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {error || message}
                  </div>
                )}

                <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
                  <div className="border-b border-black/6 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-1.5 rounded-full bg-black" />
                      <div>
                        <h2 className="text-base font-semibold text-black">
                          Basic Details
                        </h2>
                        <p className="mt-1 text-sm text-black/50">
                          Add the core blog information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                          Title
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          placeholder="Enter blog title"
                          className="h-12 w-full rounded-2xl border border-black/8 bg-[#fafafa] px-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/15 focus:bg-white focus:ring-4 focus:ring-black/5"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) =>
                            handleChange("slug", e.target.value)
                          }
                          placeholder="Auto-generated from title"
                          className="h-12 w-full rounded-2xl border border-black/8 bg-[#fafafa] px-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/15 focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                        <p className="mt-2 text-xs text-black/45">
                          Final slug:{" "}
                          <span className="font-medium text-black/75">
                            {computedSlug || "auto-generated"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                        Content
                      </label>
                      <textarea
                        rows={16}
                        value={form.content}
                        onChange={(e) =>
                          handleChange("content", e.target.value)
                        }
                        placeholder="Write blog content..."
                        className="w-full rounded-2xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm leading-6 text-black outline-none transition placeholder:text-black/30 focus:border-black/15 focus:bg-white focus:ring-4 focus:ring-black/5"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
                  <div className="border-b border-black/6 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-1.5 rounded-full bg-neutral-400" />
                      <div>
                        <h2 className="text-base font-semibold text-black">
                          Media
                        </h2>
                        <p className="mt-1 text-sm text-black/50">
                          Select one or more images from your media library.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenMedia(true)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:bg-black/85"
                      >
                        <ImagePlus size={16} />
                        {form.images.length ? "Manage Images" : "Select Images"}
                      </button>

                      {form.images.length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-black/70">
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
                            className="group relative overflow-hidden rounded-[20px] bg-[#f3f3f3] ring-1 ring-black/6"
                          >
                            <img
                              src={image.url}
                              alt={`Blog image ${index + 1}`}
                              className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_4px_12px_rgba(0,0,0,0.12)] ring-1 ring-black/8 transition hover:scale-105"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 rounded-[20px] bg-[#fafafa] px-4 py-12 text-center ring-1 ring-black/6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-black/8">
                          <ImagePlus size={20} className="text-black/70" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-black">
                          No images selected
                        </p>
                        <p className="mt-1 text-xs text-black/45">
                          Open media picker and choose blog images.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
                <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
                  <div className="border-b border-black/6 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-1.5 rounded-full bg-neutral-500" />
                      <div>
                        <h2 className="text-base font-semibold text-black">
                          Meta Details
                        </h2>
                        <p className="mt-1 text-sm text-black/50">
                          Optional metadata and publish settings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 px-5 py-5">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                        <Hash size={14} />
                        Hashtags
                      </label>
                      <input
                        type="text"
                        value={form.hashtagsText}
                        onChange={(e) =>
                          handleChange("hashtagsText", e.target.value)
                        }
                        placeholder="summer, outfit ideas, co-ord set"
                        className="h-12 w-full rounded-2xl border border-black/8 bg-[#fafafa] px-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/15 focus:bg-white focus:ring-4 focus:ring-black/5"
                      />
                      <p className="mt-2 text-xs text-black/45">
                        Add comma separated hashtags.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                        <Package size={14} />
                        Product Codes
                      </label>
                      <input
                        type="text"
                        value={form.productCodesText}
                        onChange={(e) =>
                          handleChange("productCodesText", e.target.value)
                        }
                        placeholder="000123, 000124"
                        className="h-12 w-full rounded-2xl border border-black/8 bg-[#fafafa] px-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/15 focus:bg-white focus:ring-4 focus:ring-black/5"
                      />
                      <p className="mt-2 text-xs text-black/45">
                        Optional. Add comma separated product codes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleChange("isPublished", !form.isPublished)
                      }
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition ring-1 ${
                        form.isPublished
                          ? "bg-black text-white ring-black"
                          : "bg-[#fafafa] text-black ring-black/6"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {form.isPublished ? "Published" : "Draft"}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            form.isPublished ? "text-white/65" : "text-black/45"
                          }`}
                        >
                          Toggle whether this blog goes live immediately.
                        </p>
                      </div>

                      <div
                        className={`relative h-6 w-11 rounded-full transition ${
                          form.isPublished ? "bg-white/20" : "bg-black/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            form.isPublished ? "left-6" : "left-1 bg-black"
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
                  <div className="border-b border-black/6 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-1.5 rounded-full bg-slate-500" />
                      <div>
                        <h2 className="text-base font-semibold text-black">
                          Quick Preview
                        </h2>
                        <p className="mt-1 text-sm text-black/50">
                          Live summary before saving.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="rounded-[20px] bg-[#fafafa] p-4 ring-1 ring-black/6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                        Blog Title
                      </p>
                      <p className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-black">
                        {form.title || "Your blog title will appear here"}
                      </p>

                      <div className="mt-4 h-px bg-black/6" />

                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                            Slug
                          </p>
                          <p className="mt-1 break-all text-sm text-black/70">
                            /blogs/{computedSlug || "your-blog-slug"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white p-3 ring-1 ring-black/6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
                              Hashtags
                            </p>
                            <p className="mt-1 text-sm font-medium text-black">
                              {hashtags.length}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white p-3 ring-1 ring-black/6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
                              Products
                            </p>
                            <p className="mt-1 text-sm font-medium text-black">
                              {linkedProducts.length}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
                            Visibility
                          </p>
                          <div
                            className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              form.isPublished
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-neutral-100 text-neutral-700 ring-1 ring-black/6"
                            }`}
                          >
                            <CheckCircle2 size={14} />
                            {form.isPublished ? "Published" : "Draft"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save size={16} />
                        {isSubmitting ? "Saving..." : "Create Blog"}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/blogs")}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#f3f3f3] px-5 text-sm font-medium text-black transition hover:bg-[#ebebeb]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </form>
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