"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Package,
  Tag,
  Boxes,
  ShieldCheck,
  Layers,
  IndianRupee,
  FolderTree,
  Sparkles,
} from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { useAdminCollectionStore } from "@/store/adminCollectionStore";

const fallbackImage = "https://placehold.co/900x900?text=No+Image";

const money = (v) =>
  Number.isFinite(Number(v)) ? Number(v).toLocaleString("en-IN") : "0";

const formatDate = (v) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function InfoCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50">
          <Icon className="h-4 w-4 text-gray-800" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="mt-1 truncate text-base font-semibold text-gray-950">
            {value ?? "—"}
          </p>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function DetailBox({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-900" />
        <h2 className="text-base font-semibold text-gray-950">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productCode = params?.["product-code"];

  const { products, isLoading, fetchProducts } = useAdminProductStore();
  const { collections, fetchCollections } = useAdminCollectionStore();

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (!products.length) fetchProducts({ page: 1, limit: 500 });
  }, [products.length, fetchProducts]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const product = useMemo(
    () =>
      products.find((p) => String(p.productCode) === String(productCode)) ||
      null,
    [products, productCode]
  );

  useEffect(() => {
    if (product) setSelectedImage("");
  }, [product?._id]);

  const images = useMemo(() => {
    return (product?.media || [])
      .filter((m) => m?.url)
      .sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });
  }, [product]);

  const primaryImage =
    selectedImage ||
    product?.displayImage ||
    images?.[0]?.url ||
    fallbackImage;

  const discount =
    product?.effectiveDiscountPercent ||
    (product?.mrp > product?.discountPrice
      ? Math.round(((product.mrp - product.discountPrice) / product.mrp) * 100)
      : 0);

  const categoryName =
    product?.categoryName || product?.category?.name || "No category";

  const subcategoryName =
    product?.subcategoryName || product?.subcategoryDetails?.name || "";

  const productCollections = useMemo(() => {
    const code = String(product?.productCode || "");
    return (collections || []).filter((c) =>
      (c?.productCodes || []).some((p) => String(p) === code)
    );
  }, [collections, product?.productCode]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-medium text-gray-900">Product not found</p>

          <Link
            href="/products/manage"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Manage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <Link
              href="/products/manage"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Manage
            </Link>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                Code: {product.productCode}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                {product.status || "draft"}
              </span>

              {product.isFeatured && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {categoryName}
              {subcategoryName ? ` / ${subcategoryName}` : ""}
            </p>
          </div>

          <Link
            href={`/products/edit/${product.productCode}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Edit3 className="h-4 w-4" />
            Edit Product
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={primaryImage}
              alt={product.name || "Product image"}
              className="h-[360px] w-full object-contain sm:h-[520px]"
            />
          </div>

          {!!images.length && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((item, i) => (
                <button
                  key={item._id || item.url || i}
                  onClick={() => setSelectedImage(item.url)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50 ring-1 transition ${
                    primaryImage === item.url
                      ? "ring-black"
                      : "ring-gray-100 hover:ring-gray-300"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.alt || `Product image ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Selling Price
            </p>

            <div className="mt-2 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-bold text-gray-950">
                ₹{money(product.discountPrice)}
              </p>

              {product.mrp > product.discountPrice && (
                <p className="pb-1 text-base font-medium text-gray-400 line-through">
                  ₹{money(product.mrp)}
                </p>
              )}
            </div>

            {!!discount && (
              <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {discount}% off
              </p>
            )}
          </div>

          <InfoCard
            icon={Boxes}
            label="Available"
            value={product.availableStock ?? product.stock ?? 0}
            sub="Ready to sell"
          />
          <InfoCard
            icon={Package}
            label="Reserved"
            value={product.reservedStock ?? 0}
            sub="Blocked stock"
          />
          <InfoCard
            icon={ShieldCheck}
            label="Sold"
            value={product.soldCount ?? 0}
            sub="Total sold"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DetailBox icon={FolderTree} title="Category">
            <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-950">
                {categoryName}
              </p>
              {subcategoryName && (
                <p className="mt-1 text-xs text-gray-500">{subcategoryName}</p>
              )}
            </div>
          </DetailBox>

          <DetailBox icon={Sparkles} title="Collections">
            {productCollections.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {productCollections.map((item) => (
                  <span
                    key={item.slug || item.name}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                Not added to any collection
              </p>
            )}
          </DetailBox>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard icon={Tag} label="Color" value={product.color || "—"} />
          <InfoCard
            icon={Layers}
            label="Variants"
            value={product.variants?.length || 0}
          />
          <InfoCard
            icon={IndianRupee}
            label="Tax Class"
            value={product.taxClass || "—"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DetailBox icon={Tag} title="Short Description">
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
              {product.shortDescription || "No short description added."}
            </p>
          </DetailBox>

          <DetailBox icon={Tag} title="Full Description">
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
              {product.description || "No description added."}
            </p>
          </DetailBox>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-base font-semibold text-gray-950">
            Product Meta
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400">Category</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {categoryName}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Subcategory</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {subcategoryName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Created</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(product.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Updated</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>

          {!!product.tags?.length && (
            <div className="mt-5">
              <p className="text-xs text-gray-400">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}