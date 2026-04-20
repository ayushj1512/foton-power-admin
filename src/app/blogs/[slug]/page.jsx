"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Hash,
  Pencil,
  Link2,
  Eye,
} from "lucide-react";
import { useAdminBlogStore } from "@/store/adminBlogStore";

const formatDate = (date) => {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export default function BlogPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const {
    blog,
    isLoading,
    error,
    fetchBlogBySlug,
    clearBlog,
    clearMessages,
  } = useAdminBlogStore();

  useEffect(() => {
    if (!slug) return;

    fetchBlogBySlug(slug);

    return () => {
      clearBlog();
      clearMessages();
    };
  }, [slug, fetchBlogBySlug, clearBlog, clearMessages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-neutral-500">Loading blog preview...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-xl font-semibold text-black">Blog not found</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {error || "This blog does not exist or may have been removed."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const images = Array.isArray(blog.images) ? blog.images : [];
  const hashtags = Array.isArray(blog.hashtags) ? blog.hashtags : [];
  const productCodes = Array.isArray(blog.productCodes) ? blog.productCodes : [];

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
              <Eye size={14} />
              Blog Preview
            </div>

            <h1 className="text-2xl font-semibold text-black md:text-3xl">
              {blog.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={15} />
                Created: {formatDate(blog.createdAt)}
              </span>

              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black">
                {blog.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={() => router.push(`/blogs/edit/${blog._id}`)}
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              <Pencil size={16} />
              Edit Blog
            </button>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="aspect-[16/8] bg-neutral-100">
              <img
                src={images[0]?.url}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-7">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Blog Content
              </p>
            </div>

            <div className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-800">
              {blog.content}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Hash size={17} className="text-neutral-500" />
                <h2 className="text-base font-semibold text-black">Hashtags</h2>
              </div>

              {hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/10 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-black"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No hashtags added.</p>
              )}
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Link2 size={17} className="text-neutral-500" />
                <h2 className="text-base font-semibold text-black">
                  Linked Products
                </h2>
              </div>

              {productCodes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {productCodes.map((code) => (
                    <span
                      key={code}
                      className="rounded-full border border-black/10 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-black"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  No product codes linked.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5">
              <h2 className="mb-3 text-base font-semibold text-black">
                Blog Info
              </h2>

              <div className="space-y-3 text-sm text-neutral-600">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                    Slug
                  </p>
                  <p className="break-all text-black">{blog.slug || "—"}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                    Updated
                  </p>
                  <p className="text-black">{formatDate(blog.updatedAt)}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                    Images
                  </p>
                  <p className="text-black">{images.length}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                    Product Links
                  </p>
                  <p className="text-black">{productCodes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {images.length > 1 ? (
          <div className="rounded-3xl border border-black/10 bg-white p-5 md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-black">
              More Images
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.slice(1).map((image, index) => (
                <div
                  key={`${image?.url}-${index}`}
                  className="overflow-hidden rounded-3xl border border-black/10 bg-neutral-50"
                >
                  <div className="aspect-[4/3] bg-neutral-100">
                    <img
                      src={image?.url}
                      alt={`${blog.title}-${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}