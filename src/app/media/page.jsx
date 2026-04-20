"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Copy,
  ExternalLink,
  FolderOpen,
  ImageIcon,
  Layers3,
  Loader2,
  MoreHorizontal,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";

const getMediaUrl = (item) => item?.secureUrl || item?.url || item?.src || "";

const getFileName = (item) =>
  item?.originalFilename ||
  item?.originalName ||
  item?.displayName ||
  item?.publicId ||
  "Media";

export default function MediaPage() {
  const {
    items,
    loading,
    loadingMore,
    deleting,
    error,
    hasMore,
    fetchMedia,
    loadMoreMedia,
    deleteMedia,
  } = useAdminMediaStore();

  const [resourceType, setResourceType] = useState("image");
  const [folder, setFolder] = useState("");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    fetchMedia({
      folder,
      resourceType,
      limit: 42,
      loadMore: false,
    });
  }, [fetchMedia, folder, resourceType]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreMedia();
        }
      },
      {
        rootMargin: "300px 0px",
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMoreMedia]);

  const totalCount = useMemo(() => items?.length || 0, [items]);

  const handleCopyUrl = async (item) => {
    const url = getMediaUrl(item);
    if (!url) return toast.error("URL not found");

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async (item) => {
    const ok = window.confirm(`Delete "${getFileName(item)}"?`);
    if (!ok) return;

    await deleteMedia({
      publicId: item?.publicId,
      resourceType: item?.resourceType || resourceType,
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[260px_minmax(0,1fr)_160px]">
                <div className="border border-black/10 bg-[#fafbfc] p-3">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Type
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setResourceType("image")}
                      className={`inline-flex h-11 items-center justify-center gap-2 border text-sm font-medium transition ${
                        resourceType === "image"
                          ? "border-[#0f172a] bg-[#0f172a] text-white"
                          : "border-black/10 bg-white text-black hover:bg-black/[0.02]"
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Images
                    </button>

                    <button
                      type="button"
                      onClick={() => setResourceType("video")}
                      className={`inline-flex h-11 items-center justify-center gap-2 border text-sm font-medium transition ${
                        resourceType === "video"
                          ? "border-[#0f172a] bg-[#0f172a] text-white"
                          : "border-black/10 bg-white text-black hover:bg-black/[0.02]"
                      }`}
                    >
                      <Video className="h-4 w-4" />
                      Videos
                    </button>
                  </div>
                </div>

                <div className="border border-black/10 bg-[#fafbfc] p-3">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Folder Prefix
                  </div>

                  <div className="flex h-11 items-center gap-2 border border-black/10 bg-white px-3">
                    <FolderOpen className="h-4 w-4 shrink-0 text-black/45" />
                    <input
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      placeholder="miray/products or leave empty"
                      className="h-full w-full bg-transparent text-sm text-black outline-none placeholder:text-black/35"
                    />
                  </div>
                </div>

                <div className="border border-black/10 bg-[#fafbfc] p-3">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Items
                  </div>

                  <div className="flex h-11 items-center gap-2 border border-black/10 bg-white px-4 text-sm font-semibold text-black">
                    <Layers3 className="h-4 w-4 text-black/55" />
                    {totalCount}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/media/upload"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-[#0f172a] bg-[#0f172a] px-4 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Upload className="h-4 w-4" />
              Upload Media
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="inline-flex items-center gap-2 border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-black/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading media...
              </div>
            </div>
          ) : items?.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {items.map((item, index) => {
                  const url = getMediaUrl(item);
                  const isVideo =
                    item?.resourceType === "video" ||
                    item?.format === "mp4" ||
                    item?.resource_type === "video";

                  return (
                    <div
                      key={item.publicId || `${item?.url}-${index}`}
                      className="group overflow-hidden border border-black/10 bg-white transition hover:shadow-md"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#eef1f5]">
                        {isVideo ? (
                          <video
                            src={url}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={getFileName(item)}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />

                        <div className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {isVideo ? "Video" : "Image"}
                        </div>

                        <button
                          type="button"
                          title="More"
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center border border-black/10 bg-white/95 text-black/65 shadow-sm transition hover:bg-white hover:text-black"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-2 right-2 flex items-center gap-1 border border-black/10 bg-white/96 p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(item)}
                            title="Copy URL"
                            className="inline-flex h-8 w-8 items-center justify-center text-black/70 transition hover:bg-black hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            title="Open"
                            className="inline-flex h-8 w-8 items-center justify-center text-black/70 transition hover:bg-black hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deleting}
                            title="Delete"
                            className="inline-flex h-8 w-8 items-center justify-center text-black/70 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex min-h-[72px] flex-col justify-center border-t border-black/8 p-3">
                        <p className="truncate text-sm font-semibold text-black">
                          {getFileName(item)}
                        </p>
                        <p className="mt-1 truncate text-xs text-black/45">
                          {item?.publicId}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore ? (
                  <div className="inline-flex items-center gap-2 border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-black/60">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more...
                  </div>
                ) : hasMore ? (
                  <span className="text-xs font-medium text-black/35">
                    Scroll for more
                  </span>
                ) : (
                  <span className="text-xs font-medium text-black/35">
                    No more media
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border border-black/10 bg-black/[0.03]">
                  <ImageIcon className="h-6 w-6 text-black/35" />
                </div>
                <p className="text-sm font-medium text-black/55">No media found</p>
                <p className="mt-1 text-xs text-black/35">
                  Try changing folder prefix or resource type
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}