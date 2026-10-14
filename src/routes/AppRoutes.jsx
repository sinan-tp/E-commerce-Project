import { Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

// =========================
// USER PAGES
// =========================

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import Profile from "../pages/Profile/Profile";

// =========================
// ADMIN
// =========================

import AdminLogin from "../Admin/pages/AdminLogin/AdminLogin";
import AdminLayout from "../Admin/layouts/AdminLayout";

import Dashboard from "../Admin/pages/Dashboard/Dashboard";
import ProductsAdmin from "../Admin/pages/Products/Products";
import OrdersAdmin from "../Admin/pages/Orders/Orders";
import UsersAdmin from "../Admin/pages/Users/Users";
import EditProduct from "../Admin/pages/EditProduct/EditProduct";
import OrderDetails from "../Admin/pages/OrderDetails/OrderDetails";
import AddProduct from "../Admin/pages/Products/AddProduct";
import AdminProfile from "../Admin/pages/Profile/Profile";


// =========================
// ROUTES
// =========================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ==========================================
          USER SIDE
      ========================================== */}

      <Route element={<UserLayout />}>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER PROTECTED */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

        </Route>

      </Route>


      {/* ==========================================
          ADMIN LOGIN
      ========================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ==========================================
          ADMIN PROTECTED AREA
      ========================================== */}

      <Route element={<AdminProtectedRoute />}>

        <Route element={<AdminLayout />}>

          {/* Dashboard */}

          <Route
            path="/admin/dashboard"
            element={<Dashboard />}
          />

          {/* Products */}

          <Route
            path="/admin/products"
            element={<ProductsAdmin />}
          />

          {/* Add Product */}

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          {/* Edit Product */}

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />

          {/* Orders */}

          <Route
            path="/admin/orders"
            element={<OrdersAdmin />}
          />

          {/* Order Details */}

          <Route
            path="/admin/orders/:id"
            element={<OrderDetails />}
          />

          {/* Users */}

          <Route
            path="/admin/users"
            element={<UsersAdmin />}
          />

          {/* Admin Profile */}

          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />
         

        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;