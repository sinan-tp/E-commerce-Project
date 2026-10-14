import { createSlice } from "@reduxjs/toolkit";

// Get logged-in user
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Get unique wishlist key
const getWishlistKey = () => {
  const user = getCurrentUser();

  if (!user || !user.id) {
    return null;
  }

  return `wishlist_${user.id}`;
};

// Get current user's wishlist
const getStoredWishlist = () => {
  const wishlistKey = getWishlistKey();

  if (!wishlistKey) {
    return [];
  }

  try {
    const storedWishlist = JSON.parse(
      localStorage.getItem(wishlistKey)
    );

    return storedWishlist || [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getStoredWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    // Load current user's wishlist
    loadUserWishlist: (state) => {
      state.items = getStoredWishlist();
    },

    // Add product
    addToWishlist: (state, action) => {
      const exists = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }

      const wishlistKey = getWishlistKey();

      if (wishlistKey) {
        localStorage.setItem(
          wishlistKey,
          JSON.stringify(state.items)
        );
      }
    },

    // Remove product
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      const wishlistKey = getWishlistKey();

      if (wishlistKey) {
        localStorage.setItem(
          wishlistKey,
          JSON.stringify(state.items)
        );
      }
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.items = [];

      const wishlistKey = getWishlistKey();

      if (wishlistKey) {
        localStorage.removeItem(wishlistKey);
      }
    },
  },
});

export const {
  loadUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;