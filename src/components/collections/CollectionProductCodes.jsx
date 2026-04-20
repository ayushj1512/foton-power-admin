"use client";

import { useMemo, useState } from "react";
import { Hash, Plus, Sparkles, X } from "lucide-react";

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
  ...new Set((Array.isArray(codes) ? codes : []).map(normalizeCode).filter(Boolean)),
];

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

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
          <Hash size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900">Product Codes</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Add single, comma-separated, or multi-line product codes.
          </p>
        </div>

        <div className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
          {codes.length} selected
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder={"00001, 00025, 00360\nor one code per line"}
            className="min-h-[108px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !input.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 md:self-start"
          >
            <Plus size={16} />
            Add Codes
          </button>
        </div>

        {codes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {codes.map((code) => (
              <div
                key={code}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                <Sparkles size={12} className="text-zinc-400" />
                <span>{code}</span>

                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => removeCode(code)}
                    className="rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
                  >
                    <X size={12} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
            No product codes added yet.
          </div>
        )}
      </div>
    </div>
  );
}