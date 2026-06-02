"use client";

export default function CategoryDropdown({ product }) {
  const category = product?.categoryName || product?.category?.name || "No category";
  const subcategory =
    product?.subcategoryName || product?.subcategoryDetails?.name || "";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Category
      </p>

      <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-950">{category}</p>
        {subcategory ? (
          <p className="mt-1 text-xs text-gray-500">{subcategory}</p>
        ) : null}
      </div>
    </div>
  );
}