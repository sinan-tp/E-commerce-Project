
import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  Package,
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { fetchOrders } from "../../redux/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ========================================
  // AUTH USER
  // ========================================

  const user = useSelector(
    (state) => state.auth?.user
  );

  // ========================================
  // ORDERS
  // ========================================

  const {
    orders = [],
    loading = false,
    error = null,
  } = useSelector(
    (state) => state.orders || {}
  );

  // ========================================
  // FETCH USER ORDERS
  // ========================================

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f1f3] flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-[#ad4058]
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-500">
            Loading your orders...
          </p>

        </div>

      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f1f3] flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full">

          <XCircle
            size={50}
            className="text-red-500 mx-auto"
          />

          <h2 className="text-2xl font-bold text-[#423640] mt-4">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              user?.id &&
              dispatch(fetchOrders(user.id))
            }
            className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-[#ad4058]
              text-white
              font-semibold
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

  // ========================================
  // EMPTY ORDERS
  // ========================================

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f1f3] px-4 md:px-8 py-10">

        <div className="max-w-6xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                items-center
                gap-2
                text-[#423640]
                font-medium
                hover:text-[#ad4058]
                transition
                mb-5
              "
            >
              <ArrowLeft size={19} />
              Back
            </button>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-[#ad4058] flex items-center justify-center">

                <Package
                  size={24}
                  className="text-white"
                />

              </div>

              <div>

                <h1 className="text-3xl font-bold text-[#423640]">
                  My Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  View and track your orders
                </p>

              </div>

            </div>

          </div>

          {/* EMPTY */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#f8e9ed] flex items-center justify-center">

              <ShoppingBag
                size={38}
                className="text-[#ad4058]"
              />

            </div>

            <h2 className="text-2xl font-bold text-[#423640] mt-6">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                mt-6
                px-7
                py-3.5
                rounded-xl
                bg-[#ad4058]
                text-white
                font-semibold
                hover:bg-[#852f43]
                hover:shadow-lg
                transition
              "
            >
              Start Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // ORDERS PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-[#f7f1f3] px-4 md:px-8 py-8">

      <div className="max-w-7xl mx-auto">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mb-7">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              text-[#423640]
              font-medium
              hover:text-[#ad4058]
              transition
              mb-4
            "
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#ad4058] flex items-center justify-center">

              <Package
                size={21}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#423640]">
                My Orders
              </h1>

              <p className="text-sm text-gray-500">
                {orders.length}{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}{" "}
                placed
              </p>

            </div>

          </div>

        </div>

        {/* ==================================
            ORDER GRID
        ================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          {orders.map((order) => (

            <div
              key={order.id}
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition
                overflow-hidden
              "
            >

              {/* ==================================
                  ORDER HEADER
              ================================== */}

              <div className="p-4 border-b border-gray-100">

                <div className="flex items-center justify-between gap-3">

                  {/* ORDER ID */}

                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                      Order ID
                    </p>

                    <p className="text-sm font-bold text-[#423640] mt-0.5">
                      #{order.id}
                    </p>

                  </div>

                  {/* STATUS */}

                  {order.status === "Delivered" ? (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-2.5
                        py-1
                        rounded-full
                        bg-green-50
                        text-green-600
                        text-xs
                        font-semibold
                      "
                    >
                      <CheckCircle size={13} />
                      Delivered
                    </span>

                  ) : order.status === "Cancelled" ? (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-2.5
                        py-1
                        rounded-full
                        bg-red-50
                        text-red-500
                        text-xs
                        font-semibold
                      "
                    >
                      <XCircle size={13} />
                      Cancelled
                    </span>

                  ) : (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-2.5
                        py-1
                        rounded-full
                        bg-yellow-50
                        text-yellow-600
                        text-xs
                        font-semibold
                      "
                    >
                      <Clock size={13} />
                      {order.status || "Pending"}
                    </span>

                  )}

                </div>

                {/* DATE */}

                <p className="text-xs text-gray-400 mt-2">

                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A"}

                </p>

              </div>

              {/* ==================================
                  ORDER ITEMS
              ================================== */}

              <div className="p-4">

                <div className="space-y-3">

                  {(order.items || []).map(
                    (item) => (

                      <div
                        key={item.id}
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        {/* IMAGE */}

                        <img
                          src={item.image}
                          alt={item.name}
                          className="
                            w-14
                            h-14
                            rounded-xl
                            object-cover
                            bg-gray-100
                            flex-shrink-0
                          "
                        />

                        {/* DETAILS */}

                        <div className="flex-1 min-w-0">

                          <h3 className="text-sm font-semibold text-[#423640] truncate">
                            {item.name}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                          <p className="text-xs text-gray-500">
                            ₹{item.price} each
                          </p>

                        </div>

                        {/* ITEM TOTAL */}

                        <p className="text-sm font-semibold text-[#423640] whitespace-nowrap">

                          ₹
                          {Number(item.price) *
                            Number(item.quantity)}

                        </p>

                      </div>

                    )
                  )}

                </div>

                {/* ==================================
                    DIVIDER
                ================================== */}

                <div className="border-t border-gray-100 my-4" />

                {/* ==================================
                    PAYMENT + TOTAL
                ================================== */}

                <div className="flex items-end justify-between gap-3">

                  {/* PAYMENT */}

                  <div className="min-w-0">

                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                      Payment
                    </p>

                    <p className="text-xs font-medium text-[#423640] mt-1 capitalize truncate">
                      {order.paymentMethod || "N/A"}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      Payment status:{" "}
                      {order.paymentStatus || "N/A"}
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div className="text-right">

                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                      Total
                    </p>

                    <p className="text-xl font-bold text-[#ad4058]">
                      ₹{Number(order.totalAmount) || 0}
                    </p>

                  </div>

                </div>

                {/* ==================================
                    ADDRESS
                ================================== */}

                <div className="mt-4">

                  <p className="text-[10px] uppercase tracking-wider text-gray-400">
                    Delivery Address
                  </p>

                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {order.address || "N/A"}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Orders;

