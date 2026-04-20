"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  FilePlus2,
  Pencil,
  Search,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { useAdminBlogStore } from "@/store/adminBlogStore";

export default function BlogsPage() {
  const {
    blogs,
    isLoading,
    isSubmitting,
    error,
    message,
    fetchBlogs,
    deleteBlog,
    togglePublishBlog,
    clearMessages,
  } = useAdminBlogStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (!error && !message) return;
    const timer = setTimeout(() => clearMessages(), 2500);
    return () => clearTimeout(timer);
  }, [error, message, clearMessages]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title?.toLowerCase().includes(query) ||
        blog.slug?.toLowerCase().includes(query) ||
        blog.hashtags?.some((tag) => tag?.toLowerCase().includes(query));

      const matchesStatus =
        status === "all"
          ? true
          : status === "published"
          ? blog.isPublished
          : !blog.isPublished;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, status]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;
    await deleteBlog(id);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
            <p className="text-sm text-black/60">
              Manage blog posts, drafts, and linked products.
            </p>
          </div>

          <Link
            href="/blogs/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <FilePlus2 className="h-4 w-4" />
            Create Blog
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px_140px]">
          <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3">
            <Search className="h-4 w-4 text-black/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug, hashtag..."
              className="h-11 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button
            type="button"
            onClick={fetchBlogs}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {(error || message) && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              error
                ? "border border-red-200 bg-red-50 text-red-600"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-black/10 bg-black/[0.03]">
              <tr className="text-sm text-black/70">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Hashtags</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-black/60">
                    Loading blogs...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-black/60">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="font-medium text-black">{blog.title}</div>
                    </td>

                    <td className="px-4 py-4 text-sm text-black/60">{blog.slug}</td>

                    <td className="px-4 py-4">
                      <div className="flex max-w-[240px] flex-wrap gap-2">
                        {blog.hashtags?.length ? (
                          blog.hashtags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={`${tag}-${idx}`}
                              className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs text-black/70"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-black/40">-</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-black/60">
                      {blog.productCodes?.length || 0}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => togglePublishBlog(blog)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          blog.isPublished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-sm text-black/60">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 transition hover:bg-black hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/blogs/edit/${blog._id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 transition hover:bg-black hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDelete(blog._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}