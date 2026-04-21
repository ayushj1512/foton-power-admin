"use client";

import {
  BarChart3,
  Layers3,
  Monitor,
  Sparkles,
  ToggleRight,
  ArrowUpRight,
} from "lucide-react";

const icons = [Layers3, ToggleRight, Sparkles, Monitor];

export default function CollectionStats({ collections = [] }) {
  const total = collections.length;
  const active = collections.filter((item) => item?.isActive).length;
  const featured = collections.filter((item) => item?.isFeatured).length;
  const homepage = collections.filter((item) => item?.showOnHomepage).length;
  const totalCodes = collections.reduce(
    (sum, item) =>
      sum + (Array.isArray(item?.productCodes) ? item.productCodes.length : 0),
    0
  );

  const items = [
    {
      label: "Total Collections",
      value: total,
      hint: `${totalCodes} product codes mapped`,
      featured: true,
    },
    {
      label: "Active",
      value: active,
      hint: "Visible in active listings",
    },
    {
      label: "Featured",
      value: featured,
      hint: "Highlighted collections",
    },
    {
      label: "Homepage",
      value: homepage,
      hint: "Shown on homepage",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index] || BarChart3;

        return (
          <div
            key={item.label}
            className={`group rounded-[30px] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] ${
              item.featured ? "bg-black text-white" : "bg-white text-zinc-900"
            }`}
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
                    item.featured ? "text-white/60" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  {item.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  item.featured
                    ? "bg-white/10 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                <Icon size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p
                className={`text-sm ${
                  item.featured ? "text-white/75" : "text-zinc-500"
                }`}
              >
                {item.hint}
              </p>

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.featured
                    ? "bg-white/10 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}