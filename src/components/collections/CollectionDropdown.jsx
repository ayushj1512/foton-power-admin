"use client";

import { useEffect, useMemo } from "react";
import { Check, ChevronDown, Layers3, Loader2, X } from "lucide-react";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

const toArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

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
    const selectedSet = new Set(selectedValues.map(String));
    return options.filter((item) => selectedSet.has(String(item?._id)));
  }, [options, selectedValues]);

  const handleSingleChange = (nextValue) => {
    onChange?.(nextValue);
  };

  const handleMultiChange = (nextValue) => {
    if (!nextValue) return;

    const exists = selectedValues.some(
      (item) => String(item) === String(nextValue)
    );
    if (exists) return;

    onChange?.([...selectedValues, nextValue]);
  };

  const removeSelected = (id) => {
    if (multiple) {
      onChange?.(
        selectedValues.filter((item) => String(item) !== String(id))
      );
      return;
    }

    onChange?.("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label ? (
        <label className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
              <Layers3 size={15} />
            </span>
            <span>{label}</span>
          </span>

          {required ? (
            <span className="text-xs font-medium text-red-500">Required</span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
              Optional
            </span>
          )}
        </label>
      ) : null}

      <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200/70">
        {selectedItems.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div
                key={item._id}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-zinc-500">
                  <Check size={11} />
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
            className="w-full appearance-none rounded-xl bg-zinc-50 px-4 py-3 pr-11 text-sm text-zinc-900 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                : required
                ? "Select one collection."
                : "You can leave this empty.")}
          </span>

          <span className="font-medium text-zinc-400">
            {multiple
              ? `${selectedItems.length} selected`
              : selectedItems.length
              ? "Selected"
              : "Not selected"}
          </span>
        </div>
      </div>
    </div>
  );
}