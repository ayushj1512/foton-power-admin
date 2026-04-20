"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, PencilLine } from "lucide-react";
import Link from "next/link";
import CollectionForm from "@/components/collections/CollectionForm";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const {
    selectedCollection,
    fetchCollectionByIdOrSlug,
    updateCollection,
    isLoading,
    isSubmitting,
    error,
    success,
    clearMessages,
  } = useAdminCollectionStore();

  useEffect(() => {
    if (id) fetchCollectionByIdOrSlug(id);
  }, [id, fetchCollectionByIdOrSlug]);

  const handleSubmit = async (payload) => {
    clearMessages?.();
    const res = await updateCollection(id, payload);
    if (res?.success) {
      router.refresh?.();
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/collections"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
              <PencilLine size={12} />
              Edit Collection
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
              {selectedCollection?.name || "Edit Collection"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Update details, product codes, SEO, and collection visibility.
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      {isLoading && !selectedCollection ? (
        <div className="rounded-[28px] border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 shadow-sm">
          Loading collection...
        </div>
      ) : selectedCollection ? (
        <CollectionForm
          initialData={selectedCollection}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
        />
      ) : (
        <div className="rounded-[28px] border border-dashed border-zinc-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">Collection not found</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Please check the selected collection and try again.
          </p>
        </div>
      )}
    </div>
  );
}