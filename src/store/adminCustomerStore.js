"use client";

import { create } from "zustand";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

const normalizeCustomer = (customer = {}) => ({
  ...customer,
  id: customer?._id || customer?.id || "",
  customerCode: customer?.customerCode || "",
  firebaseUid: customer?.firebaseUid || "",
  name: customer?.name || "",
  email: customer?.email || "",
  phone: customer?.phone || "",
  photoURL: customer?.photoURL || "",
  notes: customer?.notes || "",
  isActive: Boolean(customer?.isActive),
  addresses: Array.isArray(customer?.addresses) ? customer.addresses : [],
  defaultAddress: customer?.defaultAddress || null,
  createdAt: customer?.createdAt || null,
  updatedAt: customer?.updatedAt || null,
  lastLoginAt: customer?.lastLoginAt || null,
  lastOrderAt: customer?.lastOrderAt || null,
});

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
};

export const useAdminCustomerStore = create((set, get) => ({
  customers: [],
  customer: null,

  loading: false,
  loadingCustomer: false,
  submitting: false,

  error: null,
  successMessage: null,

  filters: {
    search: "",
    isActive: "all",
    page: 1,
    limit: 10,
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },

  /* =========================================================
     HELPERS
  ========================================================= */
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
  clearStatus: () => set({ error: null, successMessage: null }),

  clearCustomer: () => set({ customer: null }),
  resetCustomers: () =>
    set({
      customers: [],
      customer: null,
      error: null,
      successMessage: null,
      loading: false,
      loadingCustomer: false,
      submitting: false,
      filters: {
        search: "",
        isActive: "all",
        page: 1,
        limit: 10,
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
      },
    }),

  setFilters: (updates = {}) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
      },
    })),

  setSearch: (search = "") =>
    set((state) => ({
      filters: {
        ...state.filters,
        search,
        page: 1,
      },
    })),

  setStatusFilter: (isActive = "all") =>
    set((state) => ({
      filters: {
        ...state.filters,
        isActive,
        page: 1,
      },
    })),

  setPage: (page = 1) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    })),

  setLimit: (limit = 10) =>
    set((state) => ({
      filters: {
        ...state.filters,
        limit,
        page: 1,
      },
    })),

  /* =========================================================
     FETCH CUSTOMERS
  ========================================================= */
  fetchCustomers: async (customFilters = {}) => {
    set({ loading: true, error: null });

    try {
      const currentFilters = get().filters;
      const mergedFilters = {
        ...currentFilters,
        ...customFilters,
      };

      const params = {
        search: mergedFilters.search,
        page: mergedFilters.page,
        limit: mergedFilters.limit,
      };

      if (mergedFilters.isActive === "active") params.isActive = true;
      if (mergedFilters.isActive === "inactive") params.isActive = false;

      const query = buildQuery(params);
      const response = await fetch(`${API_BASE}/api/customers?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to fetch customers")
        );
      }

      const data = await response.json();

      set({
        loading: false,
        error: null,
        customers: Array.isArray(data?.customers)
          ? data.customers.map(normalizeCustomer)
          : [],
        filters: mergedFilters,
        pagination: {
          page: data?.pagination?.page || mergedFilters.page || 1,
          limit: data?.pagination?.limit || mergedFilters.limit || 10,
          total: data?.pagination?.total || 0,
          pages: data?.pagination?.pages || 1,
        },
      });

      return {
        success: true,
        customers: data?.customers || [],
      };
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to fetch customers",
      });

      return { success: false };
    }
  },

  /* =========================================================
     FETCH SINGLE CUSTOMER
  ========================================================= */
  fetchCustomerById: async (customerId) => {
    if (!customerId) return { success: false };

    set({ loadingCustomer: true, error: null });

    try {
      const response = await fetch(`${API_BASE}/api/customers/${customerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to fetch customer")
        );
      }

      const data = await response.json();

      set({
        loadingCustomer: false,
        error: null,
        customer: normalizeCustomer(data?.customer || {}),
      });

      return {
        success: true,
        customer: data?.customer,
      };
    } catch (error) {
      set({
        loadingCustomer: false,
        error: error.message || "Failed to fetch customer",
      });

      return { success: false };
    }
  },

  /* =========================================================
     FIND CUSTOMER
  ========================================================= */
  findCustomer: async ({ phone = "", email = "", firebaseUid = "", customerCode = "" } = {}) => {
    set({ loadingCustomer: true, error: null });

    try {
      const query = buildQuery({
        phone,
        email,
        firebaseUid,
        customerCode,
      });

      const response = await fetch(`${API_BASE}/api/customers/find?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to find customer")
        );
      }

      const data = await response.json();

      set({
        loadingCustomer: false,
        error: null,
        customer: normalizeCustomer(data?.customer || {}),
      });

      return {
        success: true,
        customer: data?.customer,
      };
    } catch (error) {
      set({
        loadingCustomer: false,
        error: error.message || "Failed to find customer",
      });

      return { success: false };
    }
  },

  /* =========================================================
     UPDATE CUSTOMER
  ========================================================= */
  updateCustomer: async (customerId, payload = {}) => {
    if (!customerId) return { success: false };

    set({ submitting: true, error: null, successMessage: null });

    try {
      const response = await fetch(`${API_BASE}/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to update customer")
        );
      }

      const data = await response.json();
      const updatedCustomer = normalizeCustomer(data?.customer || {});

      set((state) => ({
        submitting: false,
        error: null,
        successMessage: data?.message || "Customer updated successfully",
        customer: updatedCustomer,
        customers: state.customers.map((item) =>
          item.id === updatedCustomer.id ? updatedCustomer : item
        ),
      }));

      return {
        success: true,
        customer: updatedCustomer,
      };
    } catch (error) {
      set({
        submitting: false,
        error: error.message || "Failed to update customer",
        successMessage: null,
      });

      return { success: false };
    }
  },

  /* =========================================================
     ADD ADDRESS
  ========================================================= */
  addCustomerAddress: async (customerId, payload = {}) => {
    if (!customerId) return { success: false };

    set({ submitting: true, error: null, successMessage: null });

    try {
      const response = await fetch(
        `${API_BASE}/api/customers/${customerId}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to save address")
        );
      }

      const data = await response.json();
      const updatedCustomer = normalizeCustomer(data?.customer || {});

      set((state) => ({
        submitting: false,
        error: null,
        successMessage: data?.message || "Address saved successfully",
        customer: updatedCustomer,
        customers: state.customers.map((item) =>
          item.id === updatedCustomer.id ? updatedCustomer : item
        ),
      }));

      return {
        success: true,
        customer: updatedCustomer,
      };
    } catch (error) {
      set({
        submitting: false,
        error: error.message || "Failed to save address",
        successMessage: null,
      });

      return { success: false };
    }
  },
}));