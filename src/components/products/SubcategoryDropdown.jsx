"use client";

import { Layers2 } from "lucide-react";

export default function SubcategoryDropdown({ product }) {
  const subcategory =
    product?.subcategoryName ||
    product?.subcategoryDetails?.name ||
    product?.subcategory?.name ||
    "";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-2">
        <Layers2 className="h-4 w-4 text-gray-900" />
        <h2 className="text-base font-semibold text-gray-950">Subcategory</h2>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-950">
          {subcategory || "No subcategory"}
        </p>
      </div>
    </div>
  );
}