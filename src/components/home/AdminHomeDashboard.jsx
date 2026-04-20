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
  {
    title: "Shiprocket",
    description:
      "Booking, serviceability, AWB, tracking sync and shipment recovery.",
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
    description:
      "Upload, organize and manage images and videos across the platform.",
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
    description: "Advanced coupon codes, limits, validity and discount rules.",
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
    label: "Core Sections",
    value: 6,
    hint: "Business essentials",
    icon: LayoutDashboard,
  },
  {
    label: "Catalog Tools",
    value: 4,
    hint: "Products & structure",
    icon: ShoppingBag,
  },
  {
    label: "Support + CRM",
    value: 3,
    hint: "Customer-focused",
    icon: Users,
  },
];

function LiveISTTimer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

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
    <div className="mt-5 rounded-[18px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
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
    let items = [...MODULES];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "name-asc") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "name-desc") {
      items.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "category") {
      items.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "status") {
      items.sort((a, b) => a.status.localeCompare(b.status));
    }

    return items;
  }, [sortBy, search]);

  return (
    <section className="min-h-screen bg-white text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-blue-900/10 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-green-700/10 blur-3xl sm:top-32 sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-black/5 blur-3xl sm:h-72 sm:w-72" />
      </div>

      <div className="relative w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4 overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:mb-6 sm:rounded-[28px]"
        >
          <div className="grid gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-7">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-900/10 bg-blue-900/5 px-3 py-1.5 text-[11px] font-medium text-blue-900 sm:text-xs">
                <LayoutDashboard size={14} />
                Admin Home
              </div>

              <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                Welcome to your admin control center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                Manage products, orders, customers, collections, coupons,
                support, shipping and more from one clean workspace.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/orders"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-blue-950"
                >
                  Go to Orders
                  <ArrowRight size={16} />
                </a>

                <a
                  href="/shiprocket"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-green-700/20 bg-green-700/5 px-4 text-sm font-semibold text-green-800 transition hover:bg-green-700/10"
                >
                  Open Shiprocket
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="rounded-[20px] border border-black/10 bg-black p-4 text-white sm:rounded-[24px] sm:p-5">
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
                      i === quoteIndex ? "w-6 bg-green-500" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <LiveISTTimer />
            </div>
          </div>
        </motion.div>

        <div className="mb-4 rounded-[20px] p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />
              <input
                type="text"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 sm:h-12"
              />
            </div>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <span className="shrink-0 text-sm font-medium text-black/60">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10 sm:h-12 sm:w-auto sm:min-w-[180px]"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>
            </div>
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
                className="group rounded-[22px] border border-black/10 bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-blue-900/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:rounded-[26px] sm:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white transition group-hover:bg-blue-900 sm:h-12 sm:w-12">
                    <Icon size={20} />
                  </div>

                  <span className="rounded-full border border-green-700/20 bg-green-700/5 px-3 py-1 text-[11px] font-medium text-green-800 sm:text-xs">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] font-medium text-black/65 sm:text-xs">
                    {item.category}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-900">
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
          <div className="mt-6 rounded-[20px] border border-dashed border-black/15 bg-white p-8 text-center sm:rounded-[24px] sm:p-10">
            <p className="text-lg font-semibold">No modules found</p>
            <p className="mt-2 text-sm text-black/55">
              Try another search or change sorting.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}