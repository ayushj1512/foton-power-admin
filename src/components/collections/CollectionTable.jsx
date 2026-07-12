"use client";

import Link from "next/link";
import {
  Edit3,
  Home,
  Loader2,
  Star,
  Trash2,
  Layers3,
  ChevronRight,
} from "lucide-react";

const getPillClass = (active, kind = "default") => {
  if (kind === "status") {
    return active
      ? "bg-emerald-50 text-emerald-700"
      : "bg-zinc-100 text-zinc-500";
  }

  if (kind === "featured") {
    return active
      ? "bg-amber-50 text-amber-700"
      : "bg-zinc-100 text-zinc-500";
  }

  if (kind === "homepage") {
    return active ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-500";
  }

  return "bg-zinc-100 text-zinc-500";
};

export default function CollectionTable({
  collections = [],
  loading = false,
  actionLoadingId = "",
  onToggleStatus,
  onToggleFeatured,
  onToggleHomepage,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)] sm:rounded-[30px] sm:p-12">
        <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
          <Loader2 size={18} className="animate-spin" />
          Loading collections...
        </div>
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div className="rounded-[24px] bg-white p-6 text-center shadow-[0_10px_35px_rgba(0,0,0,0.05)] sm:rounded-[30px] sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
          <Layers3 size={20} />
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900">
          No collections found
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          Create your first collection to start organizing products.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50/80">
            <tr className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-5 py-4 font-medium">Collection</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Flags</th>
              <th className="px-5 py-4 font-medium">Products</th>
              <th className="px-5 py-4 font-medium">Updated</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {collections.map((item) => {
              const busy = actionLoadingId === item._id;

              return (
                <tr
                  key={item._id}
                  className="border-t border-zinc-100 transition hover:bg-zinc-50/50"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-zinc-500">
                            CL
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-900">
                          {item?.name}
                        </div>

                        <div className="mt-1 truncate text-xs text-zinc-500">
                          /{item?.slug || "-"}
                        </div>

                        {item?.description ? (
                          <p className="mt-2 line-clamp-2 max-w-[360px] text-xs leading-5 text-zinc-500">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(item)}
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90 ${getPillClass(
                        item?.isActive,
                        "status"
                      )}`}
                    >
                      {item?.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured?.(item)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90 ${getPillClass(
                          item?.isFeatured,
                          "featured"
                        )}`}
                      >
                        <Star size={12} />
                        Featured
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleHomepage?.(item)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90 ${getPillClass(
                          item?.showOnHomepage,
                          "homepage"
                        )}`}
                      >
                        <Home size={12} />
                        Homepage
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-sm font-semibold text-zinc-900">
                      {Array.isArray(item?.productCodes)
                        ? item.productCodes.length
                        : 0}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Mapped product codes
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-sm text-zinc-900">
                      {item?.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "-"}
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/collections/${item._id}`}
                        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-zinc-100 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
                      >
                        <Edit3 size={15} />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item)}
                        disabled={busy}
                        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {busy ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </button>

                      <Link
                        href={`/collections/${item._id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
