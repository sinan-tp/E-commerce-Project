import { createSlice } from "@reduxjs/toolkit";

const storedUser = (() => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined"
      ? JSON.parse(user)
      : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    isAuthenticated: !!storedUser,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
