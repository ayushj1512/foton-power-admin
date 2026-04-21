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
    <div className="space-y-10 bg-[#fafafa] px-4 py-6 md:px-8">

      {/* HEADER */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Layers3 size={14} />
            Collection Management
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Collections
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage and organize your collections cleanly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/collections/analytics"
            className="h-10 px-4 text-sm text-zinc-700 hover:text-black transition"
          >
            Analytics
          </Link>

          <button
            onClick={fetchCollections}
            className="h-10 px-4 text-sm text-zinc-700 hover:text-black transition"
          >
            Refresh
          </button>

          <Link
            href="/collections/new"
            className="h-10 px-4 text-sm font-medium text-white bg-black rounded-xl"
          >
            New
          </Link>
        </div>
      </div>

      {/* STATS */}
      <CollectionStats collections={collections || []} />

      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections..."
            className="w-full bg-white px-10 py-2.5 text-sm outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "active", "inactive", "featured", "homepage"].map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs transition ${
                  active
                    ? "text-black font-medium"
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {success && (
        <div className="text-sm text-green-600">{success}</div>
      )}

      {/* TABLE */}
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