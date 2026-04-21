"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  Trash2,
  User2,
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

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-[24px] bg-zinc-50 p-4 ring-1 ring-zinc-200/70">
    <div className="flex items-center gap-2 text-zinc-500">
      <Icon className="h-4 w-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
    </div>
    <p className="mt-3 text-sm font-medium text-zinc-950 break-words">{value || "—"}</p>
  </div>
);

export default function SupportTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const {
    selectedTicket,
    isLoading,
    error,
    message,
    fetchTicketById,
    updateTicketStatus,
    deleteTicket,
    clearSelectedTicket,
    clearMessages,
  } = useAdminSupportTicketStore();

  useEffect(() => {
    if (!id) return;
    fetchTicketById(id).catch(() => {});

    return () => {
      clearSelectedTicket();
      clearMessages();
    };
  }, [id, fetchTicketById, clearSelectedTicket, clearMessages]);

  const ticket = selectedTicket;

  const handleStatusChange = async (nextStatus) => {
    if (!id) return;
    await updateTicketStatus(id, nextStatus);
  };

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm("Delete this ticket?");
    if (!ok) return;

    const result = await deleteTicket(id);
    if (result?.success) {
      router.push("/support-tickets");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-[30px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/support-tickets"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to tickets
              </Link>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Support ticket detail
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                View full customer context, update status, or close the support request.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchTicketById(id).catch(() => {})}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2.5 text-sm font-medium text-rose-100 transition hover:bg-rose-500/25"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
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

        {isLoading && !ticket ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white px-6 py-16 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-zinc-500" />
            <span className="text-sm text-zinc-500">Loading ticket...</span>
          </div>
        ) : !ticket ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-zinc-950">Ticket not found</h2>
            <p className="mt-2 text-sm text-zinc-500">
              This ticket may have been deleted or is unavailable.
            </p>
            <Link
              href="/support-tickets"
              className="mt-5 inline-flex items-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Back to all tickets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Ticket subject
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                      {getSubject(ticket)}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      Ticket ID: {ticket?._id}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      statusStyles[getStatus(ticket)] || "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {getStatus(ticket).replace("_", " ")}
                  </span>
                </div>

                <div className="mt-6 rounded-[24px] bg-zinc-50 p-5 ring-1 ring-zinc-200/70">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MessageSquareText className="h-4 w-4" />
                    <p className="text-sm font-medium">Customer message</p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                    {getMessage(ticket) || "No message provided"}
                  </p>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                    Timeline
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Ticket activity and timestamps
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoCard icon={CalendarDays} label="Created at" value={formatDate(ticket.createdAt)} />
                  <InfoCard icon={Clock3} label="Updated at" value={formatDate(ticket.updatedAt)} />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                    Quick actions
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Update ticket workflow status
                  </p>
                </div>

                <select
                  value={getStatus(ticket)}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-zinc-50 px-4 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-zinc-300"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Mark resolved
                  </button>

                  <button
                    onClick={() => handleStatusChange("closed")}
                    className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
                  >
                    Close ticket
                  </button>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                    Customer details
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Basic contact information
                  </p>
                </div>

                <div className="space-y-4">
                  <InfoCard icon={User2} label="Name" value={getName(ticket)} />
                  <InfoCard icon={Mail} label="Email" value={getEmail(ticket)} />
                  <InfoCard icon={Phone} label="Phone" value={getPhone(ticket)} />
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}