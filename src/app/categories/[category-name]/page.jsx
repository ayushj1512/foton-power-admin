"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params["category-name"];

  const {
    categories,
    fetchCategories,
    updateCategory,
    addSubcategory,
    deleteSubcategory,
    toggleSubcategoryStatus,
    isLoading,
    error,
    message,
    clearMessages,
  } = useAdminCategoryStore();

  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [categories, slug]
  );

  const [form, setForm] = useState(null);
  const [subForm, setSubForm] = useState({
    name: "",
    slug: "",
    code: "",
    description: "",
    image: "",
    color: "",
    tags: "",
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories({ limit: 200 });
  }, [fetchCategories]);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        code: category.code || "",
        description: category.description || "",
        shortDescription: category.shortDescription || "",
        image: category.image || "",
        bannerImage: category.bannerImage || "",
        icon: category.icon || "",
        color: category.color || "",
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
        tags: Array.isArray(category.tags) ? category.tags.join(", ") : "",
        sortOrder: category.sortOrder || 0,
        isFeatured: !!category.isFeatured,
        isActive: !!category.isActive,
      });
    }
  }, [category]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubChange = (key, value) => {
    setSubForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!category?._id || !form) return;

    try {
      await updateCategory(category._id, {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      await fetchCategories({ limit: 200 });
    } catch {}
  };

  const handleAddSubcategory = async () => {
    if (!category?._id || !subForm.name.trim()) return;

    try {
      await addSubcategory(category._id, {
        ...subForm,
        tags: subForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setSubForm({
        name: "",
        slug: "",
        code: "",
        description: "",
        image: "",
        color: "",
        tags: "",
        sortOrder: 0,
        isFeatured: false,
        isActive: true,
      });

      await fetchCategories({ limit: 200 });
    } catch {}
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!category?._id) return;
    const ok = window.confirm("Delete this subcategory?");
    if (!ok) return;

    try {
      await deleteSubcategory(category._id, subcategoryId);
      await fetchCategories({ limit: 200 });
    } catch {}
  };

  const handleToggleSubcategory = async (subcategoryId) => {
    if (!category?._id) return;

    try {
      await toggleSubcategoryStatus(category._id, subcategoryId);
      await fetchCategories({ limit: 200 });
    } catch {}
  };

  if (!category || !form) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-black/60">
            {isLoading ? "Loading category..." : "Category not found"}
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-flex rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/categories"
            className="mb-3 inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Categories
          </Link>

          <h1 className="text-2xl font-semibold text-black">{category.name}</h1>
          <p className="text-sm text-black/60">{category.slug}</p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button onClick={clearMessages}>Close</button>
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center justify-between gap-3">
            <span>{message}</span>
            <button onClick={clearMessages}>Close</button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-black">Basic Info</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(v) => handleChange("name", v)} />
              <Input label="Slug" value={form.slug} onChange={(v) => handleChange("slug", v)} />
              <Input label="Code" value={form.code} onChange={(v) => handleChange("code", v)} />
              <Input
                label="Sort Order"
                type="number"
                value={form.sortOrder}
                onChange={(v) => handleChange("sortOrder", Number(v))}
              />
              <Input label="Color" value={form.color} onChange={(v) => handleChange("color", v)} />
              <Input label="Icon" value={form.icon} onChange={(v) => handleChange("icon", v)} />
            </div>

            <div className="mt-4 grid gap-4">
              <Textarea
                label="Description"
                value={form.description}
                onChange={(v) => handleChange("description", v)}
              />
              <Textarea
                label="Short Description"
                value={form.shortDescription}
                onChange={(v) => handleChange("shortDescription", v)}
              />
              <Input
                label="Tags (comma separated)"
                value={form.tags}
                onChange={(v) => handleChange("tags", v)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-black">Media & SEO</h2>

            <div className="grid gap-4">
              <Input label="Image URL" value={form.image} onChange={(v) => handleChange("image", v)} />
              <Input
                label="Banner Image URL"
                value={form.bannerImage}
                onChange={(v) => handleChange("bannerImage", v)}
              />
              <Input
                label="SEO Title"
                value={form.seoTitle}
                onChange={(v) => handleChange("seoTitle", v)}
              />
              <Textarea
                label="SEO Description"
                value={form.seoDescription}
                onChange={(v) => handleChange("seoDescription", v)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-black">Subcategories</h2>
              <button
                onClick={handleAddSubcategory}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Subcategory Name"
                value={subForm.name}
                onChange={(v) => handleSubChange("name", v)}
              />
              <Input
                label="Slug"
                value={subForm.slug}
                onChange={(v) => handleSubChange("slug", v)}
              />
              <Input
                label="Code"
                value={subForm.code}
                onChange={(v) => handleSubChange("code", v)}
              />
              <Input
                label="Sort Order"
                type="number"
                value={subForm.sortOrder}
                onChange={(v) => handleSubChange("sortOrder", Number(v))}
              />
              <Input
                label="Image URL"
                value={subForm.image}
                onChange={(v) => handleSubChange("image", v)}
              />
              <Input
                label="Color"
                value={subForm.color}
                onChange={(v) => handleSubChange("color", v)}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  value={subForm.description}
                  onChange={(v) => handleSubChange("description", v)}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Tags (comma separated)"
                  value={subForm.tags}
                  onChange={(v) => handleSubChange("tags", v)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(category.subcategories || []).length === 0 ? (
                <p className="text-sm text-black/60">No subcategories yet</p>
              ) : (
                category.subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-black">{sub.name}</p>
                      <p className="text-xs text-black/50">{sub.slug}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleSubcategory(sub._id)}
                        className={`rounded-xl px-3 py-2 text-xs font-medium ${
                          sub.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </button>

                      <button
                        onClick={() => handleDeleteSubcategory(sub._id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-black">Settings</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-black">Active</span>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-black">Featured</span>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <button
              onClick={handleSave}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
            >
              Save Category
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-black"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}