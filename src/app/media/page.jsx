"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Image as ImageIcon,
  Upload,
  Video,
  Library,
  Sparkles,
} from "lucide-react";
import MediaGalleryTab from "@/components/media/MediaGalleryTab";
import { useAdminMediaStore } from "@/store/adminMediaStore";

function StatCard({ icon: Icon, label, value, hint, dark = false }) {
  return (
    <div
      className={`rounded-[28px] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] ${
        dark ? "bg-black text-white" : "bg-white text-zinc-900"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
              dark ? "text-white/60" : "text-zinc-500"
            }`}
          >
            {label}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">{value}</h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            dark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className={`text-sm ${dark ? "text-white/75" : "text-zinc-500"}`}>
        {hint}
      </p>
    </div>
  );
}

export default function MediaPage() {
  const items = useAdminMediaStore((state) => state.items);

  const stats = useMemo(() => {
    const total = Array.isArray(items) ? items.length : 0;

    const images = (items || []).filter((item) => {
      const type = item?.resourceType || item?.resource_type || "image";
      return type === "image";
    }).length;

    const videos = (items || []).filter((item) => {
      const type = item?.resourceType || item?.resource_type || "image";
      return type === "video";
    }).length;

    return { total, images, videos };
  }, [items]);

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-4 md:px-6 md:py-6">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="bg-gradient-to-b from-zinc-50 to-white px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  <Library size={12} />
                  Media Library
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                  Manage Media
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Browse all uploaded media, review image and video assets, and
                  manage your library from one clean workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/media/upload"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <Upload size={16} />
                  Upload Media
                </Link>

                <Link
                  href="/media"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
                >
                  <Sparkles size={16} />
                  Refresh View
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={Library}
            label="Total Loaded"
            value={stats.total}
            hint="Currently visible media items in library"
            dark
          />
          <StatCard
            icon={ImageIcon}
            label="Images"
            value={stats.images}
            hint="Image assets available in current view"
          />
          <StatCard
            icon={Video}
            label="Videos"
            value={stats.videos}
            hint="Video assets available in current view"
          />
        </section>

        <section className="rounded-[32px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:p-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                Library
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Scroll to load more media items automatically.
              </p>
            </div>

            <Link
              href="/media/upload"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition hover:text-black"
            >
              Go to upload
              <ArrowRight size={15} />
            </Link>
          </div>

          <MediaGalleryTab
            resourceType="image"
            multiple={false}
            onSelect={() => {}}
          />
        </section>
      </div>
    </div>
  );
}