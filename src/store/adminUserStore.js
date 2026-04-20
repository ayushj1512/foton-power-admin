import { create } from "zustand";

/* =========================================================
   BACKEND URL (env + fallback)
========================================================= */
const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

/* =========================================================
   TOKEN HELPERS
========================================================= */
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

const setToken = (token) => {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("adminToken", token);
    else localStorage.removeItem("adminToken");
  }
};

const authHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useAdminUserStore = create((set, get) => ({
  admin: null,
  admins: [],
  token: typeof window !== "undefined" ? getToken() : null,
  isLoading: false,
  isSaving: false,
  error: null,
  message: null,

  clearMessages: () => set({ error: null, message: null }),

  /* =========================================================
     LOGIN
  ========================================================= */
  loginAdmin: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/admin-users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      const token = data?.token || null;
      setToken(token);

      set({
        token,
        admin: data?.data || null,
        isLoading: false,
        message: data?.message || "Login successful",
      });

      return { success: true, data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Login failed",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     LOGOUT
  ========================================================= */
  logoutAdmin: () => {
    setToken(null);
    set({
      admin: null,
      token: null,
      admins: [],
      error: null,
      message: "Logged out successfully",
    });
  },

  /* =========================================================
     GET CURRENT ADMIN
  ========================================================= */
  fetchMe: async () => {
    try {
      const token = getToken();
      if (!token) {
        set({ admin: null, token: null });
        return { success: false };
      }

      set({ isLoading: true, error: null });

      const res = await fetch(`${BACKEND}/api/admin-users/me`, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        setToken(null);
        set({ admin: null, token: null, isLoading: false });
        throw new Error(data?.message || "Failed to fetch profile");
      }

      set({
        admin: data?.data || null,
        token,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch profile",
      });
      return { success: false };
    }
  },

  /* =========================================================
     FETCH ALL ADMINS
  ========================================================= */
  fetchAdmins: async () => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${BACKEND}/api/admin-users`, {
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch admins");
      }

      set({
        admins: data?.data || [],
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch admins",
      });
      return { success: false };
    }
  },

  /* =========================================================
     CREATE ADMIN
  ========================================================= */
  createAdmin: async (payload) => {
    try {
      set({ isSaving: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/admin-users/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create admin");
      }

      set({
        isSaving: false,
        message: data?.message || "Admin created successfully",
      });

      await get().fetchAdmins();

      return { success: true };
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || "Failed to create admin",
      });
      return { success: false };
    }
  },

  /* =========================================================
     UPDATE ADMIN
  ========================================================= */
  updateAdmin: async (id, payload) => {
    try {
      set({ isSaving: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/admin-users/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update admin");
      }

      set({
        isSaving: false,
        message: data?.message || "Admin updated successfully",
      });

      await get().fetchAdmins();

      return { success: true };
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || "Failed to update admin",
      });
      return { success: false };
    }
  },

  /* =========================================================
     DELETE ADMIN
  ========================================================= */
  deleteAdmin: async (id) => {
    try {
      set({ isSaving: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/admin-users/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete admin");
      }

      set({
        isSaving: false,
        message: data?.message || "Admin deleted successfully",
      });

      await get().fetchAdmins();

      return { success: true };
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || "Failed to delete admin",
      });
      return { success: false };
    }
  },

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */
  changePassword: async ({ currentPassword, newPassword }) => {
    try {
      set({ isSaving: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/admin-users/change-password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      set({
        isSaving: false,
        message: data?.message || "Password changed successfully",
      });

      return { success: true };
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || "Failed to change password",
      });
      return { success: false };
    }
  },
}));