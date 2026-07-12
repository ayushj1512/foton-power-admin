"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useAdminUserStore } from "@/store/adminAuthStore";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const token = useAdminUserStore((state) => state.token);
  const fetchMe = useAdminUserStore((state) => state.fetchMe);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) fetchMe();
  }, [token, fetchMe]);

  const hideSidebar = pathname === "/";
  const sidebarWidth = hideSidebar ? 0 : collapsed ? 92 : 280;

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full bg-background text-foreground">
          {!hideSidebar ? (
            <Sidebar
              key={pathname}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              mobileOpen={mobileSidebarOpen}
              onMobileClose={() => setMobileSidebarOpen(false)}
            />
          ) : null}

          <div
            className="flex min-h-screen min-w-0 flex-col transition-[padding] duration-200 lg:pl-[var(--sidebar-offset)]"
            style={{
              "--sidebar-offset": hideSidebar ? "0px" : `${sidebarWidth}px`,
            }}
          >
            <Header
              showMenuButton={!hideSidebar}
              onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <main className="min-w-0 flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
