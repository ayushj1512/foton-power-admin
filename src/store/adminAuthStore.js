import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* =========================================================
   BACKEND URL
========================================================= */
const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

/* =========================================================
   HELPERS
========================================================= */
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const extractAdmin = (payload) => {
  if (!payload) return null;

  if (payload?.data?.name || payload?.data?.email) return payload.data;
  if (payload?.data?.admin) return payload.data.admin;
  if (payload?.admin) return payload.admin;
  if (payload?.user) return payload.user;
  if (payload?.data?.user) return payload.data.user;

  return null;
};

export const useAdminUserStore = create(
  persist(
    (set, get) => ({
      admin: null,
      admins: [],
      token: null,
      isLoading: false,
      isSaving: false,
      hasCheckedAuth: false,
      error: null,
      message: null,

      clearMessages: () => set({ error: null, message: null }),

      /* =========================================================
         LOGIN
      ========================================================= */
      loginAdmin: async ({ email, password }) => {
        try {
          set({
            isLoading: true,
            error: null,
            message: null,
          });

          const res = await fetch(`${BACKEND}/api/admin-users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.message || "Login failed");
          }

          const token = data?.token || data?.data?.token || null;
          const admin = extractAdmin(data);

          if (!token) {
            throw new Error("Token not received from login API");
          }

          set({
            token,
            admin,
            isLoading: false,
            hasCheckedAuth: true,
            error: null,
            message: data?.message || "Login successful",
          });

          return { success: true, data };
        } catch (error) {
          set({
            isLoading: false,
            hasCheckedAuth: true,
            error: error.message || "Login failed",
          });

          return { success: false, message: error.message };
        }
      },

      /* =========================================================
         LOGOUT
      ========================================================= */
      logoutAdmin: () => {
        set({
          admin: null,
          token: null,
          admins: [],
          isLoading: false,
          hasCheckedAuth: true,
          error: null,
          message: "Logged out successfully",
        });
      },

      logout: () => {
        get().logoutAdmin();
      },

      /* =========================================================
         FETCH CURRENT ADMIN
      ========================================================= */
      fetchMe: async () => {
        try {
          const token = get().token;

          if (!token) {
            set({
              admin: null,
              token: null,
              isLoading: false,
              hasCheckedAuth: true,
            });
            return { success: false };
          }

          set({
            isLoading: true,
            error: null,
          });

          const res = await fetch(`${BACKEND}/api/admin-users/me`, {
            method: "GET",
            headers: authHeaders(token),
          });

          const data = await res.json();

          if (!res.ok) {
            set({
              admin: null,
              token: null,
              isLoading: false,
              hasCheckedAuth: true,
              error: data?.message || "Failed to fetch profile",
            });
            return { success: false, message: data?.message };
          }

          const admin = extractAdmin(data);

          if (!admin) {
            set({
              isLoading: false,
              hasCheckedAuth: true,
              error: "Profile data not found",
            });
            return { success: false, message: "Profile data not found" };
          }

          set({
            admin,
            isLoading: false,
            hasCheckedAuth: true,
            error: null,
          });

          return { success: true, data: admin };
        } catch (error) {
          set({
            isLoading: false,
            hasCheckedAuth: true,
            error: error.message || "Failed to fetch profile",
          });

          return { success: false, message: error.message };
        }
      },

      /* =========================================================
         CHECK AUTH
      ========================================================= */
      checkAuth: async () => {
        const { token, admin } = get();

        // session already restored from persist
        if (token && admin) {
          set({
            hasCheckedAuth: true,
            isLoading: false,
          });
          return { success: true, data: admin };
        }

        // token exists but admin missing → fetch profile once
        if (token && !admin) {
          return await get().fetchMe();
        }

        // no session
        set({
          hasCheckedAuth: true,
          isLoading: false,
          admin: null,
          token: null,
        });

        return { success: false };
      },

      /* =========================================================
         FETCH ALL ADMINS
      ========================================================= */
      fetchAdmins: async () => {
        try {
          const token = get().token;

          set({ isLoading: true, error: null });

          const res = await fetch(`${BACKEND}/api/admin-users`, {
            headers: authHeaders(token),
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
          const token = get().token;

          set({ isSaving: true, error: null, message: null });

          const res = await fetch(`${BACKEND}/api/admin-users/create`, {
            method: "POST",
            headers: authHeaders(token),
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
          const token = get().token;

          set({ isSaving: true, error: null, message: null });

          const res = await fetch(`${BACKEND}/api/admin-users/${id}`, {
            method: "PUT",
            headers: authHeaders(token),
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
          const token = get().token;

          set({ isSaving: true, error: null, message: null });

          const res = await fetch(`${BACKEND}/api/admin-users/${id}`, {
            method: "DELETE",
            headers: authHeaders(token),
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
          const token = get().token;

          set({ isSaving: true, error: null, message: null });

          const res = await fetch(`${BACKEND}/api/admin-users/change-password`, {
            method: "PUT",
            headers: authHeaders(token),
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
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasCheckedAuth = false;
        }
      },
    }
  )
);