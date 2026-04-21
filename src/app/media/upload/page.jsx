"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CloudUpload,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import MediaUploadTab from "@/components/media/MediaUploadTab";

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

export default function MediaUploadPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-4 md:px-6 md:py-6">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="bg-gradient-to-b from-zinc-50 to-white px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4">
                <Link
                  href="/media"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                >
                  <ArrowLeft size={18} />
                </Link>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    <CloudUpload size={12} />
                    Upload Center
                  </div>

                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                    Upload Media
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    Drag, drop, paste, or browse files to upload cleanly into your
                    media library.
                  </p>
                </div>
              </div>

              <Link
                href="/media"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Sparkles size={16} />
                View Library
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={ImageIcon}
            title="Images"
            text="Upload product shots, banners, thumbnails, and content visuals."
          />
          <InfoCard
            icon={Video}
            title="Videos"
            text="Upload reels, promos, previews, and other supported video assets."
          />
          <InfoCard
            icon={Upload}
            title="Paste Support"
            text="Paste screenshots directly into the upload area for a faster workflow."
          />
        </section>

        <section className="rounded-[32px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Upload Files
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Add one or many files at once. Your uploaded assets will appear in
              the media library.
            </p>
          </div>

          <MediaUploadTab />
        </section>
      </div>
    </div>
  );
}