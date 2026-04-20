"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAdminSupportTicketStore } from "@/store/adminSupportTicketStore";

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

export default function SupportTicketDetailPage({ params }) {
  const id = params?.id;

  const {
    selectedTicket,
    isLoading,
    error,
    message,
    fetchTicketById,
    updateTicketStatus,
    deleteTicket,
    clearMessages,
    clearSelectedTicket,
  } = useAdminSupportTicketStore();

  const [status, setStatus] = useState("open");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchTicketById(id);

    return () => {
      clearSelectedTicket();
      clearMessages();
    };
  }, [id, fetchTicketById, clearSelectedTicket, clearMessages]);

  useEffect(() => {
    if (selectedTicket?.status) {
      setStatus(selectedTicket.status);
    }
  }, [selectedTicket]);

  const handleStatusUpdate = async () => {
    if (!id || !status) return;
    setIsUpdating(true);
    await updateTicketStatus(id, status);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this ticket?");
    if (!ok) return;

    setIsDeleting(true);
    const res = await deleteTicket(id);
    setIsDeleting(false);

    if (res?.success) {
      window.location.href = "/support-tickets";
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        {/* Top */}
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/support-tickets"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to tickets
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Ticket Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review issue details and update current ticket status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Ticket"}
          </button>
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

        {/* Content */}
        {isLoading && !selectedTicket ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading ticket...
          </div>
        ) : !selectedTicket ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Ticket not found.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedTicket.ticketId || "—"}
                  </h2>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      selectedTicket.status
                    )}`}
                  >
                    {String(selectedTicket.status || "—").replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Customer Name" value={selectedTicket.name} />
                  <InfoCard label="Mobile" value={selectedTicket.mobile} />
                  <InfoCard label="Email" value={selectedTicket.email || "—"} />
                  <InfoCard
                    label="Created At"
                    value={formatDate(selectedTicket.createdAt)}
                  />
                  <InfoCard
                    label="Last Updated"
                    value={formatDate(selectedTicket.updatedAt)}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Issue</h3>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {selectedTicket.issue || "—"}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Update Status
                </h3>

                <div className="mt-4 space-y-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="h-12 w-full rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </h3>

                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setStatus("in_progress");
                      setIsUpdating(true);
                      await updateTicketStatus(id, "in_progress");
                      setIsUpdating(false);
                    }}
                    className="h-11 rounded-2xl border border-yellow-200 bg-yellow-50 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100"
                  >
                    Mark In Progress
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setStatus("resolved");
                      setIsUpdating(true);
                      await updateTicketStatus(id, "resolved");
                      setIsUpdating(false);
                    }}
                    className="h-11 rounded-2xl border border-green-200 bg-green-50 text-sm font-medium text-green-700 transition hover:bg-green-100"
                  >
                    Mark Resolved
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setStatus("closed");
                      setIsUpdating(true);
                      await updateTicketStatus(id, "closed");
                      setIsUpdating(false);
                    }}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Mark Closed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}