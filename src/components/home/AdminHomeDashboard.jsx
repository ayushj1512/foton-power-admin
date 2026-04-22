"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  FolderKanban,
  Heart,
  Layers3,
  LayoutDashboard,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Ticket,
  Users,
  BookOpen,
  ImageIcon,
  Clock3,
  CalendarDays,
  Truck,
  MapPinned,
  CheckCircle2,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";

const QUOTES = [
  "Small consistent wins build big brands.",
  "Done clean is better than done loud.",
  "Great systems create great customer experiences.",
  "Focus on speed, clarity, and consistency.",
  "Every order handled well builds trust.",
  "Simple dashboards make better decisions faster.",
];

const MODULES = [
  {
    title: "Dashboard",
    description: "Overview, quick actions and business pulse.",
    href: "/",
    icon: LayoutDashboard,
    category: "Core",
    status: "Live",
  },
  {
    title: "Products",
    description: "Manage products, pricing, stock and details.",
    href: "/products",
    icon: ShoppingBag,
    category: "Catalog",
    status: "Live",
  },
  {
    title: "Orders",
    description: "Track orders, payments, fulfillment and notes.",
    href: "/orders",
    icon: Package,
    category: "Sales",
    status: "Live",
  },

  // Shiprocket
  {
    title: "Shiprocket",
    description: "Booking, serviceability, manual booking and sync tools.",
    href: "/shiprocket",
    icon: Truck,
    category: "Operations",
    status: "Live",
  },
  {
    title: "Customers",
    description: "Customer details, codes, contact info and history.",
    href: "/customers",
    icon: Users,
    category: "CRM",
    status: "Live",
  },
  {
    title: "Categories",
    description: "Manage categories and subcategories together.",
    href: "/categories",
    icon: Tags,
    category: "Catalog",
    status: "Live",
  },
  {
    title: "Collections",
    description: "Create and organize collection-based product groups.",
    href: "/collections",
    icon: FolderKanban,
    category: "Catalog",
    status: "Live",
  },
  {
    title: "Blogs",
    description: "Create SEO blogs, link products and drive organic traffic.",
    href: "/blogs",
    icon: BookOpen,
    category: "Marketing",
    status: "Live",
  },
  {
    title: "Media",
    description: "Upload, organize and manage images and videos.",
    href: "/media",
    icon: ImageIcon,
    category: "Catalog",
    status: "Live",
  },
  {
    title: "Wishlist",
    description: "Track product code saves and user activity.",
    href: "/wishlist",
    icon: Heart,
    category: "Engagement",
    status: "Live",
  },
  {
    title: "Coupons",
    description: "Coupon codes, limits, validity and discount rules.",
    href: "/coupons",
    icon: BadgePercent,
    category: "Sales",
    status: "Live",
  },
  {
    title: "Support Tickets",
    description: "Customer support requests, issue tracking and status.",
    href: "/support-tickets",
    icon: Ticket,
    category: "Support",
    status: "Live",
  },
  {
    title: "Inventory",
    description: "Stock flow, reservations and inventory actions.",
    href: "/inventory",
    icon: Boxes,
    category: "Operations",
    status: "Live",
  },
  {
    title: "Admin Users",
    description: "Roles, permissions and secure admin access.",
    href: "/users",
    icon: ShieldCheck,
    category: "Settings",
    status: "Live",
  },
];

const STATS = [
  {
    label: "Modules",
    value: MODULES.length,
    hint: "Ready to manage",
    icon: Layers3,
  },
  {
    label: "Shiprocket Tools",
    value: MODULES.filter((item) => item.category === "Shiprocket").length,
    hint: "Shipping operations",
    icon: Truck,
  },
  {
    label: "Catalog Tools",
    value: MODULES.filter((item) => item.category === "Catalog").length,
    hint: "Products & structure",
    icon: ShoppingBag,
  },
  {
    label: "Sales + CRM",
    value: MODULES.filter(
      (item) => item.category === "Sales" || item.category === "CRM"
    ).length,
    hint: "Customer & order flow",
    icon: Users,
  },
];

function LiveISTTimer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now),
    [now]
  );

  const date = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(now),
    [now]
  );

  return (
    <div className="mt-5 rounded-[18px] bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
        <Clock3 size={14} />
        Live IST
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {time}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
        <CalendarDays size={15} />
        <span>{date}</span>
      </div>
    </div>
  );
}

function StatCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white">
          <Icon size={18} />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          {item.hint}
        </span>
      </div>

      <div className="text-2xl font-semibold tracking-tight text-zinc-950">
        {item.value}
      </div>
      <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
    </div>
  );
}

export default function AdminHomeDashboard() {
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = [...MODULES];

    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "name-asc") items.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "name-desc") items.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "category") items.sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === "status") items.sort((a, b) => a.status.localeCompare(b.status));

    return items;
  }, [search, sortBy]);

  return (
    <section className="min-h-screen bg-zinc-50 text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-black/5 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-zinc-300/20 blur-3xl sm:h-72 sm:w-72" />
      </div>

      <div className="relative w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5 overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100"
        >
          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-7">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-zinc-700 sm:text-xs">
                <LayoutDashboard size={14} />
                Admin Home
              </div>

              <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                Welcome to your admin control center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Manage products, orders, customers, collections, coupons,
                support, inventory and Shiprocket shipping operations from one workspace.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/orders"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Go to Orders
                  <ArrowRight size={16} />
                </a>

                <a
                  href="/shiprocket"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                >
                  Open Shiprocket
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="rounded-[22px] bg-black p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50 sm:text-xs">
                Motivation
              </p>

              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 text-base font-medium leading-7 sm:text-lg sm:leading-8"
              >
                “{QUOTES[quoteIndex]}”
              </motion.p>

              <div className="mt-5 flex items-center gap-2">
                {QUOTES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === quoteIndex ? "w-6 bg-white" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <LiveISTTimer />
            </div>
          </div>
        </motion.div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </div>

        <div className="mb-5 rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-2xl border-0 bg-zinc-100 pl-11 pr-4 text-sm outline-none ring-1 ring-zinc-100 transition focus:bg-white focus:ring-zinc-200"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 w-full rounded-2xl border-0 bg-zinc-100 px-4 text-sm outline-none ring-1 ring-zinc-100 transition focus:bg-white focus:ring-zinc-200 sm:w-auto sm:min-w-[180px]"
            >
              <option value="default">Default</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filteredModules.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group rounded-[22px] bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white transition group-hover:bg-zinc-800 sm:h-12 sm:w-12">
                    <Icon size={20} />
                  </div>

                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-700 sm:text-xs">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600 sm:text-xs">
                    {item.category}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
                    Open
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="mt-6 rounded-[22px] bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100 sm:p-10">
            <p className="text-lg font-semibold">No modules found</p>
            <p className="mt-2 text-sm text-zinc-500">
              Try another search or change sorting.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}