"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ClipboardPaste,
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useAdminMediaStore } from "@/store/adminMediaStore";

export default function MediaUploadPage() {
  const { uploadMedia, uploading } = useAdminMediaStore();

  const [files, setFiles] = useState([]);
  const [channel, setChannel] = useState("general");
  const [section, setSection] = useState("");
  const [subSection, setSubSection] = useState("");

  const previews = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type?.startsWith("video/"),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const mergeFiles = (incoming = []) => {
    setFiles((prev) => {
      const merged = [...prev, ...incoming];
      const unique = Array.from(
        new Map(
          merged.map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file])
        ).values()
      );
      return unique;
    });
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    mergeFiles(selectedFiles);
    toast.success(`${selectedFiles.length} file(s) added`);
    event.target.value = "";
  };

  const handlePaste = (event) => {
    const pastedFiles = Array.from(event.clipboardData?.files || []).filter(
      (file) => file.type?.startsWith("image/") || file.type?.startsWith("video/")
    );

    if (!pastedFiles.length) return;
    mergeFiles(pastedFiles);
    toast.success(`${pastedFiles.length} pasted file(s) added`);
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearFiles = () => {
    setFiles([]);
    toast.success("Selection cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please add files first");
      return;
    }

    const uploaded = await uploadMedia({
      files,
      channel,
      section,
      subSection,
    });

    if (uploaded?.length) {
      setFiles([]);
      setSection("");
      setSubSection("");
      toast.success("Upload completed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Upload Media</h1>
            <p className="mt-1 text-sm text-black/60">
              Browse, paste or upload images/videos to your library.
            </p>
          </div>

          <Link
            href="/media"
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div
              className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/15 bg-[#fafafa] p-6 text-center"
              onPaste={handlePaste}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0f172a] text-white">
                <UploadCloud className="h-7 w-7" />
              </div>

              <h2 className="text-lg font-semibold text-black">Add files here</h2>
              <p className="mt-2 max-w-md text-sm text-black/55">
                You can browse files or directly paste screenshots/images/videos here.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <label
                  htmlFor="media-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <UploadCloud className="h-4 w-4" />
                  Browse Files
                </label>

                <button
                  type="button"
                  onClick={() => toast("Ctrl/Cmd + V se paste bhi kar sakte ho")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/5"
                >
                  <ClipboardPaste className="h-4 w-4" />
                  Paste Supported
                </button>
              </div>

              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFiles}
                className="hidden"
              />
            </div>

            {previews.length > 0 ? (
              <>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-black">
                    Selected Files ({previews.length})
                  </p>

                  <button
                    type="button"
                    onClick={clearFiles}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previews.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="overflow-hidden rounded-2xl border border-black/10 bg-[#fafafa]"
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        {item.isVideo ? (
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.file.name}
                            className="h-full w-full object-cover"
                          />
                        )}

                        <div className="absolute left-2 top-2 rounded-full bg-black/70 p-1 text-white">
                          {item.isVideo ? (
                            <Video className="h-3.5 w-3.5" />
                          ) : (
                            <ImagePlus className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-black shadow-sm transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-2">
                        <p className="truncate text-xs font-medium text-black">
                          {item.file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-black">Upload Details</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
                  Channel
                </label>
                <input
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="general"
                  className="h-11 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#0f172a]/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
                  Section
                </label>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="products / banners / blog"
                  className="h-11 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#0f172a]/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
                  Sub Section
                </label>
                <input
                  value={subSection}
                  onChange={(e) => setSubSection(e.target.value)}
                  placeholder="summer-drop / homepage / category-name"
                  className="h-11 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-sm outline-none transition focus:border-[#14532d]/30"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#14532d] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    Upload Now
                  </>
                )}
              </button>

              <p className="rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs leading-5 text-black/60">
                Tip: screenshot copy karke direct yahan paste bhi kar sakte ho.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}