"use client";

import { create } from "zustand";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const buildUrl = (path) => `${API_BASE}${path}`;

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getErrorMessage = (data, fallback = "Something went wrong") => {
  return data?.message || data?.error || fallback;
};

export const useAdminShiprocketStore = create((set, get) => ({
  pickupLocations: [],
  selectedCourier: null,
  serviceability: null,
  tracking: null,
  bookingResult: null,
  cancelResult: null,

  loading: false,
  pickupLoading: false,
  serviceabilityLoading: false,
  bookingLoading: false,
  trackingLoading: false,
  cancelLoading: false,

  error: null,

  resetShiprocketState: () =>
    set({
      selectedCourier: null,
      serviceability: null,
      tracking: null,
      bookingResult: null,
      cancelResult: null,
      error: null,
    }),

  clearShiprocketError: () => set({ error: null }),

  getAuthHeaders: () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("adminToken")
        : null;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  fetchPickupLocations: async () => {
    set({
      pickupLoading: true,
      loading: true,
      error: null,
    });

    try {
      const response = await fetch(buildUrl("/api/shiprocket/pickup-locations"), {
        method: "GET",
        headers: get().getAuthHeaders(),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch pickup locations"));
      }

      set({
        pickupLocations:
          data?.data?.data ||
          data?.data?.pickup_locations ||
          data?.data ||
          [],
        pickupLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        pickupLoading: false,
        loading: false,
        error: error.message || "Failed to fetch pickup locations",
      });
      throw error;
    }
  },

  checkServiceability: async (orderId, payload = {}) => {
    set({
      serviceabilityLoading: true,
      loading: true,
      error: null,
      serviceability: null,
      selectedCourier: null,
    });

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/serviceability`),
        {
          method: "POST",
          headers: get().getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to check serviceability"));
      }

      set({
        serviceability: data?.data || null,
        selectedCourier: data?.recommendedCourier || null,
        serviceabilityLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        serviceabilityLoading: false,
        loading: false,
        error: error.message || "Failed to check serviceability",
      });
      throw error;
    }
  },

  autoBookOrder: async (orderId, payload = {}) => {
    set({
      bookingLoading: true,
      loading: true,
      error: null,
      bookingResult: null,
    });

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/auto-book`),
        {
          method: "POST",
          headers: get().getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to auto book shipment"));
      }

      set({
        bookingResult: data,
        tracking: data?.shiprocket?.tracking || null,
        bookingLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        bookingLoading: false,
        loading: false,
        error: error.message || "Failed to auto book shipment",
      });
      throw error;
    }
  },

  manualBookOrder: async (orderId, payload = {}) => {
    set({
      bookingLoading: true,
      loading: true,
      error: null,
      bookingResult: null,
    });

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/manual-book`),
        {
          method: "POST",
          headers: get().getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to manually book shipment"));
      }

      set({
        bookingResult: data,
        bookingLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        bookingLoading: false,
        loading: false,
        error: error.message || "Failed to manually book shipment",
      });
      throw error;
    }
  },

  syncTracking: async (orderId) => {
    set({
      trackingLoading: true,
      loading: true,
      error: null,
    });

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/sync-tracking`),
        {
          method: "POST",
          headers: get().getAuthHeaders(),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to sync tracking"));
      }

      set({
        tracking: data?.tracking || data,
        trackingLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        trackingLoading: false,
        loading: false,
        error: error.message || "Failed to sync tracking",
      });
      throw error;
    }
  },

  cancelShipment: async (ids = []) => {
    set({
      cancelLoading: true,
      loading: true,
      error: null,
      cancelResult: null,
    });

    try {
      const response = await fetch(buildUrl("/api/shiprocket/cancel"), {
        method: "POST",
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to cancel shipment"));
      }

      set({
        cancelResult: data,
        cancelLoading: false,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        cancelLoading: false,
        loading: false,
        error: error.message || "Failed to cancel shipment",
      });
      throw error;
    }
  },
}));