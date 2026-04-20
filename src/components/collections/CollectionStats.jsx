"use client";

import { BarChart3, Layers3, Monitor, Sparkles, ToggleRight } from "lucide-react";

const cardStyles = [
  "from-zinc-950 to-zinc-800 text-white border-zinc-900",
  "from-zinc-100 to-white text-zinc-900 border-zinc-200",
  "from-zinc-100 to-white text-zinc-900 border-zinc-200",
  "from-zinc-100 to-white text-zinc-900 border-zinc-200",
];

const icons = [Layers3, ToggleRight, Sparkles, Monitor];

export default function CollectionStats({ collections = [] }) {
  const total = collections.length;
  const active = collections.filter((item) => item?.isActive).length;
  const featured = collections.filter((item) => item?.isFeatured).length;
  const homepage = collections.filter((item) => item?.showOnHomepage).length;
  const totalCodes = collections.reduce(
    (sum, item) => sum + (Array.isArray(item?.productCodes) ? item.productCodes.length : 0),
    0
  );

  const items = [
    { label: "Total Collections", value: total, hint: `${totalCodes} product codes mapped` },
    { label: "Active", value: active, hint: "Visible in active listings" },
    { label: "Featured", value: featured, hint: "Highlighted collections" },
    { label: "Homepage", value: homepage, hint: "Shown on homepage" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index] || BarChart3;
        return (
          <div
            key={item.label}
            className={`rounded-[28px] border bg-gradient-to-br p-5 shadow-sm ${cardStyles[index]}`}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">
                  {item.label}
                </p>
                <h3 className="mt-2 text-3xl font-semibold">{item.value}</h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Icon size={20} />
              </div>
            </div>

            <p className="text-sm opacity-80">{item.hint}</p>
          </div>
        );
      })}
    </div>
  );
}