"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Layers3,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import CollectionStats from "@/components/collections/CollectionStats";
import CollectionTable from "@/components/collections/CollectionTable";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

export default function CollectionsPage() {
  const {
    collections,
    isLoading,
    isSubmitting,
    fetchCollections,
    deleteCollection,
    toggleCollectionStatus,
    toggleCollectionFeatured,
    toggleCollectionHomepage,
    error,
    success,
  } = useAdminCollectionStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState("");

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (collections || []).filter((item) => {
      const matchesSearch =
        !q ||
        item?.name?.toLowerCase().includes(q) ||
        item?.slug?.toLowerCase().includes(q) ||
        item?.description?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filter === "active") return item?.isActive;
      if (filter === "inactive") return !item?.isActive;
      if (filter === "featured") return item?.isFeatured;
      if (filter === "homepage") return item?.showOnHomepage;

      return true;
    });
  }, [collections, search, filter]);

  const withAction = async (id, action) => {
    try {
      setActionLoadingId(id);
      await action();
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
              <Layers3 size={12} />
              Collection Management
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-zinc-950">Collections</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Create, edit, and manage homepage-ready product collections.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/collections/analytics"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <BarChart3 size={16} />
              Analytics
            </Link>

            <button
              type="button"
              onClick={() => fetchCollections()}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              href="/collections/new"
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Plus size={16} />
              New Collection
            </Link>
          </div>
        </div>
      </div>

      <CollectionStats collections={collections || []} />

      <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections..."
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-11 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
          >
            <option value="all">All Collections</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
            <option value="homepage">Homepage</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <CollectionTable
        collections={filtered}
        loading={isLoading}
        actionLoadingId={actionLoadingId || (isSubmitting ? "__busy__" : "")}
        onToggleStatus={(item) =>
          withAction(item._id, () => toggleCollectionStatus(item._id))
        }
        onToggleFeatured={(item) =>
          withAction(item._id, () => toggleCollectionFeatured(item._id))
        }
        onToggleHomepage={(item) =>
          withAction(item._id, () => toggleCollectionHomepage(item._id))
        }
        onDelete={(item) =>
          withAction(item._id, async () => {
            const ok = window.confirm(`Delete "${item.name}"?`);
            if (!ok) return;
            await deleteCollection(item._id);
          })
        }
      />
    </div>
  );
}