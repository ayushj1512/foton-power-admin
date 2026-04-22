"use client";

import { create } from "zustand";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const buildUrl = (path = "") => `${API_BASE}${path}`;

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getStoredAdminToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("adminToken") || "";
};

const getErrorMessage = (data, fallback = "Something went wrong") => {
  return (
    data?.message ||
    data?.error?.message ||
    data?.error ||
    fallback
  );
};

const getAuthHeaders = () => {
  const token = getStoredAdminToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useAdminShiprocketStore = create((set, get) => ({
  pickupLocations: [],
  pickupLoading: false,
  pickupError: "",

  selectedCourierByOrder: {},
  serviceabilityByOrder: {},
  trackingByOrder: {},
  bookingResultByOrder: {},
  cancelResult: null,

  loadingByOrder: {},
  serviceabilityLoadingByOrder: {},
  bookingLoadingByOrder: {},
  trackingLoadingByOrder: {},
  errorByOrder: {},
  successByOrder: {},

  loading: false,
  cancelLoading: false,
  error: null,

  resetShiprocketState: () =>
    set({
      pickupLocations: [],
      pickupLoading: false,
      pickupError: "",
      selectedCourierByOrder: {},
      serviceabilityByOrder: {},
      trackingByOrder: {},
      bookingResultByOrder: {},
      cancelResult: null,
      loadingByOrder: {},
      serviceabilityLoadingByOrder: {},
      bookingLoadingByOrder: {},
      trackingLoadingByOrder: {},
      errorByOrder: {},
      successByOrder: {},
      loading: false,
      cancelLoading: false,
      error: null,
    }),

  clearShiprocketError: () => set({ error: null }),

  clearOrderState: (orderId) => {
    if (!orderId) return;

    set((state) => {
      const nextSelectedCourier = { ...state.selectedCourierByOrder };
      const nextServiceability = { ...state.serviceabilityByOrder };
      const nextTracking = { ...state.trackingByOrder };
      const nextBooking = { ...state.bookingResultByOrder };
      const nextLoading = { ...state.loadingByOrder };
      const nextServiceabilityLoading = {
        ...state.serviceabilityLoadingByOrder,
      };
      const nextBookingLoading = { ...state.bookingLoadingByOrder };
      const nextTrackingLoading = { ...state.trackingLoadingByOrder };
      const nextError = { ...state.errorByOrder };
      const nextSuccess = { ...state.successByOrder };

      delete nextSelectedCourier[orderId];
      delete nextServiceability[orderId];
      delete nextTracking[orderId];
      delete nextBooking[orderId];
      delete nextLoading[orderId];
      delete nextServiceabilityLoading[orderId];
      delete nextBookingLoading[orderId];
      delete nextTrackingLoading[orderId];
      delete nextError[orderId];
      delete nextSuccess[orderId];

      return {
        selectedCourierByOrder: nextSelectedCourier,
        serviceabilityByOrder: nextServiceability,
        trackingByOrder: nextTracking,
        bookingResultByOrder: nextBooking,
        loadingByOrder: nextLoading,
        serviceabilityLoadingByOrder: nextServiceabilityLoading,
        bookingLoadingByOrder: nextBookingLoading,
        trackingLoadingByOrder: nextTrackingLoading,
        errorByOrder: nextError,
        successByOrder: nextSuccess,
      };
    });
  },

  getOrderLoading: (orderId) => Boolean(get().loadingByOrder?.[orderId]),
  getOrderError: (orderId) => get().errorByOrder?.[orderId] || "",
  getOrderSuccess: (orderId) => get().successByOrder?.[orderId] || "",
  getSelectedCourier: (orderId) =>
    get().selectedCourierByOrder?.[orderId] || null,
  getServiceability: (orderId) =>
    get().serviceabilityByOrder?.[orderId] || null,
  getTracking: (orderId) => get().trackingByOrder?.[orderId] || null,
  getBookingResult: (orderId) =>
    get().bookingResultByOrder?.[orderId] || null,

  fetchPickupLocations: async () => {
    set({
      pickupLoading: true,
      loading: true,
      pickupError: "",
      error: null,
    });

    try {
      const response = await fetch(buildUrl("/api/shiprocket/pickup-locations"), {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          getErrorMessage(data, "Failed to fetch pickup locations")
        );
      }

      const pickupLocations = Array.isArray(
        data?.data?.data?.shipping_address
      )
        ? data.data.data.shipping_address
        : Array.isArray(data?.data?.pickup_locations)
        ? data.data.pickup_locations
        : Array.isArray(data?.data)
        ? data.data
        : [];

      set({
        pickupLocations,
        pickupLoading: false,
        loading: false,
        pickupError: "",
      });

      return {
        success: true,
        data,
        pickupLocations,
      };
    } catch (error) {
      set({
        pickupLoading: false,
        loading: false,
        pickupError: error.message || "Failed to fetch pickup locations",
        error: error.message || "Failed to fetch pickup locations",
      });
      throw error;
    }
  },

  checkServiceability: async (orderId, payload = {}) => {
    if (!orderId) {
      throw new Error("orderId is required");
    }

    set((state) => ({
      loading: true,
      error: null,
      loadingByOrder: {
        ...state.loadingByOrder,
        [orderId]: true,
      },
      serviceabilityLoadingByOrder: {
        ...state.serviceabilityLoadingByOrder,
        [orderId]: true,
      },
      errorByOrder: {
        ...state.errorByOrder,
        [orderId]: "",
      },
      successByOrder: {
        ...state.successByOrder,
        [orderId]: "",
      },
    }));

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/serviceability`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          getErrorMessage(data, "Failed to check serviceability")
        );
      }

      set((state) => ({
        serviceabilityByOrder: {
          ...state.serviceabilityByOrder,
          [orderId]: data?.data || null,
        },
        selectedCourierByOrder: {
          ...state.selectedCourierByOrder,
          [orderId]: data?.recommendedCourier || null,
        },
        loading: false,
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        serviceabilityLoadingByOrder: {
          ...state.serviceabilityLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: "",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "Serviceability checked successfully",
        },
      }));

      return data;
    } catch (error) {
      set((state) => ({
        loading: false,
        error: error.message || "Failed to check serviceability",
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        serviceabilityLoadingByOrder: {
          ...state.serviceabilityLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: error.message || "Failed to check serviceability",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "",
        },
      }));
      throw error;
    }
  },

  autoBookOrder: async (orderId, payload = {}) => {
    if (!orderId) {
      throw new Error("orderId is required");
    }

    set((state) => ({
      loading: true,
      error: null,
      loadingByOrder: {
        ...state.loadingByOrder,
        [orderId]: true,
      },
      bookingLoadingByOrder: {
        ...state.bookingLoadingByOrder,
        [orderId]: true,
      },
      errorByOrder: {
        ...state.errorByOrder,
        [orderId]: "",
      },
      successByOrder: {
        ...state.successByOrder,
        [orderId]: "",
      },
    }));

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/auto-book`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          getErrorMessage(data, "Failed to auto book shipment")
        );
      }

      set((state) => ({
        bookingResultByOrder: {
          ...state.bookingResultByOrder,
          [orderId]: data,
        },
        trackingByOrder: {
          ...state.trackingByOrder,
          [orderId]: data?.tracking || data?.shiprocket?.tracking || null,
        },
        loading: false,
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        bookingLoadingByOrder: {
          ...state.bookingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: "",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "Order booked successfully",
        },
      }));

      return data;
    } catch (error) {
      set((state) => ({
        loading: false,
        error: error.message || "Failed to auto book shipment",
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        bookingLoadingByOrder: {
          ...state.bookingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: error.message || "Failed to auto book shipment",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "",
        },
      }));
      throw error;
    }
  },

  manualBookOrder: async (orderId, payload = {}) => {
    if (!orderId) {
      throw new Error("orderId is required");
    }

    set((state) => ({
      loading: true,
      error: null,
      loadingByOrder: {
        ...state.loadingByOrder,
        [orderId]: true,
      },
      bookingLoadingByOrder: {
        ...state.bookingLoadingByOrder,
        [orderId]: true,
      },
      errorByOrder: {
        ...state.errorByOrder,
        [orderId]: "",
      },
      successByOrder: {
        ...state.successByOrder,
        [orderId]: "",
      },
    }));

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/manual-book`),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          getErrorMessage(data, "Failed to manually book shipment")
        );
      }

      set((state) => ({
        bookingResultByOrder: {
          ...state.bookingResultByOrder,
          [orderId]: data,
        },
        loading: false,
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        bookingLoadingByOrder: {
          ...state.bookingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: "",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "Manual booking completed successfully",
        },
      }));

      return data;
    } catch (error) {
      set((state) => ({
        loading: false,
        error: error.message || "Failed to manually book shipment",
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        bookingLoadingByOrder: {
          ...state.bookingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: error.message || "Failed to manually book shipment",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "",
        },
      }));
      throw error;
    }
  },

  syncTracking: async (orderId) => {
    if (!orderId) {
      throw new Error("orderId is required");
    }

    set((state) => ({
      loading: true,
      error: null,
      loadingByOrder: {
        ...state.loadingByOrder,
        [orderId]: true,
      },
      trackingLoadingByOrder: {
        ...state.trackingLoadingByOrder,
        [orderId]: true,
      },
      errorByOrder: {
        ...state.errorByOrder,
        [orderId]: "",
      },
      successByOrder: {
        ...state.successByOrder,
        [orderId]: "",
      },
    }));

    try {
      const response = await fetch(
        buildUrl(`/api/shiprocket/orders/${orderId}/sync-tracking`),
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(getErrorMessage(data, "Failed to sync tracking"));
      }

      set((state) => ({
        trackingByOrder: {
          ...state.trackingByOrder,
          [orderId]: data?.tracking || data,
        },
        bookingResultByOrder: {
          ...state.bookingResultByOrder,
          [orderId]:
            data?.order
              ? {
                  ...(state.bookingResultByOrder?.[orderId] || {}),
                  order: data.order,
                }
              : state.bookingResultByOrder?.[orderId] || null,
        },
        loading: false,
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        trackingLoadingByOrder: {
          ...state.trackingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: "",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "Tracking synced successfully",
        },
      }));

      return data;
    } catch (error) {
      set((state) => ({
        loading: false,
        error: error.message || "Failed to sync tracking",
        loadingByOrder: {
          ...state.loadingByOrder,
          [orderId]: false,
        },
        trackingLoadingByOrder: {
          ...state.trackingLoadingByOrder,
          [orderId]: false,
        },
        errorByOrder: {
          ...state.errorByOrder,
          [orderId]: error.message || "Failed to sync tracking",
        },
        successByOrder: {
          ...state.successByOrder,
          [orderId]: "",
        },
      }));
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok || !data?.success) {
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