"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  Clock3,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";
import { useAdminSupportTicketStore } from "@/store/adminSupportTicketStore";

const statusStyles = {
  open: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-amber-50 text-amber-700",
  resolved: "bg-sky-50 text-sky-700",
  closed: "bg-zinc-100 text-zinc-700",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getName = (ticket) =>
  ticket?.name ||
  ticket?.fullName ||
  ticket?.customerName ||
  ticket?.user?.name ||
  "Unknown";

const getEmail = (ticket) =>
  ticket?.email || ticket?.customerEmail || ticket?.user?.email || "—";

const getPhone = (ticket) =>
  ticket?.phone || ticket?.mobile || ticket?.customerPhone || "—";

const getSubject = (ticket) =>
  ticket?.subject || ticket?.title || ticket?.issue || "Untitled ticket";

const getMessage = (ticket) =>
  ticket?.message || ticket?.description || ticket?.query || "";

const getStatus = (ticket) => ticket?.status || "open";

const StatCard = ({ icon: Icon, title, value, hint }) => (
  <div className="rounded-[26px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
      {title}
    </p>
    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
      {value}
    </h3>
    {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
  </div>
);

export default function OpenSupportTicketsPage() {
  const {
    tickets,
    isLoading,
    error,
    message,
    fetchTickets,
    updateTicketStatus,
    deleteTicket,
    clearMessages,
  } = useAdminSupportTicketStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTickets({ status: "open" }).catch(() => {});
  }, [fetchTickets]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets({ status: "open", search }).catch(() => {});
    }, 350);

    return () => clearTimeout(timer);
  }, [search, fetchTickets]);

  const openTickets = useMemo(
    () => tickets.filter((ticket) => getStatus(ticket) === "open"),
    [tickets]
  );

  const stats = useMemo(() => {
    const total = openTickets.length;
    const withEmail = openTickets.filter((ticket) => getEmail(ticket) !== "—").length;
    const withPhone = openTickets.filter((ticket) => getPhone(ticket) !== "—").length;

    return { total, withEmail, withPhone };
  }, [openTickets]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateTicketStatus(id, nextStatus);
    } catch {}
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this open ticket?");
    if (!ok) return;

    try {
      await deleteTicket(id);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-[30px] bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-800 px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                <AlertCircle className="h-3.5 w-3.5" />
                Open support tickets
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Open ticket queue
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Review fresh customer issues quickly and move them into progress or resolve them.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/support-tickets"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
              >
                All tickets
              </Link>

              <button
                onClick={() => {
                  clearMessages();
                  fetchTickets({ status: "open", search }).catch(() => {});
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard icon={Ticket} title="Open tickets" value={stats.total} hint="Needs action" />
          <StatCard icon={Mail} title="With email" value={stats.withEmail} hint="Contactable by mail" />
          <StatCard icon={Phone} title="With phone" value={stats.withPhone} hint="Contactable by call" />
        </section>

        {(error || message) && (
          <section
            className={`rounded-[24px] px-4 py-3 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.03)] ring-1 ${
              error
                ? "bg-rose-50 text-rose-700 ring-rose-100"
                : "bg-emerald-50 text-emerald-700 ring-emerald-100"
            }`}
          >
            {error || message}
          </section>
        )}

        <section className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search open tickets by name, email, subject..."
              className="h-12 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                Open tickets
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Priority queue for unresolved support requests
              </p>
            </div>
          </div>

          <div className="hidden min-[1040px]:block">
            <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Subject</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center px-5 py-16 text-zinc-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading open tickets...
              </div>
            ) : openTickets.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                  <Ticket className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No open tickets found
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Fresh unresolved tickets will show up here.
                </p>
              </div>
            ) : (
              openTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 transition hover:bg-zinc-50/70"
                >
                  <div className="col-span-3 min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-950">
                      {getName(ticket)}
                    </p>
                    <p className="mt-1 truncate text-sm text-zinc-600">
                      {getEmail(ticket)}
                    </p>
                  </div>

                  <div className="col-span-3 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {getSubject(ticket)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                      {getMessage(ticket) || "No message provided"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-zinc-900">{getPhone(ticket)}</p>
                    <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Open
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-700">
                      <Clock3 className="h-4 w-4 text-zinc-400" />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-start justify-end gap-2">
                    <button
                      onClick={() => handleStatusChange(ticket._id, "in_progress")}
                      className="inline-flex items-center rounded-2xl bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                      Start
                    </button>

                    <Link
                      href={`/support-tickets/${ticket._id}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Open
                      <ChevronRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 p-4 min-[1040px]:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-3xl bg-zinc-50 px-4 py-12 text-zinc-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading open tickets...
              </div>
            ) : openTickets.length === 0 ? (
              <div className="rounded-3xl bg-zinc-50 px-4 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zinc-500 ring-1 ring-zinc-200">
                  <Ticket className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No open tickets found
                </h3>
              </div>
            ) : (
              openTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-950">
                        {getName(ticket)}
                      </p>
                      <p className="mt-1 truncate text-sm text-zinc-600">
                        {getSubject(ticket)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        statusStyles[getStatus(ticket)] || "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {getStatus(ticket).replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{getEmail(ticket)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{getPhone(ticket)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange(ticket._id, "in_progress")}
                      className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                      Start progress
                    </button>

                    <Link
                      href={`/support-tickets/${ticket._id}`}
                      className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Open
                    </Link>

                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}