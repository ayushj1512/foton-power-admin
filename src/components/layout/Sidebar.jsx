"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers3,
  X,
} from "lucide-react";
import { SIDEBAR_ITEMS } from "@/config/sidebarConfig";

function cleanPath(href = "") {
  return href.split("?")[0];
}

function isChildActive(pathname, href = "") {
  return cleanPath(pathname) === cleanPath(href);
}

function isItemActive(pathname, item) {
  if (item.href) return isChildActive(pathname, item.href);

  if (item.children?.length) {
    return item.children.some((child) => isChildActive(pathname, child.href));
  }

  return false;
}

function SidebarNav({
  pathname,
  openMenus,
  toggleMenu,
  onNavigate,
  collapsed = false,
}) {
  return (
    <nav className="space-y-1.5">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item);
        const isOpen = openMenus[item.label];

        if (item.children?.length) {
          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => toggleMenu(item.label)}
                title={collapsed ? item.label : ""}
                className={`flex w-full items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  active
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/[0.05]"
                }`}
              >
                <div
                  className={`flex min-w-0 items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-white/10 text-white"
                        : "bg-black/[0.06] text-black"
                    }`}
                  >
                    <Icon size={17} />
                  </div>

                  {!collapsed ? (
                    <p className="truncate text-sm font-medium">{item.label}</p>
                  ) : null}
                </div>

                {!collapsed ? (
                  <div className={active ? "text-white/70" : "text-black/45"}>
                    {isOpen ? (
                      <ChevronDown size={17} />
                    ) : (
                      <ChevronRight size={17} />
                    )}
                  </div>
                ) : null}
              </button>

              {!collapsed ? (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-5 mt-1 border-l border-black/10 pl-3">
                    <div className="space-y-1 pb-1">
                      {item.children.map((child) => {
                        const childActive = isChildActive(pathname, child.href);

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={onNavigate}
                            className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                              childActive
                                ? "bg-black text-white"
                                : "text-black/70 hover:bg-black/[0.05] hover:text-black"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : ""}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } rounded-2xl px-3 py-3 transition ${
              active
                ? "bg-black text-white"
                : "text-black hover:bg-black/[0.05]"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                active
                  ? "bg-white/10 text-white"
                  : "bg-black/[0.06] text-black"
              }`}
            >
              <Icon size={17} />
            </div>

            {!collapsed ? (
              <p className="truncate text-sm font-medium">{item.label}</p>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({
  brandName = "FOTON POWER",
  collapsed = false,
  setCollapsed = () => {},
  mobileOpen = false,
  onMobileClose = () => {},
}) {
  const pathname = usePathname();

  const defaultOpen = useMemo(() => {
    const map = {};

    SIDEBAR_ITEMS.forEach((item) => {
      if (item.children?.length) {
        map[item.label] = isItemActive(pathname, item);
      }
    });

    return map;
  }, [pathname]);

  const [openMenus, setOpenMenus] = useState(defaultOpen);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen border-r border-black/10 bg-white transition-all duration-200 lg:flex lg:flex-col ${
          collapsed ? "w-[92px]" : "w-[280px]"
        }`}
      >
        <div className="border-b border-black/10 px-4 py-4">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between gap-3"
            }`}
          >
            <div
              className={`flex min-w-0 items-center ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                <Layers3 size={18} />
              </div>

              {!collapsed ? (
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/45">
                    Admin Panel
                  </p>
                  <h2 className="truncate text-base font-semibold text-black">
                    {brandName}
                  </h2>
                </div>
              ) : null}
            </div>

            {!collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-black transition hover:bg-black/[0.05]"
              >
                <ChevronsLeft size={18} />
              </button>
            ) : null}
          </div>
        </div>

        {collapsed ? (
          <div className="flex justify-center border-b border-black/10 px-3 py-3">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-black transition hover:bg-black/[0.05]"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav
            pathname={pathname}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            collapsed={collapsed}
          />
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[86vw] max-w-[320px] transform border-r border-black/10 bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <Layers3 size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
                Admin Panel
              </p>
              <h2 className="truncate text-sm font-semibold text-black">
                {brandName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100dvh-81px)] overflow-y-auto px-3 py-4">
          <SidebarNav
            pathname={pathname}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            onNavigate={onMobileClose}
          />
        </div>
      </aside>
    </>
  );
}
