"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  PlusCircle,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import CollectionForm from "@/components/collections/CollectionForm";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

export default function NewCollectionPage() {
  const router = useRouter();

  const { createCollection, isSubmitting, error, success, clearMessages } =
    useAdminCollectionStore();

  const handleSubmit = async (payload) => {
    clearMessages?.();

    const res = await createCollection(payload);

    if (res?.success && res?.collection?._id) {
      router.push(`/collections/${res.collection._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="bg-gradient-to-b from-zinc-50 to-white px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4">
                <Link
                  href="/collections"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:text-black"
                >
                  <ChevronLeft size={18} />
                </Link>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    <PlusCircle size={12} />
                    Create New Collection
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                      Create Collection
                    </h1>
                    <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 sm:inline-flex">
                      Premium Setup
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    Create a polished collection with clean metadata, visibility
                    controls, media, SEO, and product mapping.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[320px]">
                <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <Sparkles size={13} />
                    Workflow
                  </div>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    Details → Media → SEO
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="text-xs font-medium text-zinc-500">
                    Publishing
                  </div>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    Draft-friendly control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="flex items-start gap-3 rounded-[24px] bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.08)]">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80">
              <AlertCircle size={16} />
            </div>
            <div>
              <p className="font-semibold">Unable to create collection</p>
              <p className="mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        ) : null}

        {success ? (
          <div className="flex items-start gap-3 rounded-[24px] bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 shadow-[0_8px_24px_rgba(16,185,129,0.08)]">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="font-semibold">Collection created successfully</p>
              <p className="mt-0.5 text-emerald-600">{success}</p>
            </div>
          </div>
        ) : null}

        <section className="rounded-[32px] bg-transparent">
          <CollectionForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Collection"
          />
        </section>
      </div>
    </div>
  );
}
