import { useEffect, useState } from "react";

import {
  Package,
  ShoppingBag,
  Users,
  AlertCircle,
} from "lucide-react";

import AdminCard from "../../components/AdminCard/AdminCard";
import AdminTable from "../../components/AdminTable/AdminTable";

const Dashboard = () => {
  // =========================
  // STATE
  // =========================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsRes,
        ordersRes,
        usersRes,
      ] = await Promise.all([
        fetch("http://localhost:3000/products"),
        fetch("http://localhost:3000/orders"),
        fetch("http://localhost:3000/users"),
      ]);

      // Check API response
      if (
        !productsRes.ok ||
        !ordersRes.ok ||
        !usersRes.ok
      ) {
        throw new Error(
          "Failed to fetch dashboard data"
        );
      }

      const productsData =
        await productsRes.json();

      const ordersData =
        await ordersRes.json();

      const usersData =
        await usersRes.json();

      // Make sure data is arrays
      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH ON PAGE LOAD
  // =========================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const totalOrders = orders.length;

  const totalUsers = users.length;

  const outOfStock = products.filter(
    (product) =>
      Number(product.stock) === 0
  ).length;

  // =========================
  // RECENT ORDERS
  // =========================

  const recentOrders = [...orders]
    .slice(-5)
    .reverse();

  // =========================
  // TABLE COLUMNS
  // =========================

  const orderColumns = [
    {
      key: "id",
      label: "Order ID",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  // =========================
  // LOADING UI
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f6] flex items-center justify-center">

        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-[#ad4058]
            border-t-transparent
          "
        />

      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5f6] p-8">

        <div
          className="
            rounded-2xl
            bg-white
            border
            border-red-100
            p-8
            text-center
            shadow-sm
          "
        >

          <AlertCircle
            size={40}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-[#423640]">
            Something went wrong
          </h2>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchDashboardData}
            className="
              mt-5
              rounded-xl
              bg-[#ad4058]
              px-5
              py-3
              text-white
              font-medium
              hover:bg-[#852f43]
              transition
            "
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // DASHBOARD UI
  // =========================

  return (
    <div className="min-h-screen bg-[#f8f5f6] p-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#423640]">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to your Bonvivant admin panel.
        </p>

      </div>

      {/* =========================
          ADMIN CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Total Products */}

        <AdminCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
        />

        {/* Total Orders */}

        <AdminCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
        />

        {/* Total Users */}

        <AdminCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
        />

        {/* Out Of Stock */}

        <AdminCard
          title="Out of Stock"
          value={outOfStock}
          icon={AlertCircle}
        />

      </div>

      {/* =========================
          RECENT ORDERS 
      ========================= */} 

      <div className="mt-8">

          <div className="mb-4">

          <h2 className="text-xl font-semibold text-[#423640]">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest orders from your customers
          </p>

        </div>

        <AdminTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="No orders yet."
          renderRow={(order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition"
            >

              {/* Order ID */}

              <td className="px-6 py-4 text-sm font-medium text-[#423640]">
                #{order.id}
              </td>

              {/* Customer */}

              <td className="px-6 py-4 text-sm text-gray-500">
                {order.userId || "Customer"}
              </td>

              {/* Amount */}

              <td className="px-6 py-4 text-sm font-semibold text-[#423640]">
                ₹{order.totalAmount || 0}
              </td>

              {/* Status */}

              <td className="px-6 py-4">

                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium

                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {order.status || "Pending"}
                </span>

              </td>

            </tr>
          )}
        />

      </div>

    </div>
  );
};

export default Dashboard;