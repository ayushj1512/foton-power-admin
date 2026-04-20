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

const normalizePayload = (payload = {}) => ({
  title: payload.title || "",
  slug: payload.slug || "",
  content: payload.content || "",
  images: Array.isArray(payload.images) ? payload.images : [],
  hashtags: Array.isArray(payload.hashtags) ? payload.hashtags : [],
  productCodes: Array.isArray(payload.productCodes) ? payload.productCodes : [],
  isPublished:
    typeof payload.isPublished === "boolean" ? payload.isPublished : true,
});

export const useAdminBlogStore = create((set, get) => ({
  blogs: [],
  blog: null,

  isLoading: false,
  isSubmitting: false,
  error: null,
  message: null,

  clearMessages: () => set({ error: null, message: null }),

  clearBlog: () => set({ blog: null }),

  /* =========================================================
     GET ALL BLOGS
  ========================================================= */
  fetchBlogs: async () => {
    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/blogs`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      set({
        blogs: data.data || [],
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch blogs",
        isLoading: false,
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     GET SINGLE BLOG BY SLUG
  ========================================================= */
  fetchBlogBySlug: async (slug) => {
    try {
      set({ isLoading: true, error: null, message: null, blog: null });

      const res = await fetch(`${BACKEND}/api/blogs/${slug}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch blog");
      }

      set({
        blog: data.data || null,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch blog",
        isLoading: false,
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     CREATE BLOG
  ========================================================= */
  createBlog: async (payload) => {
    try {
      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/blogs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(normalizePayload(payload)),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create blog");
      }

      set((state) => ({
        blogs: [data.data, ...state.blogs],
        isSubmitting: false,
        message: data.message || "Blog created successfully",
      }));

      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to create blog",
        isSubmitting: false,
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     UPDATE BLOG
  ========================================================= */
  updateBlog: async (id, payload) => {
    try {
      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/blogs/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(normalizePayload(payload)),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update blog");
      }

      set((state) => ({
        blogs: state.blogs.map((item) =>
          item._id === id ? data.data : item
        ),
        blog: state.blog?._id === id ? data.data : state.blog,
        isSubmitting: false,
        message: data.message || "Blog updated successfully",
      }));

      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to update blog",
        isSubmitting: false,
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     DELETE BLOG
  ========================================================= */
  deleteBlog: async (id) => {
    try {
      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/blogs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      set((state) => ({
        blogs: state.blogs.filter((item) => item._id !== id),
        blog: state.blog?._id === id ? null : state.blog,
        isSubmitting: false,
        message: data.message || "Blog deleted successfully",
      }));

      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to delete blog",
        isSubmitting: false,
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     TOGGLE PUBLISH
  ========================================================= */
  togglePublishBlog: async (blog) => {
    try {
      const updatedPayload = {
        ...blog,
        isPublished: !blog.isPublished,
      };

      return await get().updateBlog(blog._id, updatedPayload);
    } catch (error) {
      set({
        error: error.message || "Failed to toggle publish status",
      });
      return { success: false, message: error.message };
    }
  },
}));