"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ImagePlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import MediaPickerModal from "@/components/media/MediaPickerModal";

const getUrl = (m) => m?.secureUrl || m?.url || "";
const getPublicId = (m) => m?.publicId || "";
const getType = (m) => m?.resourceType || m?.type || "image";

const normalizeMedia = (item) => ({
  url: getUrl(item),
  secureUrl: getUrl(item),
  publicId: getPublicId(item),
  resourceType: getType(item),
  alt: item?.alt || item?.originalName || "",
});

export default function ProductMediaManager({
  value = [],
  onChange,
  folder = "foton/products",
}) {
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const media = Array.isArray(value) ? value.map(normalizeMedia) : [];

  const updateMedia = (next) => {
    onChange?.(next.map(normalizeMedia));
  };

  const handleSelect = (selected) => {
    const picked = Array.isArray(selected) ? selected : [selected];

    const existingPublicIds = new Set(
      media.map((m) => m.publicId).filter(Boolean)
    );

    const fresh = picked
      .map(normalizeMedia)
      .filter((m) => m.url)
      .filter((m) => !m.publicId || !existingPublicIds.has(m.publicId));

    updateMedia([...media, ...fresh]);
    setOpen(false);
  };

  const removeMedia = (index) => {
    updateMedia(media.filter((_, i) => i !== index));
  };

  const moveMedia = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= media.length) return;

    const next = [...media];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    updateMedia(next);
  };

  const updateAlt = (index, alt) => {
    const next = [...media];
    next[index] = { ...next[index], alt };
    updateMedia(next);
  };

  const reorderMedia = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const next = [...media];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    updateMedia(next);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    if (dragIndex === null) return;

    reorderMedia(dragIndex, index);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <section className="lg:col-span-2 rounded-3xl bg-white p-4 ring-1 ring-gray-100">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-black">Product Photos</h2>
          <p className="text-xs text-black/50">
            Add, remove and reorder product media.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white"
        >
          <ImagePlus className="h-4 w-4" />
          Add Photos
        </button>
      </div>

      {media.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {media.map((item, index) => {
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== index;

            return (
              <div
                key={`${item.publicId || item.url}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-black/5 transition ${
                  isDragging ? "scale-[0.98] opacity-50" : ""
                } ${isOver ? "ring-2 ring-black/30" : ""}`}
              >
                <div className="relative aspect-[4/5] bg-gray-100">
                  {item.resourceType === "video" ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      controls
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.alt || "Product media"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}

                  <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-black shadow-sm">
                    #{index + 1}
                  </div>

                  <div className="absolute right-2 top-2 cursor-grab rounded-full bg-white/90 p-1.5 text-black/50 shadow-sm active:cursor-grabbing">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <input
                    value={item.alt}
                    onChange={(e) => updateAlt(index, e.target.value)}
                    placeholder="Alt text"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-black/30"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-black/40">
                      Drag to reorder
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveMedia(index, -1)}
                        disabled={index === 0}
                        className="rounded-lg p-2 text-black/60 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveMedia(index, 1)}
                        disabled={index === media.length - 1}
                        className="rounded-lg p-2 text-black/60 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-gray-50 text-center"
        >
          <ImagePlus className="mb-2 h-6 w-6 text-black/40" />
          <span className="text-sm font-medium text-black">
            Add product photos
          </span>
          <span className="mt-1 text-xs text-black/45">
            Select from media library or upload new files.
          </span>
        </button>
      )}

      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
        multiple
        folder={folder}
        resourceType="image"
      />
    </section>
  );
}