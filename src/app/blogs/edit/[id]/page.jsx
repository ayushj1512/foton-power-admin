"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  FileText,
  Hash,
  Image as ImageIcon,
  Link2,
  Eye,
} from "lucide-react";
import { useAdminBlogStore } from "@/store/adminBlogStore";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const {
    blogs,
    isLoading,
    isSubmitting,
    error,
    message,
    fetchBlogs,
    updateBlog,
    clearMessages,
  } = useAdminBlogStore();

  const currentBlog = useMemo(
    () => blogs.find((item) => item._id === id),
    [blogs, id]
  );

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    imageInput: "",
    hashtagInput: "",
    productCodeInput: "",
    images: [],
    hashtags: [],
    productCodes: [],
    isPublished: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (!currentBlog) return;

    setForm({
      title: currentBlog.title || "",
      slug: currentBlog.slug || "",
      content: currentBlog.content || "",
      imageInput: "",
      hashtagInput: "",
      productCodeInput: "",
      images: Array.isArray(currentBlog.images) ? currentBlog.images : [],
      hashtags: Array.isArray(currentBlog.hashtags) ? currentBlog.hashtags : [],
      productCodes: Array.isArray(currentBlog.productCodes)
        ? currentBlog.productCodes
        : [],
      isPublished:
        typeof currentBlog.isPublished === "boolean"
          ? currentBlog.isPublished
          : true,
    });
  }, [currentBlog]);

  useEffect(() => {
    return () => clearMessages();
  }, [clearMessages]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTitleBlur = () => {
    if (!form.slug?.trim() && form.title?.trim()) {
      setForm((prev) => ({
        ...prev,
        slug: slugify(prev.title),
      }));
    }
  };

  const addImage = () => {
    const url = form.imageInput.trim();
    if (!url) return;

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { url, public_id: "" }],
      imageInput: "",
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addHashtag = () => {
    const tag = form.hashtagInput.trim().replace(/^#/, "");
    if (!tag) return;

    setForm((prev) => ({
      ...prev,
      hashtags: [...new Set([...prev.hashtags, tag])],
      hashtagInput: "",
    }));
  };

  const removeHashtag = (tag) => {
    setForm((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((item) => item !== tag),
    }));
  };

  const addProductCode = () => {
    const code = form.productCodeInput.trim();
    if (!code) return;

    setForm((prev) => ({
      ...prev,
      productCodes: [...new Set([...prev.productCodes, code])],
      productCodeInput: "",
    }));
  };

  const removeProductCode = (code) => {
    setForm((prev) => ({
      ...prev,
      productCodes: prev.productCodes.filter((item) => item !== code),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      content: form.content.trim(),
      images: form.images,
      hashtags: form.hashtags,
      productCodes: form.productCodes,
      isPublished: form.isPublished,
    };

    const res = await updateBlog(id, payload);

    if (res?.success) {
      router.push("/blogs");
    }
  };

  if (isLoading && !currentBlog) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-neutral-500">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !currentBlog) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-xl font-semibold text-black">Blog not found</h1>
          <p className="mt-2 text-sm text-neutral-600">
            This blog does not exist or may have been deleted.
          </p>

          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-black">Edit Blog</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Update blog content, images, hashtags, and linked products.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {form.slug ? (
              <button
                type="button"
                onClick={() => router.push(`/blogs/${form.slug}`)}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100"
              >
                <Eye size={16} />
                Preview
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <FileText size={18} className="text-neutral-500" />
              <h2 className="text-lg font-semibold text-black">
                Blog Details
              </h2>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleTitleBlur}
                  placeholder="Enter blog title"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: slugify(e.target.value),
                    }))
                  }
                  placeholder="blog-slug"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="Write your blog content here..."
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  required
                />
              </div>

              <label className="inline-flex w-fit items-center gap-3 rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm font-medium text-black">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Published
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <ImageIcon size={18} className="text-neutral-500" />
              <h2 className="text-lg font-semibold text-black">Images</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={form.imageInput}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageInput: e.target.value }))
                }
                placeholder="Paste image URL"
                className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
              >
                Add Image
              </button>
            </div>

            {form.images.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {form.images.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className="overflow-hidden rounded-3xl border border-black/10 bg-neutral-50"
                  >
                    <div className="aspect-[4/3] bg-neutral-100">
                      {image?.url ? (
                        <img
                          src={image.url}
                          alt={`Blog ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="space-y-3 p-3">
                      <p className="line-clamp-2 text-xs text-neutral-600">
                        {image.url}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-full rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-500">
                No images added yet.
              </p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Hash size={18} className="text-neutral-500" />
                <h2 className="text-lg font-semibold text-black">Hashtags</h2>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={form.hashtagInput}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      hashtagInput: e.target.value,
                    }))
                  }
                  placeholder="e.g. summerstyle"
                  className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.hashtags.length > 0 ? (
                  form.hashtags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="rounded-full border border-black/10 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-black"
                    >
                      #{tag} ×
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No hashtags added.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Link2 size={18} className="text-neutral-500" />
                <h2 className="text-lg font-semibold text-black">
                  Product Codes
                </h2>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={form.productCodeInput}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      productCodeInput: e.target.value,
                    }))
                  }
                  placeholder="e.g. 000123"
                  className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
                <button
                  type="button"
                  onClick={addProductCode}
                  className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.productCodes.length > 0 ? (
                  form.productCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => removeProductCode(code)}
                      className="rounded-full border border-black/10 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-black"
                    >
                      {code} ×
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    No product codes linked.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}