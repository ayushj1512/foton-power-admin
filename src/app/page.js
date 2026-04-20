"use client";

import { useEffect } from "react";
import { useAdminUserStore } from "@/store/adminAuthStore";
import AdminLoginScreen from "@/components/login/AdminLoginScreen";
import AdminHomeDashboard from "@/components/home/AdminHomeDashboard";

export default function Home() {
  const admin = useAdminUserStore((state) => state.admin);
  const token = useAdminUserStore((state) => state.token);
  const isLoading = useAdminUserStore((state) => state.isLoading);
  const hasCheckedAuth = useAdminUserStore((state) => state.hasCheckedAuth);
  const checkAuth = useAdminUserStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          <p className="mt-3 text-sm text-black/60">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !admin) {
    return <AdminLoginScreen />;
  }

  return <AdminHomeDashboard />;
}