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

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (token) fetchMe();
  }, [mounted, token, fetchMe]);

  const hideSidebar = pathname === "/";
  const sidebarWidth = hideSidebar ? 0 : collapsed ? 92 : 280;

  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen bg-background text-foreground" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          {!hideSidebar ? (
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          ) : null}

          <div
            className="flex min-h-screen min-w-0 flex-col transition-all duration-200"
            style={{
              marginLeft: `${sidebarWidth}px`,
            }}
          >
            <Header />

            <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
              {children}
            </main>

            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}