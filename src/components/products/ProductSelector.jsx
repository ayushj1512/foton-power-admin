"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Package, Search, X } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore";

const getCode = (product) =>
  product?.productCode || product?.code || product?.sku || product?._id || "";

const getTitle = (product) =>
  product?.title || product?.name || product?.productName || "Untitled Product";

const getImage = (product) =>
  product?.displayImage ||
  product?.image?.url ||
  product?.image ||
  product?.media?.[0]?.url ||
  product?.images?.[0]?.url ||
  "";

export default function ProductSelector({
  value = [],
  onChange,
  label = "Products",
  placeholder = "Search products by name, code, SKU...",
  disabled = false,
  limit = 100,
}) {
  const { products, fetchProducts, isLoading } = useAdminProductStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts?.({ limit, sort: "newest" });
  }, [fetchProducts, limit]);

  const selectedCodes = useMemo(
    () => (Array.isArray(value) ? value.filter(Boolean) : []),
    [value]
  );

  const selectedProducts = useMemo(() => {
    return selectedCodes.map((code) => {
      const found = products.find((item) => getCode(item) === code);
      return found || { productCode: code, title: code };
    });
  }, [selectedCodes, products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      const title = getTitle(product).toLowerCase();
      const code = getCode(product).toLowerCase();
      const sku = String(product?.sku || "").toLowerCase();

      if (!q) return true;

      return title.includes(q) || code.includes(q) || sku.includes(q);
    });
  }, [products, search]);

  const toggleProduct = (product) => {
    if (disabled) return;

    const code = getCode(product);
    if (!code) return;

    const exists = selectedCodes.includes(code);

    const next = exists
      ? selectedCodes.filter((item) => item !== code)
      : [...selectedCodes, code];

    onChange?.(next);
  };

  const removeProduct = (code) => {
    if (disabled) return;
    onChange?.(selectedCodes.filter((item) => item !== code));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange?.([]);
  };

  return (
    <section className="rounded-[24px] bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.05)] md:rounded-[30px] md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
            <Package size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">
              {label}
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Select products visually. Product codes will be saved automatically.
            </p>
          </div>
        </div>

        <div className="self-start rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {selectedCodes.length} selected
        </div>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="mb-5 rounded-3xl bg-[#f7f7f8] p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Selected Products
            </p>

            <button
              type="button"
              onClick={clearAll}
              disabled={disabled}
              className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950 disabled:opacity-50"
            >
              Clear all
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {selectedProducts.map((product) => {
              const code = getCode(product);
              const image = getImage(product);

              return (
                <div
                  key={code}
                  className="flex items-center gap-3 rounded-2xl bg-white p-2"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    {image ? (
                      <img
                        src={image}
                        alt={getTitle(product)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <Package size={16} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {getTitle(product)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {code}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProduct(code)}
                    disabled={disabled}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-950 disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="relative mb-4">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-[#f7f7f8] px-4 py-3.5 pl-11 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[0_0_0_1px_rgba(24,24,27,0.14),0_8px_30px_rgba(0,0,0,0.05)] disabled:opacity-60"
        />
      </div>

      <div className="max-h-[430px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-50 p-8 text-sm text-zinc-500">
            <Loader2 size={16} className="animate-spin" />
            Loading products...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-2">
            {filteredProducts.map((product) => {
              const code = getCode(product);
              const title = getTitle(product);
              const image = getImage(product);
              const selected = selectedCodes.includes(code);

              return (
                <button
                  key={product?._id || code}
                  type="button"
                  onClick={() => toggleProduct(product)}
                  disabled={disabled}
                  className={`flex items-center gap-3 rounded-2xl p-2 text-left transition disabled:opacity-60 ${
                    selected
                      ? "bg-black text-white"
                      : "bg-[#f7f7f8] text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/15">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
                        <Package size={16} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{title}</p>
                    <p
                      className={`mt-0.5 truncate text-xs ${
                        selected ? "text-white/65" : "text-zinc-500"
                      }`}
                    >
                      {code}
                    </p>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-white text-black" : "bg-white text-zinc-400"
                    }`}
                  >
                    {selected ? <Check size={15} /> : <Package size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-50 p-8 text-center">
            <p className="text-sm font-medium text-zinc-800">
              No products found
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Try searching with another name, SKU, or product code.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
