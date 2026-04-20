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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (token) fetchMe();
  }, [mounted, token, fetchMe]);

  // sirf sidebar hide hoga "/" pe
  const hideSidebar = pathname === "/";

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
          
          <div className="flex min-h-screen">
            {/* Sidebar (conditionally hidden) */}
            {!hideSidebar && <Sidebar />}

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />

              <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                {children}
              </main>

              <Footer />
            </div>
          </div>

        </div>
      </body>
    </html>
  );
}