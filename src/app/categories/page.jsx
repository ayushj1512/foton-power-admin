"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw } from "lucide-react";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    message,
    filters,
    setFilters,
    clearMessages,
    fetchCategories,
    toggleCategoryStatus,
    deleteCategory,
  } = useAdminCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchCategories({ page: 1 });
  };

  const handleToggle = async (id) => {
    try {
      await toggleCategoryStatus(id);
    } catch {}
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    try {
      await deleteCategory(id);
    } catch {}
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Categories</h1>
          <p className="text-sm text-black/60">
            Manage all categories and subcategories here
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fetchCategories()}
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <Link
            href="/categories/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={16} />
            Create Category
          </Link>
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

      {/* Filters */}
      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-black">
            Search
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-black/10 px-3">
            <Search size={16} className="text-black/50" />
            <input
              type="text"
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by name, slug, code..."
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Status
          </label>
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ isActive: e.target.value })}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Featured
          </label>
          <select
            value={filters.isFeatured}
            onChange={(e) => setFilters({ isFeatured: e.target.value })}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value })}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="sortOrder">Sort Order</option>
            <option value="name">Name</option>
            <option value="createdAt">Created At</option>
            <option value="updatedAt">Updated At</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Sort Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ sortOrder: e.target.value })}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleApplyFilters}
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-black/60">
            Loading categories...
          </div>
        ) : categories?.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-black/60">No categories found</p>
            <Link
              href="/categories/create"
              className="mt-4 inline-flex rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Create First Category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-black/10 text-sm text-black/60">
                <tr>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Subcategories</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Featured</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((item) => (
                  <tr key={item._id} className="border-b border-black/5">
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover border border-black/10"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-black/5 text-xs text-black/50">
                            NA
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-xs text-black/50">{item.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-black/70">
                      {item.code || "—"}
                    </td>

                    <td className="px-3 py-4 text-sm text-black/70">
                      {item.subcategories?.length || 0}
                    </td>

                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleToggle(item._id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-3 py-4 text-sm text-black/70">
                      {item.isFeatured ? "Yes" : "No"}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/categories/${item.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-medium text-black transition hover:bg-black/5"
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        <Link
                          href={`/categories/${item.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-medium text-black transition hover:bg-black/5"
                        >
                          <Pencil size={14} />
                          Manage
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}