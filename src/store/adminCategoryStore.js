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

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  return query.toString();
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

export const useAdminCategoryStore = create((set, get) => ({
  categories: [],
  category: null,
  isLoading: false,
  error: null,
  message: null,

  page: 1,
  limit: 20,
  total: 0,
  pages: 0,

  filters: {
    search: "",
    isActive: "",
    isFeatured: "",
    sortBy: "sortOrder",
    sortOrder: "asc",
  },

  clearMessages: () => set({ error: null, message: null }),
  clearCategory: () => set({ category: null }),

  setFilters: (newFilters = {}) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        isActive: "",
        isFeatured: "",
        sortBy: "sortOrder",
        sortOrder: "asc",
      },
    }),

  getCategoryOptions: () => {
    return safeArray(get().categories)
      .filter((item) => item?.isActive !== false)
      .map((item) => ({
        label: item?.name || "",
        value: item?._id || "",
        slug: item?.slug || "",
        code: item?.code || "",
        raw: item,
      }));
  },

  getSubcategoryOptions: (categoryId) => {
    const category = safeArray(get().categories).find((item) => item?._id === categoryId);

    return safeArray(category?.subcategories)
      .filter((item) => item?.isActive !== false)
      .map((item) => ({
        label: item?.name || "",
        value: item?._id || "",
        slug: item?.slug || "",
        code: item?.code || "",
        raw: item,
      }));
  },

  /* =========================================================
     GET ALL CATEGORIES (ADMIN)
  ========================================================= */
  fetchCategories: async (params = {}) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null });

      const state = get();
      const page = params.page || state.page;
      const limit = params.limit || state.limit;

      const query = buildQuery({
        page,
        limit,
        ...state.filters,
        ...params,
      });

      const res = await fetch(`${BACKEND}/api/categories/admin/all?${query}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch categories");

      set({
        categories: data.data || [],
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch categories",
      });
    }
  },

  /* =========================================================
     GET SINGLE CATEGORY
  ========================================================= */
  fetchCategoryById: async (id) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, category: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch category");

      set({
        category: data.data || null,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch category",
      });
    }
  },

  /* =========================================================
     CREATE CATEGORY
  ========================================================= */
  createCategory: async (payload) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create category");

      set({
        isLoading: false,
        message: data.message || "Category created successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to create category",
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE CATEGORY
  ========================================================= */
  updateCategory: async (id, payload) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update category");

      set({
        category: data.data || null,
        isLoading: false,
        message: data.message || "Category updated successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to update category",
      });
      throw error;
    }
  },

  /* =========================================================
     TOGGLE CATEGORY STATUS
  ========================================================= */
  toggleCategoryStatus: async (id) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/${id}/toggle-active`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to toggle category status");

      set({
        isLoading: false,
        message: data.message || "Category status updated successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to toggle category status",
      });
      throw error;
    }
  },

  /* =========================================================
     DELETE CATEGORY
  ========================================================= */
  deleteCategory: async (id) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete category");

      set({
        isLoading: false,
        message: data.message || "Category deleted successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to delete category",
      });
      throw error;
    }
  },

  /* =========================================================
     ADD SUBCATEGORY
  ========================================================= */
  addSubcategory: async (categoryId, payload) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/categories/admin/${categoryId}/subcategories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add subcategory");

      set({
        category: data.data || null,
        isLoading: false,
        message: data.message || "Subcategory added successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to add subcategory",
      });
      throw error;
    }
  },

  /* =========================================================
     UPDATE SUBCATEGORY
  ========================================================= */
  updateSubcategory: async (categoryId, subcategoryId, payload) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(
        `${BACKEND}/api/categories/admin/${categoryId}/subcategories/${subcategoryId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update subcategory");

      set({
        category: data.data || null,
        isLoading: false,
        message: data.message || "Subcategory updated successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to update subcategory",
      });
      throw error;
    }
  },

  /* =========================================================
     TOGGLE SUBCATEGORY STATUS
  ========================================================= */
  toggleSubcategoryStatus: async (categoryId, subcategoryId) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(
        `${BACKEND}/api/categories/admin/${categoryId}/subcategories/${subcategoryId}/toggle-active`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to toggle subcategory status");

      set({
        category: data.data || null,
        isLoading: false,
        message: data.message || "Subcategory status updated successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to toggle subcategory status",
      });
      throw error;
    }
  },

  /* =========================================================
     DELETE SUBCATEGORY
  ========================================================= */
  deleteSubcategory: async (categoryId, subcategoryId) => {
    if (!BACKEND) {
      return set({ error: "NEXT_PUBLIC_BACKEND_URL missing", isLoading: false });
    }

    try {
      set({ isLoading: true, error: null, message: null });

      const res = await fetch(
        `${BACKEND}/api/categories/admin/${categoryId}/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete subcategory");

      set({
        category: data.data || null,
        isLoading: false,
        message: data.message || "Subcategory deleted successfully",
      });

      await get().fetchCategories();
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to delete subcategory",
      });
      throw error;
    }
  },
}));