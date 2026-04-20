import { create } from "zustand";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

const getAuthHeaders = () => {
  const token = getStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useAdminSupportTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  isLoading: false,
  error: null,
  message: null,

  clearMessages: () => set({ error: null, message: null }),
  clearSelectedTicket: () => set({ selectedTicket: null }),

  /* =========================================================
     GET ALL TICKETS
  ========================================================= */
  fetchTickets: async (params = {}) => {
    if (!BACKEND) {
      return set({
        error: "NEXT_PUBLIC_BACKEND_URL missing",
        isLoading: false,
      });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const searchParams = new URLSearchParams();

      if (params.status) searchParams.append("status", params.status);
      if (params.search) searchParams.append("search", params.search);

      const query = searchParams.toString();
      const url = `${BACKEND}/api/support-tickets/admin/all${
        query ? `?${query}` : ""
      }`;

      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");

      set({
        tickets: data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch tickets",
        isLoading: false,
      });
    }
  },

  /* =========================================================
     GET SINGLE TICKET
  ========================================================= */
  fetchTicketById: async (id) => {
    if (!BACKEND) {
      return set({
        error: "NEXT_PUBLIC_BACKEND_URL missing",
        isLoading: false,
      });
    }

    if (!id) return;

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/support-tickets/admin/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch ticket");

      set({
        selectedTicket: data.data || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch ticket",
        isLoading: false,
      });
    }
  },

  /* =========================================================
     UPDATE TICKET STATUS
  ========================================================= */
  updateTicketStatus: async (id, status) => {
    if (!BACKEND) {
      return set({
        error: "NEXT_PUBLIC_BACKEND_URL missing",
        isLoading: false,
      });
    }

    if (!id || !status) return;

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(
        `${BACKEND}/api/support-tickets/admin/${id}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update status");

      const updatedTicket = data.data;

      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket._id === id ? updatedTicket : ticket
        ),
        selectedTicket:
          state.selectedTicket?._id === id ? updatedTicket : state.selectedTicket,
        message: data.message || "Ticket status updated successfully",
        isLoading: false,
      }));

      return { success: true, data: updatedTicket };
    } catch (error) {
      set({
        error: error.message || "Failed to update status",
        isLoading: false,
      });
      return { success: false };
    }
  },

  /* =========================================================
     DELETE TICKET
  ========================================================= */
  deleteTicket: async (id) => {
    if (!BACKEND) {
      return set({
        error: "NEXT_PUBLIC_BACKEND_URL missing",
        isLoading: false,
      });
    }

    if (!id) return;

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/support-tickets/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete ticket");

      set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket._id !== id),
        selectedTicket:
          state.selectedTicket?._id === id ? null : state.selectedTicket,
        message: data.message || "Ticket deleted successfully",
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({
        error: error.message || "Failed to delete ticket",
        isLoading: false,
      });
      return { success: false };
    }
  },
}));