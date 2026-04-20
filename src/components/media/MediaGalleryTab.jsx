"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";
import MediaGrid from "./MediaGrid";

export default function MediaGalleryTab({
  folder = "miray/media",
  resourceType = "image",
  onSelect,
  multiple = false,
}) {
  const {
    items,
    fetchMedia,
    resetMedia,
    loading,
    hasMore,
  } = useAdminMediaStore();

  const [selected, setSelected] = useState([]);
  const sentinelRef = useRef(null);
  const fetchingMoreRef = useRef(false);

  useEffect(() => {
    resetMedia();
    fetchMedia({
      folder,
      resourceType,
      limit: 24,
      append: false,
    });

    return () => resetMedia();
  }, [folder, resourceType, fetchMedia, resetMedia]);

  const toggleSelect = useCallback(
    (media) => {
      if (!media) return;

      if (!multiple) {
        onSelect?.(media);
        return;
      }

      setSelected((prev) => {
        const id = String(media?._id || media?.publicId || "");
        const exists = prev.some((item) => String(item?._id || item?.publicId) === id);

        if (exists) {
          return prev.filter((item) => String(item?._id || item?.publicId) !== id);
        }

        return [...prev, media];
      });
    },
    [multiple, onSelect]
  );

  const loadMore = useCallback(async () => {
    if (fetchingMoreRef.current) return;
    if (loading || !hasMore) return;

    fetchingMoreRef.current = true;

    try {
      await fetchMedia({
        folder,
        resourceType,
        limit: 24,
        append: true,
      });
    } finally {
      fetchingMoreRef.current = false;
    }
  }, [fetchMedia, folder, resourceType, loading, hasMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "700px",
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="space-y-5">
      {multiple && selected.length > 0 && (
        <div className="sticky top-0 z-10">
          <div className="flex items-center justify-end rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-200/60">
            <button
              type="button"
              onClick={() => onSelect?.(selected)}
              className="rounded-2xl bg-black px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              Select {selected.length} item{selected.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}

      <MediaGrid
        items={items}
        selected={selected}
        onSelect={toggleSelect}
        loading={loading && items.length === 0}
      />

      <div ref={sentinelRef} className="h-10" />

      {(loading && items.length > 0) || hasMore ? (
        <div className="flex items-center justify-center py-2 text-sm text-gray-500">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-xs text-gray-400">Scroll to load more</span>
          )}
        </div>
      ) : null}
    </div>
  );
}