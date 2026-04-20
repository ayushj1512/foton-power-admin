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
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      query.append(key, value);
    }
  });

  return query.toString();
};

const getProductImage = (product) => {
  if (!product) return "";
  if (Array.isArray(product.media) && product.media.length > 0) {
    const primary =
      product.media.find((item) => item?.isPrimary && item?.url) ||
      product.media.find((item) => item?.url);

    if (primary?.url) return primary.url;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const image = product.images.find((item) => item?.url) || product.images[0];
    if (image?.url) return image.url;
  }

  if (product.image?.url) return product.image.url;
  if (typeof product.image === "string") return product.image;

  return "";
};

export const useAdminProductStore = create((set, get) => ({
  products: [],
  product: null,

  isLoading: false,
  isSubmitting: false,
  error: null,
  message: null,

  page: 1,
  limit: 100,
  total: 0,
  pages: 0,

  filters: {
    search: "",
    status: "",
    category: "",
    collection: "",
    featured: "",
    bestSeller: "",
    minPrice: "",
    maxPrice: "",
    inStock: "",
    color: "",
    size: "",
    sort: "newest",
  },

  clearMessages: () => set({ error: null, message: null }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        status: "",
        category: "",
        collection: "",
        featured: "",
        bestSeller: "",
        minPrice: "",
        maxPrice: "",
        inStock: "",
        color: "",
        size: "",
        sort: "newest",
      },
      page: 1,
    }),

  fetchProducts: async (params = {}) => {
    try {
      if (!BACKEND) {
        return set({
          error: "NEXT_PUBLIC_BACKEND_URL missing",
          isLoading: false,
        });
      }

      set({ isLoading: true, error: null, message: null });

      const state = get();

      const page = params.page || state.page || 1;
      const limit = params.limit || state.limit || 100;

      const finalParams = {
        ...state.filters,
        ...params,
        page,
        limit,
      };

      const query = buildQuery(finalParams);

      const res = await fetch(`${BACKEND}/api/products/admin/all?${query}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      const products = (data.products || []).map((item) => ({
        ...item,
        displayImage: getProductImage(item),
      }));

      set({
        products,
        total: data.pagination?.total || 0,
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || limit,
        pages: data.pagination?.pages || 0,
        isLoading: false,
      });

      return {
        success: true,
        products,
        pagination: data.pagination || {},
      };
    } catch (error) {
      set({
        error: error.message || "Failed to fetch products",
        isLoading: false,
      });

      return {
        success: false,
        message: error.message || "Failed to fetch products",
        products: [],
      };
    }
  },

  fetchAllProducts: async (params = {}) => {
    try {
      if (!BACKEND) {
        set({
          error: "NEXT_PUBLIC_BACKEND_URL missing",
          isLoading: false,
        });
        return {
          success: false,
          products: [],
          message: "NEXT_PUBLIC_BACKEND_URL missing",
        };
      }

      set({ isLoading: true, error: null, message: null });

      const state = get();
      const limit = params.limit || state.limit || 100;

      let page = 1;
      let pages = 1;
      let total = 0;
      let allProducts = [];

      do {
        const finalParams = {
          ...state.filters,
          ...params,
          page,
          limit,
        };

        const query = buildQuery(finalParams);

        const res = await fetch(`${BACKEND}/api/products/admin/all?${query}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        const batch = (data.products || []).map((item) => ({
          ...item,
          displayImage: getProductImage(item),
        }));

        allProducts = [...allProducts, ...batch];
        total = data.pagination?.total || allProducts.length;
        pages = data.pagination?.pages || 1;
        page += 1;
      } while (page <= pages);

      set({
        products: allProducts,
        total,
        page: 1,
        limit,
        pages,
        isLoading: false,
      });

      return {
        success: true,
        products: allProducts,
        total,
        pages,
      };
    } catch (error) {
      set({
        error: error.message || "Failed to fetch all products",
        isLoading: false,
      });

      return {
        success: false,
        message: error.message || "Failed to fetch all products",
        products: [],
      };
    }
  },

  fetchProductById: async (id) => {
    try {
      if (!BACKEND) {
        return set({
          error: "NEXT_PUBLIC_BACKEND_URL missing",
          isLoading: false,
        });
      }

      if (!id) return;

      set({ isLoading: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/products/admin/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      set({
        product: data.product
          ? {
              ...data.product,
              displayImage: getProductImage(data.product),
            }
          : null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch product",
        isLoading: false,
      });
    }
  },

  createProduct: async (productData) => {
    try {
      if (!BACKEND) {
        return {
          success: false,
          message: "NEXT_PUBLIC_BACKEND_URL missing",
        };
      }

      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/products/admin`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      set({
        product: data.product
          ? {
              ...data.product,
              displayImage: getProductImage(data.product),
            }
          : null,
        message: data.message || "Product created successfully",
        isSubmitting: false,
      });

      await get().fetchAllProducts({ limit: 100 });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message || "Failed to create product",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      if (!BACKEND) {
        return {
          success: false,
          message: "NEXT_PUBLIC_BACKEND_URL missing",
        };
      }

      if (!id) {
        return {
          success: false,
          message: "Product id is required",
        };
      }

      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/products/admin/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      set({
        product: data.product
          ? {
              ...data.product,
              displayImage: getProductImage(data.product),
            }
          : null,
        message: data.message || "Product updated successfully",
        isSubmitting: false,
      });

      await get().fetchAllProducts({ limit: 100 });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message || "Failed to update product",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      if (!BACKEND) {
        return {
          success: false,
          message: "NEXT_PUBLIC_BACKEND_URL missing",
        };
      }

      if (!id) {
        return {
          success: false,
          message: "Product id is required",
        };
      }

      set({ isSubmitting: true, error: null, message: null });

      const res = await fetch(`${BACKEND}/api/products/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      set({
        message: data.message || "Product deleted successfully",
        isSubmitting: false,
        product: null,
      });

      await get().fetchAllProducts({ limit: 100 });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message || "Failed to delete product",
        isSubmitting: false,
      });

      return { success: false, message: error.message };
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setProduct: (product) =>
    set({
      product: product
        ? { ...product, displayImage: getProductImage(product) }
        : null,
    }),
  clearProduct: () => set({ product: null }),
}));