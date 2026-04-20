"use client";

import { create } from "zustand";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const getAuthHeaders = (isJson = true) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

export const useAdminOrderStore = create((set, get) => ({
  orders: [],
  order: null,
  stats: null,

  isLoading: false,
  isFetchingOrders: false,
  isFetchingOrder: false,
  isSubmitting: false,

  error: null,

  filters: {
    search: "",
    orderStatus: "",
    paymentStatus: "",
    paymentMethod: "",
    source: "",
    customerCode: "",
    phone: "",
    email: "",
    couponCode: "",
    isConfirmed: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  },

  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },

  clearError: () => set({ error: null }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        orderStatus: "",
        paymentStatus: "",
        paymentMethod: "",
        source: "",
        customerCode: "",
        phone: "",
        email: "",
        couponCode: "",
        isConfirmed: "",
        startDate: "",
        endDate: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
        limit: 10,
      },
    }),

  /* =========================================================
     GET ALL ORDERS
  ========================================================= */
  fetchOrders: async (customFilters = {}) => {
    try {
      set({ isFetchingOrders: true, error: null });

      const finalFilters = {
        ...get().filters,
        ...customFilters,
      };

      const query = buildQueryString(finalFilters);
      const response = await fetch(`${API_BASE_URL}/api/orders?${query}`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      set({
        orders: data.orders || [],
        pagination: data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        filters: finalFilters,
        isFetchingOrders: false,
      });

      return data;
    } catch (error) {
      console.error("fetchOrders error:", error);
      set({
        error: error.message || "Failed to fetch orders",
        isFetchingOrders: false,
      });
      throw error;
    }
  },

  /* =========================================================
     GET SINGLE ORDER BY ID
  ========================================================= */
  fetchOrderById: async (id) => {
    try {
      set({ isFetchingOrder: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      set({
        order: data.order || null,
        isFetchingOrder: false,
      });

      return data.order;
    } catch (error) {
      console.error("fetchOrderById error:", error);
      set({
        error: error.message || "Failed to fetch order",
        isFetchingOrder: false,
      });
      throw error;
    }
  },

  /* =========================================================
     GET SINGLE ORDER BY ORDER NUMBER
  ========================================================= */
  fetchOrderByOrderNumber: async (orderNumber) => {
    try {
      set({ isFetchingOrder: true, error: null });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/number/${orderNumber}`,
        {
          method: "GET",
          headers: getAuthHeaders(false),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      set({
        order: data.order || null,
        isFetchingOrder: false,
      });

      return data.order;
    } catch (error) {
      console.error("fetchOrderByOrderNumber error:", error);
      set({
        error: error.message || "Failed to fetch order",
        isFetchingOrder: false,
      });
      throw error;
    }
  },

  /* =========================================================
     CREATE ORDER
  ========================================================= */
  createOrder: async (payload) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      set((state) => ({
        orders: [data.order, ...state.orders],
        order: data.order || null,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("createOrder error:", error);
      set({
        error: error.message || "Failed to create order",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE ORDER
  ========================================================= */
  updateOrder: async (id, payload) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      set((state) => ({
        orders: state.orders.map((item) =>
          item._id === id ? data.order : item
        ),
        order: state.order?._id === id ? data.order : state.order,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("updateOrder error:", error);
      set({
        error: error.message || "Failed to update order",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */
  updateOrderStatus: async (id, payload) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      set((state) => ({
        orders: state.orders.map((item) =>
          item._id === id ? data.order : item
        ),
        order: state.order?._id === id ? data.order : state.order,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("updateOrderStatus error:", error);
      set({
        error: error.message || "Failed to update order status",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE PAYMENT
  ========================================================= */
  updateOrderPayment: async (id, payload) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/payment`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment");
      }

      set((state) => ({
        orders: state.orders.map((item) =>
          item._id === id ? data.order : item
        ),
        order: state.order?._id === id ? data.order : state.order,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("updateOrderPayment error:", error);
      set({
        error: error.message || "Failed to update payment",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE SHIPMENT
  ========================================================= */
  updateShipmentDetails: async (id, payload) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${id}/shipment`,
        {
          method: "PATCH",
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update shipment");
      }

      set((state) => ({
        orders: state.orders.map((item) =>
          item._id === id ? data.order : item
        ),
        order: state.order?._id === id ? data.order : state.order,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("updateShipmentDetails error:", error);
      set({
        error: error.message || "Failed to update shipment",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     DELETE ORDER
  ========================================================= */
  deleteOrder: async (id) => {
    try {
      set({ isSubmitting: true, error: null });

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order");
      }

      set((state) => ({
        orders: state.orders.filter((item) => item._id !== id),
        order: state.order?._id === id ? null : state.order,
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      console.error("deleteOrder error:", error);
      set({
        error: error.message || "Failed to delete order",
        isSubmitting: false,
      });
      throw error;
    }
  },

  /* =========================================================
     GET ORDER STATS
  ========================================================= */
  fetchOrderStats: async (customFilters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const finalFilters = {
        ...get().filters,
        ...customFilters,
      };

      const query = buildQueryString(finalFilters);
      const response = await fetch(`${API_BASE_URL}/api/orders/stats?${query}`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order stats");
      }

      set({
        stats: data.stats || null,
        isLoading: false,
      });

      return data.stats;
    } catch (error) {
      console.error("fetchOrderStats error:", error);
      set({
        error: error.message || "Failed to fetch order stats",
        isLoading: false,
      });
      throw error;
    }
  },

  /* =========================================================
     HELPERS
  ========================================================= */
  setOrder: (order) => set({ order }),

  clearOrder: () => set({ order: null }),

  clearOrders: () =>
    set({
      orders: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }),
}));