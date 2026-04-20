"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Video } from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";

export default function MediaUploadTab({ folder = "miray/media" }) {
  const { uploadMedia, uploading } = useAdminMediaStore();

  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const [files, setFiles] = useState([]);

  const previews = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video"),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles || []);
    if (!arr.length) return;

    setFiles((prev) => [...prev, ...arr]);
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onDrop = (e) => {
      prevent(e);
      addFiles(e.dataTransfer?.files);
    };

    el.addEventListener("dragenter", prevent);
    el.addEventListener("dragover", prevent);
    el.addEventListener("drop", onDrop);

    return () => {
      el.removeEventListener("dragenter", prevent);
      el.removeEventListener("dragover", prevent);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items || [];
      const pastedFiles = [];

      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length) addFiles(pastedFiles);
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const uploaded = await uploadMedia({
      files,
      folder,
    });

    if (uploaded?.length) {
      setFiles([]);
    }
  };

  return (
    <div className="space-y-6">
      <div
        ref={dropRef}
        onClick={() => inputRef.current?.click()}
        className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-gray-50 p-10 text-center shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow">
          <UploadCloud className="h-7 w-7 text-gray-500 transition group-hover:text-black" />
        </div>

        <p className="text-sm font-medium text-gray-700">
          Drag & drop, paste, or click to upload
        </p>

        <p className="text-xs text-gray-400">Supports images & videos</p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-800">
              Ready to upload <span className="text-gray-500">({previews.length})</span>
            </p>

            <button
              type="button"
              disabled={uploading}
              onClick={handleUpload}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {previews.map((item, i) => (
              <div
                key={`${item.file.name}-${i}`}
                className="group relative overflow-hidden rounded-xl bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {item.isVideo ? (
                  <div className="relative aspect-square h-full w-full">
                    <video
                      src={item.url}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      muted
                    />
                    <div className="absolute left-2 top-2 rounded-full bg-black/70 p-1 text-white">
                      <Video className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.file.name || "Preview"}
                    width={200}
                    height={200}
                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:bg-black hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}