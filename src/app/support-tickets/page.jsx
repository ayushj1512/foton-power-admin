"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, Eye, RefreshCw } from "lucide-react";
import { useAdminSupportTicketStore } from "@/store/adminSupportTicketStore";

const STATUS_OPTIONS = ["all", "open", "in_progress", "resolved", "closed"];

const getStatusClasses = (status) => {
  switch (status) {
    case "open":
      return "bg-red-50 text-red-700 border-red-200";
    case "in_progress":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "resolved":
      return "bg-green-50 text-green-700 border-green-200";
    case "closed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
  const [status, setStatus] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    let list = Array.isArray(tickets) ? tickets : [];

    if (status !== "all") {
      list = list.filter((ticket) => ticket.status === status);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((ticket) => {
        return (
          String(ticket.ticketId || "").toLowerCase().includes(q) ||
          String(ticket.name || "").toLowerCase().includes(q) ||
          String(ticket.mobile || "").toLowerCase().includes(q) ||
          String(ticket.email || "").toLowerCase().includes(q) ||
          String(ticket.issue || "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [tickets, search, status]);

  const counts = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    return {
      total: list.length,
      open: list.filter((t) => t.status === "open").length,
      in_progress: list.filter((t) => t.status === "in_progress").length,
      resolved: list.filter((t) => t.status === "resolved").length,
      closed: list.filter((t) => t.status === "closed").length,
    };
  }, [tickets]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    await updateTicketStatus(id, newStatus);
    setUpdatingId(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this ticket?");
    if (!ok) return;

    setDeletingId(id);
    await deleteTicket(id);
    setDeletingId(null);
  };

  const handleRefresh = async () => {
    clearMessages();
    await fetchTickets();
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1400px] space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Support Tickets
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage customer issues, update statuses, and track progress.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard title="Total" value={counts.total} />
          <StatCard title="Open" value={counts.open} />
          <StatCard title="In Progress" value={counts.in_progress} />
          <StatCard title="Resolved" value={counts.resolved} />
          <StatCard title="Closed" value={counts.closed} />
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              placeholder="Search by ticket id, name, mobile, email, issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Statuses"
                    : item.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alerts */}
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="bg-slate-100/80">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-4 py-4 font-semibold">Ticket ID</th>
                  <th className="px-4 py-4 font-semibold">Customer</th>
                  <th className="px-4 py-4 font-semibold">Mobile</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Issue</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Created</th>
                  <th className="px-4 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Loading tickets...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-t border-slate-100 text-sm text-slate-700"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {ticket.ticketId || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {ticket.name || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4">{ticket.mobile || "—"}</td>

                      <td className="px-4 py-4">{ticket.email || "—"}</td>

                      <td className="max-w-[320px] px-4 py-4">
                        <p className="line-clamp-2 text-slate-600">
                          {ticket.issue || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              ticket.status
                            )}`}
                          >
                            {String(ticket.status || "—").replace("_", " ")}
                          </span>

                          <select
                            value={ticket.status || "open"}
                            onChange={(e) =>
                              handleStatusChange(ticket._id, e.target.value)
                            }
                            disabled={updatingId === ticket._id}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400 disabled:opacity-60"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        {formatDate(ticket.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/support-tickets/${ticket._id}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(ticket._id)}
                            disabled={deletingId === ticket._id}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}