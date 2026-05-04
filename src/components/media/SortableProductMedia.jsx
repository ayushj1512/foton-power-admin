"use client";

import { useState } from "react";
import { GripVertical, Trash2, Video } from "lucide-react";

export default function SortableProductMedia({
  media = [],
  onReorder,
  onRemove,
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    if (fromIndex == null || toIndex == null) return;

    const next = [...media];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    onReorder?.(next);
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    const fromData = e.dataTransfer.getData("text/plain");
    const fromIndex = fromData ? Number(fromData) : dragIndex;

    moveItem(fromIndex, index);

    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  if (!Array.isArray(media) || media.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {media.map((item, index) => {
        const src = item?.secureUrl || item?.url;
        const isVideo = item?.resourceType === "video";
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== index;

        return (
          <div
            key={`${item?.publicId || item?._id || src || "media"}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition ${
              isDragging ? "scale-[0.98] opacity-50" : ""
            } ${isOver ? "ring-2 ring-black" : ""}`}
          >
            <div className="relative h-36 w-full overflow-hidden bg-zinc-100">
              {isVideo ? (
                <>
                  <video
                    src={src}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-black/75 p-2 text-white">
                    <Video size={14} />
                  </div>
                </>
              ) : (
                <img
                  src={src}
                  alt={item?.originalName || `media-${index}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              )}

              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                <GripVertical size={12} />
                {index + 1}
              </div>

              <button
                type="button"
                onClick={() => onRemove?.(index)}
                className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="cursor-grab bg-white px-3 py-2 active:cursor-grabbing">
              <p className="truncate text-xs font-medium text-zinc-700">
                Drag to reorder
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}