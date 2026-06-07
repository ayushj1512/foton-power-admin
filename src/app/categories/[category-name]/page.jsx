"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";
import MediaPickerModal from "@/components/media/MediaPickerModal";

const getMediaUrl = (media) =>
  media?.secureUrl || media?.url || media?.image || media || "";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params["category-name"];

  const [picker, setPicker] = useState(null);

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

  const emptySubForm = {
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
  };

  const [subForm, setSubForm] = useState(emptySubForm);

  useEffect(() => {
    fetchCategories({ limit: 200 });
  }, [fetchCategories]);

  useEffect(() => {
    if (!category) return;

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
  }, [category]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubChange = (key, value) => {
    setSubForm((prev) => ({ ...prev, [key]: value }));
  };

  const openPicker = (target) => {
    setPicker(target);
  };

  const closePicker = () => {
    setPicker(null);
  };

  const handleMediaSelect = (media) => {
    const url = getMediaUrl(media);
    if (!url) return;

    if (picker === "image") handleChange("image", url);
    if (picker === "bannerImage") handleChange("bannerImage", url);
    if (picker === "subImage") handleSubChange("image", url);

    closePicker();
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

      setSubForm(emptySubForm);
      await fetchCategories({ limit: 200 });
    } catch {}
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!category?._id) return;
    if (!window.confirm("Delete this subcategory?")) return;

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
      <div className="p-4 sm:p-6">
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
    <>
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
          <Alert type="error" text={error} onClose={clearMessages} />
        )}

        {message && (
          <Alert type="success" text={message} onClose={clearMessages} />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Basic Info">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v) => handleChange("name", v)} />
                <Input label="Slug" value={form.slug} onChange={(v) => handleChange("slug", v)} />
                <Input label="Code" value={form.code} onChange={(v) => handleChange("code", v)} />
                <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(v) => handleChange("sortOrder", Number(v))} />
                <Input label="Color" value={form.color} onChange={(v) => handleChange("color", v)} />
                <Input label="Icon" value={form.icon} onChange={(v) => handleChange("icon", v)} />
              </div>

              <div className="mt-4 grid gap-4">
                <Textarea label="Description" value={form.description} onChange={(v) => handleChange("description", v)} />
                <Textarea label="Short Description" value={form.shortDescription} onChange={(v) => handleChange("shortDescription", v)} />
                <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => handleChange("tags", v)} />
              </div>
            </Card>

            <Card title="Photos & SEO">
              <div className="grid gap-4 md:grid-cols-2">
                <MediaField
                  label="Category Image"
                  value={form.image}
                  onPick={() => openPicker("image")}
                  onRemove={() => handleChange("image", "")}
                  onChange={(v) => handleChange("image", v)}
                />

              
              </div>

              <div className="mt-4 grid gap-4">
                <Input label="SEO Title" value={form.seoTitle} onChange={(v) => handleChange("seoTitle", v)} />
                <Textarea label="SEO Description" value={form.seoDescription} onChange={(v) => handleChange("seoDescription", v)} />
              </div>
            </Card>

            <Card>
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
                <Input label="Subcategory Name" value={subForm.name} onChange={(v) => handleSubChange("name", v)} />
                <Input label="Slug" value={subForm.slug} onChange={(v) => handleSubChange("slug", v)} />
                <Input label="Code" value={subForm.code} onChange={(v) => handleSubChange("code", v)} />
                <Input label="Sort Order" type="number" value={subForm.sortOrder} onChange={(v) => handleSubChange("sortOrder", Number(v))} />

                <div className="md:col-span-2">
                  <MediaField
                    label="Subcategory Image"
                    value={subForm.image}
                    onPick={() => openPicker("subImage")}
                    onRemove={() => handleSubChange("image", "")}
                    onChange={(v) => handleSubChange("image", v)}
                  />
                </div>

                <Input label="Color" value={subForm.color} onChange={(v) => handleSubChange("color", v)} />

                <div className="md:col-span-2">
                  <Textarea label="Description" value={subForm.description} onChange={(v) => handleSubChange("description", v)} />
                </div>

                <div className="md:col-span-2">
                  <Input label="Tags (comma separated)" value={subForm.tags} onChange={(v) => handleSubChange("tags", v)} />
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
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-black/[0.04]">
                          {sub.image ? (
                            <Image src={sub.image} alt={sub.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-black/30">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-black">{sub.name}</p>
                          <p className="truncate text-xs text-black/50">{sub.slug}</p>
                        </div>
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
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Current Preview">
              <div className="space-y-4">
                <PreviewImage label="Category Image" src={form.image} />
              </div>
            </Card>

            <Card title="Settings">
              <div className="space-y-4">
                <Toggle label="Active" checked={form.isActive} onChange={(v) => handleChange("isActive", v)} />
                <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => handleChange("isFeatured", v)} />
              </div>
            </Card>

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

      <MediaPickerModal
        open={!!picker}
        onClose={closePicker}
        onSelect={handleMediaSelect}
        folder="foton/categories"
        resourceType="image"
      />
    </>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      {title && <h2 className="mb-4 text-lg font-semibold text-black">{title}</h2>}
      {children}
    </div>
  );
}

function MediaField({ label, value, onChange, onPick, onRemove }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <PreviewImage src={value} compact />

        <div className="space-y-3 p-3">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL or choose from media"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPick}
              className="flex-1 rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white"
            >
              Choose Photo
            </button>

            {value && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-black/60 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewImage({ label, src, compact = false }) {
  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-medium text-black">
          {label}
        </p>
      )}

      <div
        className={`relative overflow-hidden rounded-2xl bg-black/[0.04] ${
          compact ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={label || "Preview"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-black/35">
            <ImageIcon size={22} />
            <span className="text-xs">
              No photo selected
            </span>
          </div>
        )}
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-black">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function Alert({ type, text, onClose }) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{text}</span>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}