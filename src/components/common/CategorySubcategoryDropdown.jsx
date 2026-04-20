"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown, FolderTree, Loader2, Layers3 } from "lucide-react";
import { useAdminCategoryStore } from "@/store/adminCategoryStore";

export default function CategorySubcategoryDropdown({
  categoryId = "",
  subcategoryId = "",
  onCategoryChange,
  onSubcategoryChange,
  categoryLabel = "Category",
  subcategoryLabel = "Subcategory",
  categoryPlaceholder = "Select category",
  subcategoryPlaceholder = "Select subcategory",
  required = false,
  disabled = false,
  showSubcategory = true,
  onlyActive = true,
  className = "",
}) {
  const { categories, isLoading, fetchCategories } = useAdminCategoryStore();

  useEffect(() => {
    if (!categories.length) {
      fetchCategories({
        page: 1,
        limit: 200,
        isActive: onlyActive ? "true" : "",
      });
    }
  }, [categories.length, fetchCategories, onlyActive]);

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((item) => (onlyActive ? item?.isActive !== false : true));
  }, [categories, onlyActive]);

  const selectedCategory = useMemo(
    () => categoryOptions.find((item) => item?._id === categoryId) || null,
    [categoryOptions, categoryId]
  );

  const subcategoryOptions = useMemo(() => {
    const list = Array.isArray(selectedCategory?.subcategories)
      ? selectedCategory.subcategories
      : [];

    return list.filter((item) => (onlyActive ? item?.isActive !== false : true));
  }, [selectedCategory, onlyActive]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    onCategoryChange?.(value, categoryOptions.find((item) => item?._id === value) || null);
    onSubcategoryChange?.("", null);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    onSubcategoryChange?.(
      value,
      subcategoryOptions.find((item) => item?._id === value) || null
    );
  };

  const fieldClass =
    "h-12 w-full appearance-none rounded-2xl border border-black/10 bg-white pl-11 pr-10 text-sm text-black outline-none transition focus:border-black/25 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-black/40";

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-black/80">
          <FolderTree size={15} className="text-black/45" />
          <span>
            {categoryLabel}
            {required ? <span className="ml-1 text-red-500">*</span> : null}
          </span>
        </label>

        <div className="relative">
          <FolderTree
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
          />

          <select
            value={categoryId}
            onChange={handleCategoryChange}
            disabled={disabled || isLoading}
            className={fieldClass}
          >
            <option value="">
              {isLoading ? "Loading categories..." : categoryPlaceholder}
            </option>

            {categoryOptions.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          {isLoading ? (
            <Loader2
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-black/35"
            />
          ) : (
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
            />
          )}
        </div>

        <p className="text-xs text-black/45">
          Choose the main category for this product.
        </p>
      </div>

      {showSubcategory ? (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-black/80">
            <Layers3 size={15} className="text-black/45" />
            <span>{subcategoryLabel}</span>
          </label>

          <div className="relative">
            <Layers3
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <select
              value={subcategoryId}
              onChange={handleSubcategoryChange}
              disabled={disabled || !categoryId || isLoading}
              className={fieldClass}
            >
              <option value="">
                {!categoryId ? "Select category first" : subcategoryPlaceholder}
              </option>

              {subcategoryOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
            />
          </div>

          <p className="text-xs text-black/45">
            {categoryId
              ? "Pick a subcategory if available."
              : "Subcategory will unlock after selecting category."}
          </p>
        </div>
      ) : null}
    </div>
  );
}