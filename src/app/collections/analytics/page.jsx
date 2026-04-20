"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import CollectionStats from "@/components/collections/CollectionStats";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

export default function CollectionAnalyticsPage() {
  const { collections, isLoading, fetchCollections } = useAdminCollectionStore();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const topCollections = useMemo(() => {
    return [...(collections || [])]
      .sort(
        (a, b) =>
          (b?.productCodes?.length || 0) - (a?.productCodes?.length || 0)
      )
      .slice(0, 8);
  }, [collections]);

  const avgProducts = useMemo(() => {
    if (!collections?.length) return 0;
    const total = collections.reduce(
      (sum, item) => sum + (item?.productCodes?.length || 0),
      0
    );
    return Math.round((total / collections.length) * 10) / 10;
  }, [collections]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/collections"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                <BarChart3 size={12} />
                Collection Insights
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
                Collection Analytics
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Quick visibility into collection coverage and mapping health.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CollectionStats collections={collections || []} />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-900">Overview</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Avg. Products / Collection
              </div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">
                {avgProducts}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Loading State
              </div>
              <div className="mt-2 text-lg font-semibold text-zinc-950">
                {isLoading ? "Refreshing data..." : "Fresh and ready"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Top Collections by Product Codes
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Collections with the highest mapped product code count.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {topCollections.length ? (
              topCollections.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-zinc-900">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">/{item.slug}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-zinc-950">
                      {item?.productCodes?.length || 0}
                    </div>
                    <div className="text-xs text-zinc-500">codes</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
                No analytics available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}