"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import MediaUploadTab from "./MediaUploadTab";
import MediaGalleryTab from "./MediaGalleryTab";
import { useAdminMediaStore } from "@/store/adminMediaStore";

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  multiple = false,
  resourceType = "image",
}) {
  const [tab, setTab] = useState("select");
  const { refreshMedia } = useAdminMediaStore();

  const handleClose = () => {
    setTab("select");
    onClose?.();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 p-3 sm:p-5"
      onClick={handleClose}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[90dvh] w-[calc(100vw-1rem)] max-w-7xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_120px_rgba(0,0,0,0.30)] sm:w-full sm:rounded-[28px]"
        >
          <div className="shrink-0 border-b border-gray-100 bg-white">
            <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  Media Library
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Upload, browse, and select media
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pb-4 sm:px-6">
              <div className="inline-flex max-w-full rounded-2xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab("upload")}
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${
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
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${
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

          <div className="min-h-0 flex-1 bg-[#fafafa] p-3 sm:p-5">
            <div className="flex h-full min-h-0 flex-col rounded-[24px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {tab === "upload" ? (
                  <MediaUploadTab
                    onUploaded={async () => {
                      await refreshMedia();
                      setTab("select");
                    }}
                  />
                ) : (
                  <MediaGalleryTab
                    resourceType={resourceType}
                    multiple={multiple}
                    onSelect={(media) => {
                      onSelect?.(media);
                      handleClose();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
