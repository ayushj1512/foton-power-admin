"use client";

import { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import MediaUploadTab from "./MediaUploadTab";
import MediaGalleryTab from "./MediaGalleryTab";

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  multiple = false,
  folder = "miray/media",
  resourceType = "image",
}) {
  const [tab, setTab] = useState("select");

  useEffect(() => {
    if (open) setTab("select");
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
              <p className="text-xs text-gray-500">Upload or select media</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="px-5 pb-4 sm:px-6">
            <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setTab("upload")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === "upload"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>

              <button
                type="button"
                onClick={() => setTab("select")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === "select"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Library
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-5">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {tab === "upload" ? (
              <MediaUploadTab folder={folder} />
            ) : (
              <MediaGalleryTab
                folder={folder}
                resourceType={resourceType}
                multiple={multiple}
                onSelect={(media) => {
                  onSelect?.(media);
                  onClose?.();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}