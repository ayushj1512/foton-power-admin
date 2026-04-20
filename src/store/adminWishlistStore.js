import { create } from "zustand";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const buildUrl = (path) => `${BACKEND_URL}${path}`;

const normalizeCode = (value) => String(value || "").trim().toUpperCase();

const groupWishlistByCustomer = (items = []) => {
  return items.reduce((acc, item) => {
    const customerCode = normalizeCode(item?.customerCode);
    if (!customerCode) return acc;

    if (!acc[customerCode]) {
      acc[customerCode] = [];
    }

    acc[customerCode].push(item);
    return acc;
  }, {});
};

export const useAdminWishlistStore = create((set, get) => ({
  wishlist: [],
  groupedWishlist: {},
  selectedCustomerWishlist: [],
  selectedCustomerCode: "",
  isWishlisted: false,
  isLoading: false,
  actionLoading: false,
  error: null,
  message: null,

  /* =========================================================
     HELPERS
  ========================================================= */
  clearMessages: () =>
    set({
      error: null,
      message: null,
    }),

  resetWishlistState: () =>
    set({
      wishlist: [],
      groupedWishlist: {},
      selectedCustomerWishlist: [],
      selectedCustomerCode: "",
      isWishlisted: false,
      isLoading: false,
      actionLoading: false,
      error: null,
      message: null,
    }),

  /* =========================================================
     GETTERS
  ========================================================= */
  getWishlistStats: () => {
    const { wishlist, groupedWishlist } = get();

    return {
      totalItems: wishlist.length,
      totalCustomers: Object.keys(groupedWishlist).length,
    };
  },

  getCustomerGroupedWishlist: (customerCode) => {
    const { groupedWishlist } = get();
    const normalizedCustomerCode = normalizeCode(customerCode);
    return groupedWishlist[normalizedCustomerCode] || [];
  },

  /* =========================================================
     GET ALL WISHLIST
     requires: GET /api/wishlist/all
  ========================================================= */
  fetchAllWishlist: async () => {
    try {
      set({
        isLoading: true,
        error: null,
        message: null,
      });

      const res = await fetch(buildUrl("/api/wishlist/all"));
      const data = await res.json();

      if (!res.ok) {
        set({
          isLoading: false,
          error: data?.message || "Failed to fetch all wishlist items",
        });
        return { success: false, message: data?.message };
      }

      const items = Array.isArray(data?.wishlist) ? data.wishlist : [];
      const grouped = groupWishlistByCustomer(items);

      set({
        wishlist: items,
        groupedWishlist: grouped,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        wishlist: items,
        groupedWishlist: grouped,
        count: items.length,
        customerCount: Object.keys(grouped).length,
      };
    } catch (error) {
      console.error("fetchAllWishlist error:", error);
      set({
        isLoading: false,
        error: "Something went wrong while fetching all wishlist items",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     GET CUSTOMER WISHLIST
  ========================================================= */
  fetchCustomerWishlist: async (customerCode) => {
    try {
      set({
        isLoading: true,
        error: null,
        message: null,
      });

      if (!customerCode) {
        set({
          isLoading: false,
          error: "customerCode is required",
        });
        return { success: false };
      }

      const normalizedCustomerCode = normalizeCode(customerCode);

      const res = await fetch(
        buildUrl(`/api/wishlist/customer/${encodeURIComponent(normalizedCustomerCode)}`)
      );

      const data = await res.json();

      if (!res.ok) {
        set({
          isLoading: false,
          error: data?.message || "Failed to fetch wishlist",
        });
        return { success: false, message: data?.message };
      }

      const items = Array.isArray(data?.wishlist) ? data.wishlist : [];

      set((state) => ({
        selectedCustomerCode: normalizedCustomerCode,
        selectedCustomerWishlist: items,
        groupedWishlist: {
          ...state.groupedWishlist,
          [normalizedCustomerCode]: items,
        },
        isLoading: false,
        error: null,
      }));

      return {
        success: true,
        wishlist: items,
        count: data?.count || items.length,
      };
    } catch (error) {
      console.error("fetchCustomerWishlist error:", error);
      set({
        isLoading: false,
        error: "Something went wrong while fetching wishlist",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     ADD TO WISHLIST
  ========================================================= */
  addToWishlist: async ({ productCode, customerCode }) => {
    try {
      set({
        actionLoading: true,
        error: null,
        message: null,
      });

      if (!productCode || !customerCode) {
        set({
          actionLoading: false,
          error: "productCode and customerCode are required",
        });
        return { success: false };
      }

      const normalizedProductCode = normalizeCode(productCode);
      const normalizedCustomerCode = normalizeCode(customerCode);

      const res = await fetch(buildUrl("/api/wishlist"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productCode: normalizedProductCode,
          customerCode: normalizedCustomerCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({
          actionLoading: false,
          error: data?.message || "Failed to add to wishlist",
        });
        return { success: false, message: data?.message };
      }

      const newItem = data?.wishlist;

      set((state) => {
        const currentAll = Array.isArray(state.wishlist) ? state.wishlist : [];
        const currentCustomerItems = Array.isArray(state.selectedCustomerWishlist)
          ? state.selectedCustomerWishlist
          : [];

        const allExists = currentAll.some(
          (item) =>
            normalizeCode(item?.productCode) === normalizedProductCode &&
            normalizeCode(item?.customerCode) === normalizedCustomerCode
        );

        const selectedExists = currentCustomerItems.some(
          (item) =>
            normalizeCode(item?.productCode) === normalizedProductCode &&
            normalizeCode(item?.customerCode) === normalizedCustomerCode
        );

        const updatedWishlist =
          !allExists && newItem ? [newItem, ...currentAll] : currentAll;

        const updatedSelectedCustomerWishlist =
          state.selectedCustomerCode === normalizedCustomerCode
            ? !selectedExists && newItem
              ? [newItem, ...currentCustomerItems]
              : currentCustomerItems
            : currentCustomerItems;

        return {
          wishlist: updatedWishlist,
          groupedWishlist: groupWishlistByCustomer(updatedWishlist),
          selectedCustomerWishlist: updatedSelectedCustomerWishlist,
          actionLoading: false,
          isWishlisted: true,
          message: data?.message || "Added to wishlist",
          error: null,
        };
      });

      return {
        success: true,
        wishlist: data?.wishlist,
        message: data?.message,
      };
    } catch (error) {
      console.error("addToWishlist error:", error);
      set({
        actionLoading: false,
        error: "Something went wrong while adding to wishlist",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     REMOVE FROM WISHLIST
  ========================================================= */
  removeFromWishlist: async ({ productCode, customerCode }) => {
    try {
      set({
        actionLoading: true,
        error: null,
        message: null,
      });

      if (!productCode || !customerCode) {
        set({
          actionLoading: false,
          error: "productCode and customerCode are required",
        });
        return { success: false };
      }

      const normalizedProductCode = normalizeCode(productCode);
      const normalizedCustomerCode = normalizeCode(customerCode);

      const res = await fetch(buildUrl("/api/wishlist"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productCode: normalizedProductCode,
          customerCode: normalizedCustomerCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({
          actionLoading: false,
          error: data?.message || "Failed to remove from wishlist",
        });
        return { success: false, message: data?.message };
      }

      set((state) => {
        const updatedWishlist = state.wishlist.filter(
          (item) =>
            !(
              normalizeCode(item?.productCode) === normalizedProductCode &&
              normalizeCode(item?.customerCode) === normalizedCustomerCode
            )
        );

        const updatedSelectedCustomerWishlist = state.selectedCustomerWishlist.filter(
          (item) =>
            !(
              normalizeCode(item?.productCode) === normalizedProductCode &&
              normalizeCode(item?.customerCode) === normalizedCustomerCode
            )
        );

        return {
          wishlist: updatedWishlist,
          groupedWishlist: groupWishlistByCustomer(updatedWishlist),
          selectedCustomerWishlist: updatedSelectedCustomerWishlist,
          actionLoading: false,
          isWishlisted: false,
          message: data?.message || "Removed from wishlist",
          error: null,
        };
      });

      return {
        success: true,
        message: data?.message,
      };
    } catch (error) {
      console.error("removeFromWishlist error:", error);
      set({
        actionLoading: false,
        error: "Something went wrong while removing from wishlist",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     CHECK WISHLIST ITEM
  ========================================================= */
  checkWishlistItem: async ({ productCode, customerCode }) => {
    try {
      set({
        actionLoading: true,
        error: null,
        message: null,
      });

      if (!productCode || !customerCode) {
        set({
          actionLoading: false,
          error: "productCode and customerCode are required",
        });
        return { success: false };
      }

      const query = new URLSearchParams({
        productCode: normalizeCode(productCode),
        customerCode: normalizeCode(customerCode),
      }).toString();

      const res = await fetch(buildUrl(`/api/wishlist/check?${query}`));
      const data = await res.json();

      if (!res.ok) {
        set({
          actionLoading: false,
          error: data?.message || "Failed to check wishlist item",
        });
        return { success: false, message: data?.message };
      }

      set({
        actionLoading: false,
        isWishlisted: !!data?.wishlisted,
        error: null,
      });

      return {
        success: true,
        wishlisted: !!data?.wishlisted,
        wishlist: data?.wishlist || null,
      };
    } catch (error) {
      console.error("checkWishlistItem error:", error);
      set({
        actionLoading: false,
        error: "Something went wrong while checking wishlist item",
      });
      return { success: false, message: error.message };
    }
  },

  /* =========================================================
     TOGGLE WISHLIST
  ========================================================= */
  toggleWishlist: async ({ productCode, customerCode }) => {
    const { isWishlisted, addToWishlist, removeFromWishlist } = get();

    if (isWishlisted) {
      return await removeFromWishlist({ productCode, customerCode });
    }

    return await addToWishlist({ productCode, customerCode });
  },
}));