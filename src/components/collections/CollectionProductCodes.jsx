"use client";

import { useMemo, useState } from "react";
import {
  Hash,
  Plus,
  Sparkles,
  X,
  ClipboardList,
  Trash2,
} from "lucide-react";

const normalizeCode = (value = "") => {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  if (!raw) return "";
  if (/^\d+$/.test(raw)) return raw.padStart(5, "0");
  return raw;
};

const uniqueCodes = (codes = []) => [
  ...new Set(
    (Array.isArray(codes) ? codes : []).map(normalizeCode).filter(Boolean)
  ),
];

const textareaClass =
  "min-h-[132px] w-full rounded-[24px] bg-[#f7f7f8] px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition resize-none focus:bg-white focus:shadow-[0_0_0_1px_rgba(24,24,27,0.14),0_8px_30px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-60";

export default function CollectionProductCodes({
  value = [],
  onChange,
  disabled = false,
}) {
  const [input, setInput] = useState("");

  const codes = useMemo(() => uniqueCodes(value), [value]);

  const addCodes = (rawValue) => {
    const next = uniqueCodes([
      ...codes,
      ...String(rawValue || "")
        .split(/[,\n]/)
        .map((item) => normalizeCode(item)),
    ]);

    onChange?.(next);
    setInput("");
  };

  const removeCode = (code) => {
    onChange?.(codes.filter((item) => item !== code));
  };

  const handleAdd = () => {
    if (!input.trim()) return;
    addCodes(input);
  };

  const clearAll = () => {
    onChange?.([]);
  };

  return (
    <section className="rounded-[30px] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] md:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
            <Hash size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-zinc-950">
              Product Codes
            </h3>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Add single, comma-separated, or multi-line product codes for this
              collection.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
          <Sparkles size={12} />
          {codes.length} selected
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-3">
          <div className="rounded-[26px] bg-[#fafafa] p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                <ClipboardList size={13} />
                Paste Codes
              </div>

              <textarea
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                placeholder={"00001, 00025, 00360\nor one code per line"}
                className={textareaClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
              Supports comma-separated input
            </div>
            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
              Multi-line paste supported
            </div>
            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
              Numeric codes auto-normalized
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !input.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Codes
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={disabled || codes.length === 0}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear All
          </button>

          <div className="rounded-[24px] bg-[#fafafa] px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              Total mapped
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              {codes.length}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Unique normalized product codes
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {codes.length > 0 ? (
          <div className="rounded-[26px] bg-[#fafafa] p-3">
            <div className="flex flex-wrap gap-2">
              {codes.map((code) => (
                <div
                  key={code}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm"
                >
                  <Sparkles size={12} className="text-zinc-400" />
                  <span>{code}</span>

                  {!disabled ? (
                    <button
                      type="button"
                      onClick={() => removeCode(code)}
                      className="rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      <X size={12} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[26px] bg-[#fafafa] px-4 py-8 text-center">
            <p className="text-sm font-medium text-zinc-700">
              No product codes added yet
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Paste codes above and click add to map products to this collection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}