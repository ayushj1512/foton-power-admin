"use client";

import { useEffect, useMemo } from "react";
import { Check, ChevronDown, Layers3, Loader2, X } from "lucide-react";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export default function CollectionDropdown({
  value = "",
  onChange,
  label = "Collection",
  placeholder = "Select collection",
  required = false,
  disabled = false,
  onlyActive = true,
  showFeaturedOnly = false,
  showHomepageOnly = false,
  multiple = false,
  helperText = "",
  className = "",
}) {
  const {
    collections,
    activeCollections,
    isLoading,
    fetchCollections,
    fetchActiveCollections,
  } = useAdminCollectionStore();

  useEffect(() => {
    if (onlyActive) {
      if (!activeCollections.length) fetchActiveCollections();
      return;
    }

    if (!collections.length) fetchCollections();
  }, [
    onlyActive,
    collections.length,
    activeCollections.length,
    fetchCollections,
    fetchActiveCollections,
  ]);

  const options = useMemo(() => {
    const source = onlyActive ? activeCollections : collections;

    return source.filter((item) => {
      if (showFeaturedOnly && !item?.isFeatured) return false;
      if (showHomepageOnly && !item?.showOnHomepage) return false;
      return true;
    });
  }, [
    onlyActive,
    activeCollections,
    collections,
    showFeaturedOnly,
    showHomepageOnly,
  ]);

  const selectedValues = useMemo(() => {
    return multiple ? toArray(value) : value ? [value] : [];
  }, [multiple, value]);

  const selectedItems = useMemo(() => {
    if (!selectedValues.length) return [];
    const set = new Set(selectedValues.map(String));
    return options.filter((item) => set.has(String(item._id)));
  }, [options, selectedValues]);

  const handleSingleChange = (nextValue) => {
    onChange?.(nextValue);
  };

  const handleMultiChange = (nextValue) => {
    if (!nextValue) return;

    const exists = selectedValues.some((item) => String(item) === String(nextValue));
    if (exists) return;

    onChange?.([...selectedValues, nextValue]);
  };

  const removeSelected = (id) => {
    if (multiple) {
      onChange?.(selectedValues.filter((item) => String(item) !== String(id)));
      return;
    }

    onChange?.("");
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label ? (
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600">
            <Layers3 size={16} />
          </span>
          <span>
            {label}
            {required ? <span className="text-red-500"> *</span> : null}
          </span>
        </label>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        {selectedItems.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div
                key={item._id}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-500">
                  <Check size={12} />
                </span>
                <span className="max-w-[180px] truncate">{item.name}</span>

                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => removeSelected(item._id)}
                    className="rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
                  >
                    <X size={12} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="relative">
          <select
            value={multiple ? "" : value || ""}
            onChange={(e) =>
              multiple
                ? handleMultiChange(e.target.value)
                : handleSingleChange(e.target.value)
            }
            required={required && !multiple}
            disabled={disabled || isLoading}
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-11 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {isLoading
                ? "Loading collections..."
                : multiple
                ? placeholder || "Add collections"
                : placeholder}
            </option>

            {options.map((item) => {
              const isSelected = selectedValues.some(
                (selectedId) => String(selectedId) === String(item._id)
              );

              if (multiple && isSelected) return null;

              return (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-zinc-500">
          <span>
            {helperText ||
              (multiple
                ? "You can select multiple collections."
                : "Select one collection.")}
          </span>

          <span className="rounded-full bg-zinc-100 px-2 py-1 font-medium text-zinc-600">
            {multiple
              ? `${selectedItems.length} selected`
              : selectedItems.length
              ? "Selected"
              : "None"}
          </span>
        </div>
      </div>
    </div>
  );
}