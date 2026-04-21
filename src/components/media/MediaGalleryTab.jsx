"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";
import MediaGrid from "./MediaGrid";

export default function MediaGalleryTab({
  resourceType = "image",
  onSelect,
  multiple = false,
  showActions = true,
}) {
  const {
    items = [],
    fetchMedia,
    resetMediaState,
    loadMoreMedia,
    loading,
    loadingMore,
    hasMore,
    error,
  } = useAdminMediaStore();

  const [selected, setSelected] = useState([]);
  const sentinelRef = useRef(null);
  const fetchingMoreRef = useRef(false);

  const getId = useCallback(
    (media) =>
      String(
        media?._id ||
          media?.id ||
          media?.publicId ||
          media?.public_id ||
          media?.url ||
          media?.secureUrl ||
          media?.secure_url ||
          ""
      ),
    []
  );

  useEffect(() => {
    setSelected([]);

    if (typeof resetMediaState === "function") {
      resetMediaState();
    }

    if (typeof fetchMedia === "function") {
      fetchMedia({
        resourceType,
        limit: 24,
        loadMore: false,
      });
    }

    return () => {
      if (typeof resetMediaState === "function") {
        resetMediaState();
      }
    };
  }, [resourceType, fetchMedia, resetMediaState]);

  const toggleSelect = useCallback(
    (media) => {
      if (!media) return;

      if (!multiple) {
        onSelect?.(media);
        return;
      }

      setSelected((prev) => {
        const id = getId(media);
        const exists = prev.some((item) => getId(item) === id);

        if (exists) {
          return prev.filter((item) => getId(item) !== id);
        }

        return [...prev, media];
      });
    },
    [getId, multiple, onSelect]
  );

  const selectedCount = useMemo(() => selected.length, [selected]);

  const handleLoadMore = useCallback(async () => {
    if (fetchingMoreRef.current) return;
    if (loading || loadingMore || !hasMore) return;
    if (typeof loadMoreMedia !== "function") return;

    fetchingMoreRef.current = true;

    try {
      await loadMoreMedia();
    } finally {
      fetchingMoreRef.current = false;
    }
  }, [loadMoreMedia, loading, loadingMore, hasMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "800px",
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {multiple && selectedCount > 0 && (
        <div className="sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-black" />
              <span>{selectedCount} selected</span>
            </div>

            <button
              type="button"
              onClick={() => onSelect?.(selected)}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Use Selected
            </button>
          </div>
        </div>
      )}

      {!!error && items.length === 0 && !loading && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="min-h-0 flex-1">
        <MediaGrid
          items={items}
          selected={selected}
          onSelect={toggleSelect}
          loading={loading && items.length === 0}
          showActions={showActions}
        />
      </div>

      {!loading && items.length === 0 && !error && (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl bg-gray-50 px-6 text-center">
          <div>
            <p className="text-sm font-medium text-gray-700">No media found</p>
            <p className="mt-1 text-xs text-gray-400">
              Upload new files or try a different media type.
            </p>
          </div>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-8 shrink-0" />}

      {(loadingMore || (hasMore && items.length > 0)) && (
        <div className="flex items-center justify-center py-1 text-sm text-gray-500">
          {loadingMore ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading more</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Scroll to load more</span>
          )}
        </div>
      )}
    </div>
  );
}