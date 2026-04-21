"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  ImageIcon,
  Trash2,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminMediaStore } from "@/store/adminMediaStore";

const getId = (item = {}) =>
  String(
    item?._id ||
      item?.id ||
      item?.publicId ||
      item?.public_id ||
      item?.assetId ||
      item?.asset_id ||
      item?.url ||
      item?.secureUrl ||
      item?.secure_url ||
      ""
  );

const getName = (item = {}) =>
  item?.originalName ||
  item?.originalFilename ||
  item?.displayName ||
  item?.filename ||
  item?.publicId ||
  item?.public_id ||
  "Media";

const getSrc = (item = {}) =>
  item?.secure_url ||
  item?.secureUrl ||
  item?.url ||
  item?.assetUrl ||
  item?.src ||
  "";

const getResourceType = (item = {}) =>
  item?.resourceType || item?.resource_type || "image";

function MediaSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square overflow-hidden rounded-2xl bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  );
}

function IconActionButton({ title, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur transition ${
        danger
          ? "bg-white/95 text-red-600 hover:bg-red-50"
          : "bg-white/95 text-zinc-700 hover:bg-black hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Lightbox({ items = [], activeIndex = 0, onClose, onPrev, onNext }) {
  const active = items[activeIndex];
  if (!active) return null;

  const src = getSrc(active);
  const name = getName(active);
  const isVideo = getResourceType(active) === "video";

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 p-3 sm:p-6"
      onClick={onClose}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="relative flex h-full w-full max-w-7xl items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4 sm:top-4"
          >
            <X size={18} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={onNext}
                className="absolute right-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[24px]">
            {src ? (
              isVideo ? (
                <video
                  src={src}
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-[24px] object-contain"
                />
              ) : (
                <img
                  src={src}
                  alt={name}
                  className="max-h-full max-w-full rounded-[24px] object-contain"
                />
              )
            ) : (
              <div className="flex h-[320px] w-full max-w-xl items-center justify-center rounded-[24px] bg-white/5 text-white/70">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="absolute bottom-2 left-2 right-2 z-20 rounded-2xl bg-black/35 px-4 py-3 text-white backdrop-blur sm:bottom-4 sm:left-4 sm:right-4">
            <p className="truncate text-sm font-medium">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MediaGrid({
  items = [],
  selected = [],
  onSelect = () => {},
  loading = false,
  showActions = true,
}) {
  const selectedIds = useMemo(
    () => new Set((selected || []).map((item) => getId(item))),
    [selected]
  );

  const deleteMedia = useAdminMediaStore((state) => state.deleteMedia);
  const deleting = useAdminMediaStore((state) => state.deleting);

  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (loading) {
    return <MediaSkeleton />;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  const showPrev = () => {
    setLightboxIndex((prev) => {
      if (prev <= 0) return items.length - 1;
      return prev - 1;
    });
  };

  const showNext = () => {
    setLightboxIndex((prev) => {
      if (prev >= items.length - 1) return 0;
      return prev + 1;
    });
  };

  const handleCopy = async (e, item) => {
    e.stopPropagation();

    const src = getSrc(item);
    if (!src) {
      toast.error("No media link found");
      return;
    }

    try {
      await navigator.clipboard.writeText(src);
      toast.success("Media link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleOpenNewTab = (e, item) => {
    e.stopPropagation();

    const src = getSrc(item);
    if (!src) {
      toast.error("No media link found");
      return;
    }

    window.open(src, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();

    const publicId = item?.publicId || item?.public_id;
    const resourceType = getResourceType(item);

    if (!publicId) {
      toast.error("publicId not found");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${getName(item)}" from media library?`
    );
    if (!confirmed) return;

    await deleteMedia?.({ publicId, resourceType });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((item, index) => {
          const itemId = getId(item);
          const id = itemId || `media-${index}`;
          const src = getSrc(item);
          const name = getName(item);
          const isVideo = getResourceType(item) === "video";
          const isSelected = selectedIds.has(itemId);

          return (
            <div
              key={id}
              className={`group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 transition duration-200 ${
                isSelected
                  ? "ring-2 ring-black shadow-[0_10px_30px_rgba(0,0,0,0.10)]"
                  : "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              }`}
            >
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="absolute inset-0 z-[1]"
                aria-label={`Open ${name}`}
              >
                <span className="sr-only">Open media</span>
              </button>

              {src ? (
                isVideo ? (
                  <>
                    <video
                      src={src}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur">
                      <Video className="h-4 w-4" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={src}
                    alt={name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 18vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <ImageIcon className="h-7 w-7" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />

              {isSelected && (
                <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 py-2.5">
                <p className="truncate pr-24 text-xs font-medium text-white">
                  {name}
                </p>
              </div>

              {showActions && (
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                  <IconActionButton
                    title="Copy media link"
                    onClick={(e) => handleCopy(e, item)}
                  >
                    <Copy className="h-4 w-4" />
                  </IconActionButton>

                  <IconActionButton
                    title="Open in new tab"
                    onClick={(e) => handleOpenNewTab(e, item)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </IconActionButton>

                  <IconActionButton
                    title="Delete media"
                    onClick={(e) => handleDelete(e, item)}
                    danger
                  >
                    <Trash2
                      className={`h-4 w-4 ${deleting ? "animate-pulse" : ""}`}
                    />
                  </IconActionButton>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(item);
                }}
                className="absolute inset-0 z-[2] hidden"
              >
                Select media
              </button>
            </div>
          );
        })}
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          items={items}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
}