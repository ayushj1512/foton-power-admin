"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Mail,
  RefreshCw,
  Shield,
  User2,
  AlertCircle,
  LockKeyhole,
} from "lucide-react";
import { useAdminUserStore } from "@/store/adminAuthStore";

const cardClass =
  "rounded-[24px] bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.05)] md:rounded-[30px] md:p-6";

const inputClass =
  "w-full rounded-2xl bg-[#f7f7f8] px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:bg-white focus:shadow-[0_0_0_1px_rgba(24,24,27,0.14),0_8px_30px_rgba(0,0,0,0.05)]";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function DetailCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`rounded-[24px] p-4 ${
        accent ? "bg-black text-white" : "bg-[#f7f7f8] text-zinc-900"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            accent ? "bg-white/10 text-white" : "bg-white text-zinc-700"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>

      <p
        className={`text-[11px] font-medium uppercase tracking-[0.16em] ${
          accent ? "text-white/60" : "text-zinc-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold">{value || "-"}</p>
    </div>
  );
}

export default function ProfilePage() {
  const {
    admin,
    token,
    isLoading,
    isSaving,
    error,
    message,
    fetchMe,
    changePassword,
    clearMessages,
  } = useAdminUserStore();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchMe?.();
  }, [fetchMe]);

  const initials = useMemo(() => {
    const name = admin?.name || admin?.fullName || "A";
    return String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [admin]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages?.();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      return;
    }

    const res = await changePassword?.({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (res?.success) {
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="bg-gradient-to-b from-zinc-50 to-white px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-black text-lg font-semibold text-white shadow-sm">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    <Shield size={12} />
                    Admin Profile
                  </div>

                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                    {admin?.name || admin?.fullName || "Admin User"}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    View your account details, role information, and update your
                    password from one clean place.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fetchMe?.()}
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 disabled:opacity-60"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="flex items-start gap-3 rounded-[24px] bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.08)]">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80">
              <AlertCircle size={16} />
            </div>
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        ) : null}

        {message ? (
          <div className="flex items-start gap-3 rounded-[24px] bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 shadow-[0_8px_24px_rgba(16,185,129,0.08)]">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="font-semibold">Success</p>
              <p className="mt-0.5 text-emerald-600">{message}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,420px)]">
          <div className="space-y-6">
            <section className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <User2 size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                    Account Details
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Basic admin information currently available in your profile.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard
                  icon={User2}
                  label="Name"
                  value={admin?.name || admin?.fullName || "-"}
                  accent
                />
                <DetailCard
                  icon={Mail}
                  label="Email"
                  value={admin?.email || "-"}
                />
                <DetailCard
                  icon={BadgeCheck}
                  label="Role"
                  value={admin?.role || "-"}
                />
                <DetailCard
                  icon={KeyRound}
                  label="Session"
                  value={token ? "Authenticated" : "No active token"}
                />
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                    Metadata
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Helpful account timestamps and identifiers.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard
                  icon={CalendarDays}
                  label="Created At"
                  value={formatDate(admin?.createdAt)}
                />
                <DetailCard
                  icon={RefreshCw}
                  label="Updated At"
                  value={formatDate(admin?.updatedAt)}
                />
                <DetailCard
                  icon={Shield}
                  label="Admin ID"
                  value={admin?._id || admin?.id || "-"}
                />
                <DetailCard
                  icon={BadgeCheck}
                  label="Status"
                  value={admin ? "Profile Loaded" : "No profile data"}
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className={`${cardClass} xl:sticky xl:top-24`}>
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                    Change Password
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Keep your admin account secure with a new password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-800">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-800">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-800">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className={inputClass}
                  />
                </div>

                {form.confirmPassword &&
                form.newPassword &&
                form.confirmPassword !== form.newPassword ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    New password and confirm password do not match.
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !form.currentPassword ||
                    !form.newPassword ||
                    !form.confirmPassword ||
                    form.newPassword !== form.confirmPassword
                  }
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <LockKeyhole size={16} />
                  )}
                  Update Password
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
