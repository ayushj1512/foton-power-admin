"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  LifeBuoy,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";
import { useAdminSupportTicketStore } from "@/store/adminSupportTicketStore";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

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

export default function SupportTicketsPage() {
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
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTickets().catch(() => {});
  }, [fetchTickets]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets({ search, status }).catch(() => {});
    }, 350);

    return () => clearTimeout(timer);
  }, [search, status, fetchTickets]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => getStatus(t) === "open").length;
    const progress = tickets.filter((t) => getStatus(t) === "in_progress").length;
    const resolved = tickets.filter((t) => getStatus(t) === "resolved").length;

    return { total, open, progress, resolved };
  }, [tickets]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateTicketStatus(id, nextStatus);
    } catch {}
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this ticket?");
    if (!ok) return;

    try {
      await deleteTicket(id);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4]">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <section className="rounded-[24px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:rounded-[30px] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                <LifeBuoy className="h-3.5 w-3.5" />
                Support tickets
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Customer support workspace
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Review, update, and close customer support tickets from one clean dashboard.
              </p>
            </div>

            <button
              onClick={() => {
                clearMessages();
                fetchTickets({ search, status }).catch(() => {});
              }}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-medium text-white transition hover:bg-white/15 sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Ticket} title="Loaded tickets" value={stats.total} hint="Current filtered result" />
          <StatCard icon={AlertCircle} title="Open" value={stats.open} hint="Needs attention" />
          <StatCard icon={Loader2} title="In progress" value={stats.progress} hint="Being handled" />
          <StatCard icon={LifeBuoy} title="Resolved" value={stats.resolved} hint="Completed queries" />
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
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="relative lg:col-span-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, subject..."
                className="h-12 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-zinc-300 lg:col-span-3"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value || "all"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                fetchTickets({ search: "", status: "" }).catch(() => {});
              }}
              className="h-12 rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200 lg:col-span-1"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                All tickets
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Open the ticket detail page for full context and actions
              </p>
            </div>
          </div>

          <div className="hidden min-[1040px]:block">
            <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Subject</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center px-5 py-16 text-zinc-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                  <Ticket className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No support tickets found
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Matching results will appear here.
                </p>
              </div>
            ) : (
              tickets.map((ticket) => (
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
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusStyles[getStatus(ticket)] || "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {getStatus(ticket).replace("_", " ")}
                    </span>

                    <select
                      value={getStatus(ticket)}
                      onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      className="mt-2 h-10 w-full rounded-2xl bg-zinc-50 px-3 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-zinc-300"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex items-start justify-end gap-2">
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
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-3xl bg-zinc-50 px-4 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zinc-500 ring-1 ring-zinc-200">
                  <Ticket className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  No support tickets found
                </h3>
              </div>
            ) : (
              tickets.map((ticket) => (
              <div
                  key={ticket._id}
                  className="rounded-[24px] bg-zinc-50 p-3 ring-1 ring-zinc-200/70 sm:p-4"
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
                  </div>

                  <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap">
                    <Link
                      href={`/support-tickets/${ticket._id}`}
                      className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Open
                    </Link>

                    <select
                      value={getStatus(ticket)}
                      onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      className="h-10 rounded-2xl bg-white px-3 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:ring-zinc-300"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>

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
