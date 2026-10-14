import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getProductById,
  updateProductStock,
} from "../../services/productService";

// ========================================
// API
// ========================================

const API_URL = "http://localhost:3000/orders";

// ========================================
// PLACE ORDER
// STOCK CHANGES ONLY HERE
// ========================================

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",

  async (order, { rejectWithValue }) => {
    try {
      // ====================================
      // 1. GET LATEST PRODUCT STOCK
      // ====================================

      const products = [];

      for (const item of order.items) {
        const product = await getProductById(
          item.id
        );

        if (!product) {
          throw new Error(
            `${item.name} not found`
          );
        }

        const currentStock =
          Number(product.stock) || 0;

        const quantity =
          Number(item.quantity) || 0;

        // ==================================
        // CHECK STOCK
        // ==================================

        if (quantity > currentStock) {
          throw new Error(
            `Only ${currentStock} ${item.name} available`
          );
        }

        products.push({
          ...product,
          orderQuantity: quantity,
        });
      }

      // ====================================
      // 2. CREATE ORDER
      // ====================================

      const orderResponse = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(order),
        }
      );

      if (!orderResponse.ok) {
        throw new Error(
          "Failed to create order"
        );
      }

      const createdOrder =
        await orderResponse.json();

      // ====================================
      // 3. UPDATE STOCK
      // ONLY AFTER ORDER IS CREATED
      // ====================================

      for (const product of products) {
        const currentStock =
          Number(product.stock) || 0;

        const newStock =
          currentStock -
          product.orderQuantity;

        await updateProductStock(
          product.id,
          newStock
        );
      }

      // ====================================
      // 4. RETURN ORDER
      // ====================================

      return createdOrder;

    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      return rejectWithValue(
        error.message ||
          "Failed to place order"
      );
    }
  }
);

// ========================================
// FETCH ORDERS
// ========================================

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",

  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data =
        await response.json();

      return data;

    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      return rejectWithValue(
        error.message ||
          "Failed to fetch orders"
      );
    }
  }
);

// ========================================
// ALIAS
// ========================================
// If any other component uses getUserOrders,
// it will also continue to work.

export const getUserOrders = fetchOrders;

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// ========================================
// SLICE
// ========================================

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==================================
      // PLACE ORDER - PENDING
      // ==================================

      .addCase(
        placeOrder.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // ==================================
      // PLACE ORDER - SUCCESS
      // ==================================

      .addCase(
        placeOrder.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders.unshift(
            action.payload
          );

          state.error = null;
        }
      )

      // ==================================
      // PLACE ORDER - ERROR
      // ==================================

      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to place order";
        }
      )

      // ==================================
      // FETCH ORDERS - PENDING
      // ==================================

      .addCase(
        fetchOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // ==================================
      // FETCH ORDERS - SUCCESS
      // ==================================

      .addCase(
        fetchOrders.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders =
            action.payload;

          state.error = null;
        }
      )

      // ==================================
      // FETCH ORDERS - ERROR
      // ==================================

      .addCase(
        fetchOrders.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch orders";
        }
      );
  },
});

export default orderSlice.reducer;