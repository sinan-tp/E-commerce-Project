import { createSlice } from "@reduxjs/toolkit";

// ========================================
// EMPTY CART
// ========================================

const emptyCart = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

// ========================================
// GET USER CART
// ========================================

const getStoredCart = (userId) => {
  if (!userId) {
    return emptyCart;
  }

  try {
    const storedCart = localStorage.getItem(
      `cart_${userId}`
    );

    if (!storedCart) {
      return emptyCart;
    }

    const parsedCart = JSON.parse(storedCart);

    return {
      items: parsedCart.items || [],
      totalQuantity:
        parsedCart.totalQuantity || 0,
      totalPrice:
        parsedCart.totalPrice || 0,
    };
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );

    return emptyCart;
  }
};

// ========================================
// SAVE USER CART
// ========================================

const saveCart = (userId, state) => {
  if (!userId) {
    return;
  }

  const cartData = {
    items: state.items,
    totalQuantity: state.totalQuantity,
    totalPrice: state.totalPrice,
  };

  localStorage.setItem(
    `cart_${userId}`,
    JSON.stringify(cartData)
  );
};

// ========================================
// RECALCULATE
// ========================================

const recalculateCart = (state) => {
  state.totalQuantity =
    state.items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  state.totalPrice =
    state.items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
};

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  userId: null,
};

// ========================================
// CART SLICE
// ========================================

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ======================================
    // LOAD USER CART
    // ======================================

    loadUserCart: (state, action) => {
      const userId = action.payload;

      const cart = getStoredCart(userId);

      state.items = cart.items;
      state.totalQuantity =
        cart.totalQuantity;
      state.totalPrice =
        cart.totalPrice;
      state.userId = userId;
    },

    // ======================================
    // CLEAR USER CART
    // ======================================

    clearUserCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.userId = null;
    },

    // ======================================
    // ADD ITEM
    // ======================================

    addItem: (state, action) => {
      const product = action.payload;

      const existingItem =
        state.items.find(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      recalculateCart(state);

      saveCart(
        state.userId,
        state
      );
    },

    // ======================================
    // INCREASE
    // ======================================

    increaseQuantity: (
      state,
      action
    ) => {
      const item =
        state.items.find(
          (item) =>
            String(item.id) ===
            String(action.payload)
        );

      if (item) {
        item.quantity += 1;
      }

      recalculateCart(state);

      saveCart(
        state.userId,
        state
      );
    },

    // ======================================
    // DECREASE
    // ======================================

    decreaseQuantity: (
      state,
      action
    ) => {
      const item =
        state.items.find(
          (item) =>
            String(item.id) ===
            String(action.payload)
        );

      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items =
          state.items.filter(
            (cartItem) =>
              String(cartItem.id) !==
              String(action.payload)
          );
      }

      recalculateCart(state);

      saveCart(
        state.userId,
        state
      );
    },

    // ======================================
    // REMOVE
    // ======================================

    removeItem: (
      state,
      action
    ) => {
      state.items =
        state.items.filter(
          (item) =>
            String(item.id) !==
            String(action.payload)
        );

      recalculateCart(state);

      saveCart(
        state.userId,
        state
      );
    },

    // ======================================
    // CLEAR CART
    // ======================================

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      saveCart(
        state.userId,
        state
      );
    },

    // ======================================
    // UPDATE QUANTITY
    // ======================================

    updateQuantity: (
      state,
      action
    ) => {
      const {
        id,
        quantity,
      } = action.payload;

      const item =
        state.items.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

      if (!item) {
        return;
      }

      if (quantity <= 0) {
        state.items =
          state.items.filter(
            (cartItem) =>
              String(cartItem.id) !==
              String(id)
          );
      } else {
        item.quantity =
          Number(quantity);
      }

      recalculateCart(state);

      saveCart(
        state.userId,
        state
      );
    },
  },
});

// ========================================
// EXPORT ACTIONS
// ========================================

export const {
  loadUserCart,
  clearUserCart,
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

// ========================================
// EXPORT REDUCER
// ========================================

export default cartSlice.reducer;