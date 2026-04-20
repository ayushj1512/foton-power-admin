"use client";

import { create } from "zustand";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const buildUrl = (path = "") => `${API_BASE}/api/collections${path}`;

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return { "Content-Type": "application/json" };
  }

  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getErrorMessage = async (res, fallback) => {
  try {
    const data = await res.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
};

export const useAdminCollectionStore = create((set, get) => ({
  collections: [],
  activeCollections: [],
  selectedCollection: null,

  isLoading: false,
  isSubmitting: false,
  error: "",
  success: "",

  clearMessages: () => set({ error: "", success: "" }),

  resetSelectedCollection: () => set({ selectedCollection: null }),

  resetCollections: () =>
    set({
      collections: [],
      activeCollections: [],
      selectedCollection: null,
      error: "",
      success: "",
    }),

  /* -----------------------------------------
     GET ALL
  ----------------------------------------- */
  fetchCollections: async (params = {}) => {
    try {
      set({ isLoading: true, error: "" });

      const searchParams = new URLSearchParams();

      Object.entries(params || {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.set(key, value);
      });

      const query = searchParams.toString();
      const res = await fetch(buildUrl(query ? `?${query}` : ""), {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to fetch collections"));
      }

      const data = await res.json();

      set({
        collections: Array.isArray(data?.collections) ? data.collections : [],
        isLoading: false,
      });

      return {
        success: true,
        collections: Array.isArray(data?.collections) ? data.collections : [],
        pagination: data?.pagination || null,
      };
    } catch (error) {
      set({
        error: error.message || "Failed to fetch collections",
        isLoading: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     GET ACTIVE
  ----------------------------------------- */
  fetchActiveCollections: async () => {
    try {
      set({ isLoading: true, error: "" });

      const res = await fetch(buildUrl("/active"), {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to fetch active collections")
        );
      }

      const data = await res.json();

      set({
        activeCollections: Array.isArray(data?.collections) ? data.collections : [],
        isLoading: false,
      });

      return {
        success: true,
        collections: Array.isArray(data?.collections) ? data.collections : [],
      };
    } catch (error) {
      set({
        error: error.message || "Failed to fetch active collections",
        isLoading: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     GET SINGLE
  ----------------------------------------- */
  fetchCollectionByIdOrSlug: async (idOrSlug) => {
    try {
      if (!idOrSlug) {
        throw new Error("Collection id or slug is required");
      }

      set({ isLoading: true, error: "" });

      const res = await fetch(buildUrl(`/${idOrSlug}`), {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to fetch collection"));
      }

      const data = await res.json();

      set({
        selectedCollection: data?.collection || null,
        isLoading: false,
      });

      return { success: true, collection: data?.collection || null };
    } catch (error) {
      set({
        error: error.message || "Failed to fetch collection",
        isLoading: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     CREATE
  ----------------------------------------- */
  createCollection: async (payload = {}) => {
    try {
      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(""), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to create collection"));
      }

      const data = await res.json();
      const created = data?.collection;

      set((state) => ({
        collections: created ? [created, ...state.collections] : state.collections,
        activeCollections:
          created && created.isActive
            ? [created, ...state.activeCollections]
            : state.activeCollections,
        success: data?.message || "Collection created successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: created };
    } catch (error) {
      set({
        error: error.message || "Failed to create collection",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     UPDATE
  ----------------------------------------- */
  updateCollection: async (id, payload = {}) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}`), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to update collection"));
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: updated?.isActive
          ? [
              updated,
              ...state.activeCollections.filter((item) => item._id !== updated._id),
            ]
          : state.activeCollections.filter((item) => item._id !== updated?._id),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Collection updated successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to update collection",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     DELETE
  ----------------------------------------- */
  deleteCollection: async (id) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to delete collection"));
      }

      const data = await res.json();

      set((state) => ({
        collections: state.collections.filter((item) => item._id !== id),
        activeCollections: state.activeCollections.filter((item) => item._id !== id),
        selectedCollection:
          state.selectedCollection?._id === id ? null : state.selectedCollection,
        success: data?.message || "Collection deleted successfully",
        isSubmitting: false,
      }));

      return { success: true };
    } catch (error) {
      set({
        error: error.message || "Failed to delete collection",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     TOGGLES
  ----------------------------------------- */
  toggleCollectionStatus: async (id) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}/toggle-status`), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to toggle collection status")
        );
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: updated?.isActive
          ? [
              updated,
              ...state.activeCollections.filter((item) => item._id !== updated._id),
            ]
          : state.activeCollections.filter((item) => item._id !== updated?._id),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Collection status updated successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to toggle collection status",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  toggleCollectionFeatured: async (id) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}/toggle-featured`), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to toggle collection featured")
        );
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: state.activeCollections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Collection featured updated successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to toggle collection featured",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  toggleCollectionHomepage: async (id) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}/toggle-homepage`), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to toggle collection homepage")
        );
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: state.activeCollections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Collection homepage updated successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to toggle collection homepage",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  /* -----------------------------------------
     PRODUCT CODES
  ----------------------------------------- */
  addProductCodesToCollection: async (id, productCodes = []) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}/add-product-codes`), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productCodes }),
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to add product codes to collection")
        );
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: state.activeCollections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Product codes added successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to add product codes",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  removeProductCodesFromCollection: async (id, productCodes = []) => {
    try {
      if (!id) throw new Error("Collection id is required");

      set({ isSubmitting: true, error: "", success: "" });

      const res = await fetch(buildUrl(`/${id}/remove-product-codes`), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productCodes }),
      });

      if (!res.ok) {
        throw new Error(
          await getErrorMessage(
            res,
            "Failed to remove product codes from collection"
          )
        );
      }

      const data = await res.json();
      const updated = data?.collection;

      set((state) => ({
        collections: state.collections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        activeCollections: state.activeCollections.map((item) =>
          item._id === updated?._id ? updated : item
        ),
        selectedCollection:
          state.selectedCollection?._id === updated?._id
            ? updated
            : state.selectedCollection,
        success: data?.message || "Product codes removed successfully",
        isSubmitting: false,
      }));

      return { success: true, collection: updated };
    } catch (error) {
      set({
        error: error.message || "Failed to remove product codes",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },
}));