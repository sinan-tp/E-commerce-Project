import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getProducts } from "../../services/productService";

// ========================================
// FETCH PRODUCTS
// ========================================

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts();

      console.log("PRODUCTS FROM API:", products);

      return products;

    } catch (error) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        error
      );

      return rejectWithValue(
        error.message ||
          "Failed to fetch products"
      );
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  products: [],
  loading: false,
  error: null,
};

// ========================================
// SLICE
// ========================================

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==================================
      // LOADING
      // ==================================

      .addCase(
        fetchProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // ==================================
      // SUCCESS
      // ==================================

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.products =
            action.payload || [];

          state.error = null;

          console.log(
            "REDUX PRODUCTS:",
            action.payload
          );
        }
      )

      // ==================================
      // ERROR
      // ==================================

      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.products = [];

          state.error =
            action.payload ||
            "Failed to fetch products";
        }
      );
  },
});

export default productSlice.reducer;