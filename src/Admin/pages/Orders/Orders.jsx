import { useEffect, useMemo, useState } from "react";

import {
  Eye,
  Search,
  ShoppingBag,
  RefreshCw,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/orders";

const Orders = () => {
  const navigate = useNavigate();

  // =====================================
  // STATE
  // =====================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  // =====================================
  // FETCH ORDERS
  // =====================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data = await response.json();

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Orders fetch error:",
        error
      );

      setError(
        "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchOrders();
  }, []);


  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================
  // GET STATUS ICON
  // =====================================

  const getStatusIcon = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "processing":
        return Clock;

      case "shipped":
        return Truck;

      case "delivered":
        return CheckCircle;

      case "cancelled":
      case "canceled":
        return XCircle;

      default:
        return AlertCircle;
    }
  };


  // =====================================
  // STATUS STYLE
  // =====================================

  const getStatusStyle = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };


  // =====================================
  // FILTER ORDERS
  // =====================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !searchValue ||
        String(order.id)
          .toLowerCase()
          .includes(searchValue) ||
        String(order.userId || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(
          order.customerName || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(order.email || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        String(
          order.status || "Pending"
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]) ;


  // =====================================
  // COUNTS
  // =====================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        String(
          order.status || "Pending"
        ).toLowerCase() ===
        "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "processing"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "delivered"
    ).length;


  // =====================================
  // STAT CARDS
  // =====================================

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: AlertCircle,
    },
    {
      title: "Processing",
      value: processingOrders,
      icon: Clock,
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle,
    },
  ];


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="
        min-h-screen
        bg-[#f8f5f6]
        flex
        items-center
        justify-center
      ">

        <div className="text-center">

          <div className="
            mx-auto
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-[#ad4058]
            border-t-transparent
          " />

          <p className="
            mt-4
            text-gray-500
          ">
            Loading orders...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="
      min-h-screen
      bg-[#f8f5f6]
      p-6
      lg:p-8
    ">

      {/* =================================
          HEADER
      ================================= */}

      <div className="
        mb-8
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-[#423640]
          ">
            Orders
          </h1>

          <p className="
            mt-2
            text-gray-500
          ">
            Manage customer orders.
          </p>

        </div>


        <button
          onClick={fetchOrders}
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-600
            shadow-sm
            hover:border-[#ad4058]
            hover:text-[#ad4058]
          "
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </div>


      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div className="
          mb-6
          flex
          items-center
          gap-3
          rounded-xl
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-600
        ">

          <AlertCircle size={18} />

          {error}

        </div>
      )}


      {/* =================================
          STAT CARDS
      ================================= */}

      <div className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-sm
                    font-medium
                    text-gray-500
                  ">
                    {card.title}
                  </p>

                  <h2 className="
                    mt-2
                    text-3xl
                    font-bold
                    text-[#423640]
                  ">
                    {card.value}
                  </h2>

                </div>


                <div className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#ad4058]/10
                ">

                  <Icon
                    size={22}
                    className="text-[#ad4058]"
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================
          SEARCH + FILTER
      ================================= */}

      <div className="
        mt-8
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
      ">

        <div className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        ">

          {/* SEARCH */}

          <div className="
            relative
            w-full
            lg:max-w-md
          ">

            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="
                Search order ID or customer...
              "
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                py-3
                pl-11
                pr-4
                text-sm
                outline-none
                focus:border-[#ad4058]
                focus:ring-2
                focus:ring-[#ad4058]/10
              "
            />

          </div>


          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              lg:w-48
              focus:border-[#ad4058]
            "
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>


      {/* =================================
          ORDERS TABLE
      ================================= */}

      <div className="
        mt-6
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
      ">

        <div className="
          flex
          items-center
          justify-between
          border-b
          border-gray-100
          px-6
          py-5
        ">

          <div>

            <h2 className="
              text-lg
              font-semibold
              text-[#423640]
            ">
              All Orders
            </h2>

            <p className="
              mt-1
              text-sm
              text-gray-400
            ">
              {filteredOrders.length}{" "}
              order
              {filteredOrders.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>


        {filteredOrders.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="
            px-6
            py-16
            text-center
          ">

            <div className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-gray-100
            ">

              <ShoppingBag
                size={30}
                className="text-gray-400"
              />

            </div>

            <h3 className="
              mt-5
              text-lg
              font-semibold
              text-[#423640]
            ">
              No orders found
            </h3>

            <p className="
              mt-2
              text-sm
              text-gray-500
            ">
              {orders.length === 0
                ? "There are no customer orders yet."
                : "Try changing your search or filter."}
            </p>

          </div>

        ) : (

          /* =================================
             TABLE
          ================================= */

          <div className="overflow-x-auto">

            <table className="
              w-full
              min-w-[900px]
            ">

              <thead>

                <tr className="
                  bg-gray-50
                  text-left
                ">

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Order
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Customer
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Date
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Amount
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Payment
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Status
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map(
                  (order) => {

                    const StatusIcon =
                      getStatusIcon(
                        order.status
                      );

                    return (

                      <tr
                        key={order.id}
                        className="
                          border-t
                          border-gray-100
                          transition
                          hover:bg-gray-50
                        "
                      >

                        {/* ORDER */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <div className="
                            flex
                            items-center
                            gap-3
                          ">

                            <div className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#ad4058]/10
                            ">

                              <Package
                                size={19}
                                className="
                                  text-[#ad4058]
                                "
                              />

                            </div>

                            <div>

                              <p className="
                                font-semibold
                                text-[#423640]
                              ">
                                #{order.id}
                              </p>

                              <p className="
                                text-xs
                                text-gray-400
                              ">
                                {Array.isArray(
                                  order.items
                                )
                                  ? `${order.items.length} item${
                                      order.items.length !== 1
                                        ? "s"
                                        : ""
                                    }`
                                  : "Order"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <p className="
                            font-medium
                            text-[#423640]
                          ">
                            {order.customerName ||
                              order.userId ||
                              "Customer"}
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            text-gray-400
                          ">
                            {order.email ||
                              `User ID: ${
                                order.userId ||
                                "N/A"
                              }`}
                          </p>

                        </td>


                        {/* DATE */}

                        <td className="
                          px-6
                          py-5
                          text-sm
                          text-gray-500
                        ">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>


                        {/* AMOUNT */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <p className="
                            font-semibold
                            text-[#423640]
                          ">
                            ₹
                            {Number(
                              order.totalAmount
                            ) || 0}
                          </p>

                        </td>


                        {/* PAYMENT */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <p className="
                            text-sm
                            font-medium
                            capitalize
                            text-[#423640]
                          ">
                            {order.paymentMethod ||
                              "N/A"}
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            text-gray-400
                          ">
                            {order.paymentStatus ||
                              "Pending"}
                          </p>

                        </td>


                        {/* STATUS */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <span className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            ${getStatusStyle(
                              order.status
                            )}
                          `}>

                            <StatusIcon
                              size={14}
                            />

                            {order.status ||
                              "Pending"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="
                          px-6
                          py-5
                        ">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order.id}`
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-gray-200
                              bg-white
                              px-4
                              py-2
                              text-sm
                              font-medium
                              text-gray-600
                              hover:border-[#ad4058]
                              hover:text-[#ad4058]
                            "
                          >

                            <Eye size={16} />

                            View

                          </button>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Orders;