"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Check, Video } from "lucide-react";

export default function MediaGrid({
  items = [],
  selected = [],
  onSelect = () => {},
  loading = false,
}) {
  const selectedIds = useMemo(
    () => new Set((selected || []).map((item) => String(item?._id || item?.publicId))),
    [selected]
  );

  if (loading) {
    return <p className="text-sm text-gray-500">Loading media...</p>;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-gray-500">No media found</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {items.map((m) => {
        const id = String(m?._id || m?.publicId || "");
        const isSelected = selectedIds.has(id);
        const isVideo = m?.resourceType === "video";

        return (
          <div
            key={id}
            onClick={() => onSelect?.(m)}
            className={`group relative cursor-pointer overflow-hidden rounded-xl bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md ${
              isSelected ? "scale-[1.02] ring-2 ring-black shadow-md" : ""
            }`}
          >
            {isVideo ? (
              <div className="relative aspect-square w-full">
                <video
                  src={m?.secureUrl || m?.url}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  muted
                />
                <div className="absolute left-2 top-2 rounded-full bg-black/70 p-1 text-white">
                  <Video className="h-3.5 w-3.5" />
                </div>
              </div>
            ) : (
              <Image
                src={m?.secureUrl || m?.url}
                alt={m?.originalName || m?.originalFilename || "Media"}
                width={300}
                height={300}
                className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <div
              className={`absolute inset-0 transition-all duration-200 ${
                isSelected ? "bg-black/10" : "bg-black/0 group-hover:bg-black/10"
              }`}
            />

            {isSelected && (
              <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow">
                <Check className="h-4 w-4" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
              {m?.originalName || m?.originalFilename || "Media"}
            </div>
          </div>
        );
      })}
    </div>
  );
}