"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getItemId = (item = {}) =>
  String(
    item?._id ||
      item?.id ||
      item?.publicId ||
      item?.public_id ||
      item?.assetId ||
      item?.asset_id ||
      item?.url ||
      item?.secureUrl ||
      item?.secure_url ||
      ""
  );

const getUniqueItems = (items = []) =>
  Array.from(
    new Map(
      (Array.isArray(items) ? items : [])
        .filter(Boolean)
        .map((item) => [getItemId(item), item])
        .filter(([id]) => id)
    ).values()
  );

const buildQuery = (params = {}) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    search.set(key, String(value));
  });

  return search.toString();
};

export const useAdminMediaStore = create((set, get) => ({
  items: [],
  loading: false,
  loadingMore: false,
  uploading: false,
  deleting: false,
  error: null,
  message: null,

  resourceType: "image",
  limit: 24,
  nextCursor: null,
  hasMore: true,
  initialized: false,

  clearMessages: () =>
    set({
      error: null,
      message: null,
    }),

  resetMediaState: () =>
    set({
      items: [],
      loading: false,
      loadingMore: false,
      error: null,
      message: null,
      nextCursor: null,
      hasMore: true,
      initialized: false,
    }),

  fetchMedia: async ({
    resourceType = "image",
    limit = 24,
    loadMore = false,
  } = {}) => {
    const state = get();

    if (loadMore) {
      if (state.loading || state.loadingMore || !state.hasMore) return;
      set({ loadingMore: true, error: null });
    } else {
      set({
        loading: true,
        loadingMore: false,
        error: null,
        message: null,
        items: [],
        nextCursor: null,
        hasMore: true,
        initialized: false,
        resourceType,
        limit,
      });
    }

    try {
      const cursor = loadMore ? state.nextCursor : null;

      const query = buildQuery({
        resourceType,
        limit,
        nextCursor: cursor,
      });

      const res = await fetch(`${BACKEND}/api/cloudinary/media?${query}`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch media");
      }

      const incomingItems = Array.isArray(data?.items) ? data.items : [];

      set((prev) => ({
        items: loadMore
          ? getUniqueItems([...(prev.items || []), ...incomingItems])
          : getUniqueItems(incomingItems),
        loading: false,
        loadingMore: false,
        initialized: true,
        resourceType,
        limit,
        nextCursor: data?.nextCursor || null,
        hasMore: Boolean(data?.hasMore),
        error: null,
      }));
    } catch (error) {
      const msg = error?.message || "Failed to fetch media";
      set({
        loading: false,
        loadingMore: false,
        initialized: true,
        error: msg,
      });
      toast.error(msg);
    }
  },

  refreshMedia: async () => {
    const { resourceType, limit } = get();
    await get().fetchMedia({
      resourceType,
      limit,
      loadMore: false,
    });
  },

  loadMoreMedia: async () => {
    const { resourceType, limit, hasMore, loading, loadingMore } = get();

    if (!hasMore || loading || loadingMore) return;

    await get().fetchMedia({
      resourceType,
      limit,
      loadMore: true,
    });
  },

  uploadSingleMedia: async ({ file, publicId = "" }) => {
    if (!file) {
      const msg = "File is required";
      set({ error: msg });
      toast.error(msg);
      return null;
    }

    set({ uploading: true, error: null, message: null });

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (publicId) formData.append("publicId", publicId);

      const res = await fetch(`${BACKEND}/api/cloudinary/upload`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Upload failed");
      }

      const uploadedFile = data?.file || null;

      set((state) => ({
        uploading: false,
        message: data?.message || "Uploaded successfully",
        items: uploadedFile
          ? getUniqueItems([uploadedFile, ...(state.items || [])])
          : state.items,
      }));

      toast.success(data?.message || "Uploaded successfully");
      return uploadedFile;
    } catch (error) {
      const msg = error?.message || "Upload failed";
      set({ uploading: false, error: msg });
      toast.error(msg);
      return null;
    }
  },

  uploadMedia: async ({ files = [] }) => {
    if (!Array.isArray(files) || files.length === 0) {
      const msg = "Files are required";
      set({ error: msg });
      toast.error(msg);
      return [];
    }

    set({ uploading: true, error: null, message: null });

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch(`${BACKEND}/api/cloudinary/upload-multiple`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Multiple upload failed");
      }

      const uploadedFiles = Array.isArray(data?.files) ? data.files : [];

      set((state) => ({
        uploading: false,
        message: data?.message || "Files uploaded successfully",
        items: getUniqueItems([...uploadedFiles, ...(state.items || [])]),
      }));

      toast.success(data?.message || "Files uploaded successfully");
      return uploadedFiles;
    } catch (error) {
      const msg = error?.message || "Multiple upload failed";
      set({ uploading: false, error: msg });
      toast.error(msg);
      return [];
    }
  },

  deleteMedia: async ({ publicId, resourceType = "image" }) => {
    if (!publicId) {
      const msg = "publicId is required";
      set({ error: msg });
      toast.error(msg);
      return false;
    }

    set({ deleting: true, error: null, message: null });

    try {
      const res = await fetch(`${BACKEND}/api/cloudinary/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          publicId,
          resourceType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed");
      }

      set((state) => ({
        deleting: false,
        message: data?.message || "File deleted successfully",
        items: (state.items || []).filter(
          (item) =>
            String(item?.publicId || item?.public_id || "") !== String(publicId)
        ),
      }));

      toast.success(data?.message || "File deleted successfully");
      return true;
    } catch (error) {
      const msg = error?.message || "Delete failed";
      set({ deleting: false, error: msg });
      toast.error(msg);
      return false;
    }
  },

  setItems: (items = []) => {
    set({
      items: Array.isArray(items) ? getUniqueItems(items) : [],
    });
  },

  addItem: (item) => {
    if (!item) return;
    set((state) => ({
      items: getUniqueItems([item, ...(state.items || [])]),
    }));
  },

  addItems: (newItems = []) => {
    if (!Array.isArray(newItems) || !newItems.length) return;
    set((state) => ({
      items: getUniqueItems([...newItems, ...(state.items || [])]),
    }));
  },

  removeItemByPublicId: (publicId) => {
    set((state) => ({
      items: (state.items || []).filter(
        (item) =>
          String(item?.publicId || item?.public_id || "") !== String(publicId)
      ),
    }));
  },
}));