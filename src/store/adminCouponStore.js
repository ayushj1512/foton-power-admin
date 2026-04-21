"use client";

import { create } from "zustand";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ------------------ helpers ------------------ */
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("adminToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

/* ------------------ store ------------------ */
export const useAdminCouponStore = create((set, get) => ({
  coupons: [],
  coupon: null,

  loading: false,
  actionLoading: false,

  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  },

  filters: {
    search: "",
    status: "",
    isActive: "",
    isHidden: "",
    autoApply: "",
    discountType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  /* =========================
     FETCH ALL
  ========================= */
  fetchCoupons: async (params = {}) => {
    try {
      set({ loading: true });

      const { filters, pagination } = get();

      const query = buildQuery({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });

      const res = await fetch(`${API_BASE}/api/coupons?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch coupons");
      }

      set({
        coupons: Array.isArray(data.coupons) ? data.coupons : [],
        pagination: data.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          pages: 1,
        },
      });

      return data;
    } catch (error) {
      console.error("fetchCoupons error:", error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     FETCH SINGLE
  ========================= */
  fetchCouponById: async (couponId) => {
    try {
      set({ loading: true });

      const res = await fetch(`${API_BASE}/api/coupons/${couponId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch coupon");
      }

      set({
        coupon: data.coupon || null,
      });

      return data.coupon;
    } catch (error) {
      console.error("fetchCouponById error:", error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     CREATE
  ========================= */
  createCoupon: async (payload = {}) => {
    try {
      set({ actionLoading: true });

      const res = await fetch(`${API_BASE}/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create coupon");
      }

      await get().fetchCoupons();

      return data.coupon;
    } catch (error) {
      console.error("createCoupon error:", error.message);
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  /* =========================
     UPDATE
  ========================= */
  updateCoupon: async (couponId, payload = {}) => {
    try {
      set({ actionLoading: true });

      const res = await fetch(`${API_BASE}/api/coupons/${couponId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update coupon");
      }

      await get().fetchCoupons();

      set((state) => ({
        coupon:
          state.coupon?._id === couponId ? data.coupon || state.coupon : state.coupon,
      }));

      return data.coupon;
    } catch (error) {
      console.error("updateCoupon error:", error.message);
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  /* =========================
     DELETE
  ========================= */
  deleteCoupon: async (couponId) => {
    try {
      set({ actionLoading: true });

      const res = await fetch(`${API_BASE}/api/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete coupon");
      }

      await get().fetchCoupons();

      set((state) => ({
        coupon: state.coupon?._id === couponId ? null : state.coupon,
      }));

      return data;
    } catch (error) {
      console.error("deleteCoupon error:", error.message);
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  /* =========================
     UPDATE STATUS
  ========================= */
  updateCouponStatus: async (couponId, payload = {}) => {
    try {
      set({ actionLoading: true });

      const res = await fetch(
        `${API_BASE}/api/coupons/${couponId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update coupon status");
      }

      await get().fetchCoupons();

      set((state) => ({
        coupon:
          state.coupon?._id === couponId ? data.coupon || state.coupon : state.coupon,
      }));

      return data.coupon;
    } catch (error) {
      console.error("updateCouponStatus error:", error.message);
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  /* =========================
     TOGGLE VISIBILITY
  ========================= */
  toggleCouponVisibility: async (couponId) => {
    try {
      set({ actionLoading: true });

      const res = await fetch(
        `${API_BASE}/api/coupons/${couponId}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to toggle coupon visibility");
      }

      await get().fetchCoupons();

      set((state) => ({
        coupon:
          state.coupon?._id === couponId ? data.coupon || state.coupon : state.coupon,
      }));

      return data.coupon;
    } catch (error) {
      console.error("toggleCouponVisibility error:", error.message);
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  /* =========================
     FILTERS / PAGINATION
  ========================= */
  setFilters: (newFilters = {}) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
      pagination: {
        ...state.pagination,
        page: 1,
      },
    }));
  },

  setPage: (page) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
    }));
  },

  setLimit: (limit) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1,
        limit,
      },
    }));
  },

  resetFilters: () => {
    set((state) => ({
      filters: {
        search: "",
        status: "",
        isActive: "",
        isHidden: "",
        autoApply: "",
        discountType: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      pagination: {
        ...state.pagination,
        page: 1,
        limit: 20,
      },
    }));
  },

  clearCoupon: () => set({ coupon: null }),
}));