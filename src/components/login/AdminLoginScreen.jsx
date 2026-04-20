"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAdminUserStore } from "@/store/adminAuthStore";

export default function AdminLoginScreen({
  title = "Foton Power Admin",
  subtitle = "Login to manage operations, orders and analytics.",
}) {
  const router = useRouter();

  const loginAdmin = useAdminUserStore((state) => state.loginAdmin);
  const token = useAdminUserStore((state) => state.token);
  const isLoading = useAdminUserStore((state) => state.isLoading);
  const error = useAdminUserStore((state) => state.error);
  const message = useAdminUserStore((state) => state.message);
  const clearMessages = useAdminUserStore((state) => state.clearMessages);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (token) {
      router.replace("/");
      router.refresh();
    }
  }, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginAdmin({
      email: form.email,
      password: form.password,
    });

    if (result?.success) {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white text-black">
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl lg:grid-cols-2"
        >
          <div className="hidden flex-col justify-center bg-black px-10 py-10 text-white lg:flex">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
                <ShieldCheck size={16} />
                Secure Access
              </div>

              <h1 className="text-4xl font-semibold leading-tight">
                Foton Power
              </h1>

              <p className="mt-3 text-sm text-white/70">
                Admin panel for managing operations, orders, and business flow.
              </p>

              <div className="mt-8 space-y-3 text-sm text-white/60">
                <p>• Orders & Dispatch</p>
                <p>• Inventory & Products</p>
                <p>• Analytics & Reports</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <ShieldCheck size={22} />
                </div>

                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-black/60">{subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 focus-within:border-black">
                    <Mail size={18} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@fotonpower.com"
                      className="w-full bg-transparent text-sm outline-none"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 focus-within:border-black">
                    <Lock size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm outline-none"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-black/50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-xs text-black/50">
                Authorized personnel only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}