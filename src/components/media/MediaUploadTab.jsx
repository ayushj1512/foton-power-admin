"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Clipboard,
  Image as ImageIcon,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";

export default function MediaUploadTab({ onUploaded }) {
  const { uploadMedia, uploading } = useAdminMediaStore();

  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const addFiles = (incomingFiles) => {
    const nextFiles = Array.from(incomingFiles || []);
    if (!nextFiles.length) return;

    setFiles((prev) => {
      const merged = [...prev, ...nextFiles];
      const unique = Array.from(
        new Map(
          merged.map((file) => [
            `${file.name}-${file.size}-${file.lastModified}`,
            file,
          ])
        ).values()
      );
      return unique;
    });
  };

  useEffect(() => {
    const node = dropRef.current;
    if (!node) return;

    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      prevent(e);
      setDragActive(true);
    };

    const handleDragOver = (e) => {
      prevent(e);
      setDragActive(true);
    };

    const handleDragLeave = (e) => {
      prevent(e);
      if (e.target === node) setDragActive(false);
    };

    const handleDrop = (e) => {
      prevent(e);
      setDragActive(false);
      addFiles(e.dataTransfer?.files);
    };

    node.addEventListener("dragenter", handleDragEnter);
    node.addEventListener("dragover", handleDragOver);
    node.addEventListener("dragleave", handleDragLeave);
    node.addEventListener("drop", handleDrop);

    return () => {
      node.removeEventListener("dragenter", handleDragEnter);
      node.removeEventListener("dragover", handleDragOver);
      node.removeEventListener("dragleave", handleDragLeave);
      node.removeEventListener("drop", handleDrop);
    };
  }, []);

  useEffect(() => {
    const handlePaste = (e) => {
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

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video"),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const removeFile = (key) => {
    setFiles((prev) =>
      prev.filter(
        (file) => `${file.name}-${file.size}-${file.lastModified}` !== key
      )
    );
  };

  const clearFiles = () => setFiles([]);

  const handleUpload = async () => {
    if (!files.length || uploading) return;

    const uploaded = await uploadMedia({ files });

    if (uploaded?.length) {
      setFiles([]);
      onUploaded?.(uploaded);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div
        ref={dropRef}
        onClick={() => inputRef.current?.click()}
        className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl px-6 py-10 text-center transition-all duration-200 ${
          dragActive
            ? "bg-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full transition ${
            dragActive ? "bg-white/15" : "bg-white shadow-sm"
          }`}
        >
          <UploadCloud
            className={`h-8 w-8 ${dragActive ? "text-white" : "text-gray-600"}`}
          />
        </div>

        <h3
          className={`text-base font-semibold ${
            dragActive ? "text-white" : "text-gray-900"
          }`}
        >
          Drag & drop, paste, or click to upload
        </h3>

        <p
          className={`mt-2 max-w-md text-sm ${
            dragActive ? "text-white/75" : "text-gray-500"
          }`}
        >
          Supports image and video uploads. Paste screenshots directly here too.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
              dragActive ? "bg-white/10 text-white" : "bg-white text-gray-600"
            }`}
          >
            <Clipboard className="h-3.5 w-3.5" />
            Paste support
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
              dragActive ? "bg-white/10 text-white" : "bg-white text-gray-600"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Images
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
              dragActive ? "bg-white/10 text-white" : "bg-white text-gray-600"
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            Videos
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="flex min-h-0 flex-1 flex-col rounded-3xl bg-gray-50 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Ready to upload
              </p>
              <p className="text-xs text-gray-500">{files.length} files selected</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearFiles}
                disabled={uploading}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !files.length}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {previews.map(({ key, file, url, isVideo }) => (
                <div
                  key={key}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  {isVideo ? (
                    <>
                      <video
                        src={url}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        muted
                        playsInline
                      />
                      <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white">
                        <Video className="h-4 w-4" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={url}
                      alt={file.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(key)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:bg-black hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 py-2.5">
                    <p className="truncate text-xs font-medium text-white">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}