import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Smartphone,
  Wallet,
  Calendar,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const API_URL = "http://localhost:3000/orders";

const OrderDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================
  // STATE
  // =====================================

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [status, setStatus] = useState("Pending");


  // =====================================
  // FETCH ORDER
  // =====================================

  const fetchOrder = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        `${API_URL}/${id}`
      );

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const data = await response.json();

      setOrder(data);

      setStatus(
        data.status || "Pending"
      );

    } catch (error) {
      console.error(
        "Order fetch error:",
        error
      );

      setError(
        "Unable to load order details."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchOrder();
  }, [id]);


  // =====================================
  // UPDATE STATUS
  // =====================================

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);

      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update order"
        );
      }

      const updatedOrder =
        await response.json();

      setOrder(updatedOrder);

      setStatus(
        updatedOrder.status
      );

      alert(
        "Order status updated successfully."
      );

    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      setError(
        "Unable to update order status."
      );

    } finally {
      setSaving(false);
    }
  };


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

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };


  // =====================================
  // PAYMENT ICON
  // =====================================

  const getPaymentIcon = () => {
    const method =
      order?.paymentMethod
        ?.toLowerCase();

    if (
      method?.includes("upi")
    ) {
      return Smartphone;
    }

    if (
      method?.includes("card")
    ) {
      return CreditCard;
    }

    if (
      method?.includes("cod") ||
      method?.includes("cash")
    ) {
      return Wallet;
    }

    return CreditCard;
  };


  // =====================================
  // STATUS STYLE
  // =====================================

  const getStatusStyle = (
    currentStatus
  ) => {
    switch (
      currentStatus?.toLowerCase()
    ) {
      case "processing":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: Clock,
        };

      case "shipped":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: Truck,
        };

      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle,
        };

      case "cancelled":
      case "canceled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: XCircle,
        };

      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: Clock,
        };
    }
  };


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
            Loading order...
          </p>

        </div>

      </div>
    );
  }


  // =====================================
  // ERROR / NOT FOUND
  // =====================================

  if (error && !order) {
    return (
      <div className="
        min-h-screen
        bg-[#f8f5f6]
        p-6
        lg:p-8
      ">

        <div className="
          mx-auto
          max-w-xl
          rounded-2xl
          bg-white
          p-10
          text-center
          shadow-sm
        ">

          <AlertCircle
            size={48}
            className="
              mx-auto
              text-red-500
            "
          />

          <h2 className="
            mt-5
            text-xl
            font-bold
            text-[#423640]
          ">
            Order Not Found
          </h2>

          <p className="
            mt-2
            text-gray-500
          ">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#ad4058]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              hover:bg-[#852f43]
            "
          >

            <ArrowLeft size={18} />

            Back to Orders

          </button>

        </div>

      </div>
    );
  }


  // =====================================
  // DATA
  // =====================================

  const items =
    Array.isArray(order?.items)
      ? order.items
      : [];

  const PaymentIcon =
    getPaymentIcon();

  const statusStyle =
    getStatusStyle(
      order?.status
    );

  const StatusIcon =
    statusStyle.icon;


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

        <div className="
          flex
          items-center
          gap-4
        ">

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white
              text-gray-500
              shadow-sm
              hover:bg-gray-50
              hover:text-[#ad4058]
            "
          >

            <ArrowLeft size={20} />

          </button>

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-[#423640]
            ">
              Order Details
            </h1>

            <p className="
              mt-2
              text-gray-500
            ">
              Manage order #{order?.id}
            </p>

          </div>

        </div>


        {/* CURRENT STATUS */}

        <div className={`
          inline-flex
          w-fit
          items-center
          gap-2
          rounded-full
          px-4
          py-2
          ${statusStyle.bg}
          ${statusStyle.text}
        `}>

          <StatusIcon size={17} />

          <span className="
            text-sm
            font-medium
          ">
            {order?.status || "Pending"}
          </span>

        </div>

      </div>


      {/* =================================
          ERROR MESSAGE
      ================================= */}

      {error && order && (
        <div className="
          mb-6
          rounded-xl
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-600
        ">
          {error}
        </div>
      )}


      {/* =================================
          TOP INFORMATION
      ================================= */}

      <div className="
        grid
        grid-cols-1
        gap-6
        lg:grid-cols-3
      ">

        {/* CUSTOMER */}

        <div className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-6
          shadow-sm
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-[#ad4058]/10
            ">

              <User
                size={22}
                className="text-[#ad4058]"
              />

            </div>

            <div>

              <h2 className="
                font-semibold
                text-[#423640]
              ">
                Customer
              </h2>

              <p className="
                text-sm
                text-gray-400
              ">
                Customer information
              </p>

            </div>

          </div>


          <div className="
            mt-6
            space-y-4
          ">

            <div>

              <p className="
                text-xs
                text-gray-400
              ">
                User ID
              </p>

              <p className="
                mt-1
                font-medium
                text-[#423640]
              ">
                {order?.userId ||
                  "Guest Customer"}
              </p>

            </div>


            {order?.customerName && (
              <div>

                <p className="
                  text-xs
                  text-gray-400
                ">
                  Name
                </p>

                <p className="
                  mt-1
                  font-medium
                  text-[#423640]
                ">
                  {order.customerName}
                </p>

              </div>
            )}


            {order?.email && (
              <div>

                <p className="
                  text-xs
                  text-gray-400
                ">
                  Email
                </p>

                <p className="
                  mt-1
                  break-all
                  text-sm
                  text-gray-600
                ">
                  {order.email}
                </p>

              </div>
            )}

          </div>

        </div>


        {/* ORDER DATE */}

        <div className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-6
          shadow-sm
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-[#ad4058]/10
            ">

              <Calendar
                size={22}
                className="text-[#ad4058]"
              />

            </div>

            <div>

              <h2 className="
                font-semibold
                text-[#423640]
              ">
                Order Date
              </h2>

              <p className="
                text-sm
                text-gray-400
              ">
                Order information
              </p>

            </div>

          </div>


          <div className="mt-6">

            <p className="
              text-xs
              text-gray-400
            ">
              Created At
            </p>

            <p className="
              mt-2
              font-medium
              text-[#423640]
            ">
              {formatDate(
                order?.createdAt
              )}
            </p>

          </div>

        </div>


        {/* PAYMENT */}

        <div className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-6
          shadow-sm
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-[#ad4058]/10
            ">

              <PaymentIcon
                size={22}
                className="text-[#ad4058]"
              />

            </div>

            <div>

              <h2 className="
                font-semibold
                text-[#423640]
              ">
                Payment
              </h2>

              <p className="
                text-sm
                text-gray-400
              ">
                Payment information
              </p>

            </div>

          </div>


          <div className="
            mt-6
            space-y-4
          ">

            <div>

              <p className="
                text-xs
                text-gray-400
              ">
                Payment Method
              </p>

              <p className="
                mt-1
                font-medium
                capitalize
                text-[#423640]
              ">
                {order?.paymentMethod ||
                  "N/A"}
              </p>

            </div>


            <div>

              <p className="
                text-xs
                text-gray-400
              ">
                Payment Status
              </p>

              <span className={`
                mt-1
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${
                  order?.paymentStatus
                    ?.toLowerCase() ===
                  "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}>
                {order?.paymentStatus ||
                  "Pending"}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div className="
        mt-6
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-3
      ">

        {/* =================================
            PRODUCTS
        ================================= */}

        <div className="
          xl:col-span-2
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-sm
        ">

          <div className="
            flex
            items-center
            gap-3
            border-b
            border-gray-100
            px-6
            py-5
          ">

            <ShoppingBag
              size={21}
              className="text-[#ad4058]"
            />

            <h2 className="
              text-lg
              font-semibold
              text-[#423640]
            ">
              Ordered Products
            </h2>

          </div>


          {items.length === 0 ? (

            <div className="
              px-6
              py-12
              text-center
            ">

              <Package
                size={42}
                className="
                  mx-auto
                  text-gray-300
                "
              />

              <p className="
                mt-3
                text-gray-500
              ">
                No products found in this order.
              </p>

            </div>

          ) : (

            <div className="p-6">

              <div className="space-y-5">

                {items.map(
                  (item, index) => {

                    const quantity =
                      Number(
                        item.quantity
                      ) || 1;

                    const price =
                      Number(
                        item.price
                      ) || 0;

                    const itemTotal =
                      price * quantity;

                    return (

                      <div
                        key={
                          item.id ||
                          item.productId ||
                          index
                        }
                        className="
                          flex
                          flex-col
                          gap-4
                          border-b
                          border-gray-100
                          pb-5
                          last:border-0
                          last:pb-0
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div className="
                          flex
                          items-center
                          gap-4
                        ">

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="
                                h-16
                                w-16
                                rounded-xl
                                object-cover
                                border
                                border-gray-100
                              "
                            />

                          ) : (

                            <div className="
                              flex
                              h-16
                              w-16
                              items-center
                              justify-center
                              rounded-xl
                              bg-gray-100
                            ">

                              <Package
                                size={25}
                                className="
                                  text-gray-400
                                "
                              />

                            </div>

                          )}


                          <div>

                            <p className="
                              font-semibold
                              text-[#423640]
                            ">
                              {item.name ||
                                "Product"}
                            </p>

                            <p className="
                              mt-1
                              text-sm
                              text-gray-400
                            ">
                              ₹{price} ×{" "}
                              {quantity}
                            </p>

                          </div>

                        </div>


                        <p className="
                          font-semibold
                          text-[#423640]
                        ">
                          ₹{itemTotal}
                        </p>

                      </div>

                    );
                  }
                )}

              </div>


              {/* TOTALS */}

              <div className="
                mt-6
                border-t
                border-gray-100
                pt-5
              ">

                <div className="
                  ml-auto
                  max-w-sm
                  space-y-3
                ">

                  <div className="
                    flex
                    justify-between
                    text-sm
                  ">

                    <span className="
                      text-gray-500
                    ">
                      Items
                    </span>

                    <span className="
                      font-medium
                      text-[#423640]
                    ">
                      {items.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          (Number(
                            item.quantity
                          ) || 1),
                        0
                      )}
                    </span>

                  </div>


                  <div className="
                    flex
                    justify-between
                    text-sm
                  ">

                    <span className="
                      text-gray-500
                    ">
                      Total Amount
                    </span>

                    <span className="
                      text-lg
                      font-bold
                      text-[#ad4058]
                    ">
                      ₹
                      {Number(
                        order?.totalAmount
                      ) || 0}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =================================
            ORDER STATUS
        ================================= */}

        <div className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-6
          shadow-sm
        ">

          <h2 className="
            text-lg
            font-semibold
            text-[#423640]
          ">
            Update Order Status
          </h2>

          <p className="
            mt-2
            text-sm
            text-gray-500
          ">
            Change the current order status.
          </p>


          <div className="mt-6">

            <label className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-600
            ">
              Order Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
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
                focus:border-[#ad4058]
                focus:ring-2
                focus:ring-[#ad4058]/10
              "
            >

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


            <button
              onClick={
                handleStatusUpdate
              }
              disabled={
                saving ||
                status ===
                  order?.status
              }
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#ad4058]
                px-5
                py-3
                text-sm
                font-medium
                text-white
                hover:bg-[#852f43]
                disabled:cursor-not-allowed
                disabled:opacity-50
                transition
              "
            >

              {saving ? (

                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Updating...

                </>

              ) : (

                <>
                  <CheckCircle
                    size={18}
                  />

                  Update Status

                </>
              )}

            </button>

          </div>


          {/* STATUS TIMELINE */}

          <div className="
            mt-8
            space-y-5
          ">

            <h3 className="
              text-sm
              font-semibold
              text-[#423640]
            ">
              Order Progress
            </h3>


            <div className="
              space-y-4
            ">

              {[
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
              ].map(
                (step) => {

                  const currentIndex = [
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                  ].indexOf(
                    order?.status
                  );

                  const stepIndex = [
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                  ].indexOf(step);

                  const completed =
                    currentIndex >=
                    stepIndex;

                  return (

                    <div
                      key={step}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        ${
                          completed
                            ? "bg-[#ad4058] text-white"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}>

                        <CheckCircle
                          size={16}
                        />

                      </div>

                      <span className={`
                        text-sm
                        ${
                          completed
                            ? "font-medium text-[#423640]"
                            : "text-gray-400"
                        }
                      `}>
                        {step}
                      </span>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          DELIVERY ADDRESS
      ================================= */}

      <div className="
        mt-6
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-6
        shadow-sm
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          <div className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[#ad4058]/10
          ">

            <MapPin
              size={22}
              className="text-[#ad4058]"
            />

          </div>

          <div>

            <h2 className="
              font-semibold
              text-[#423640]
            ">
              Delivery Address
            </h2>

            <p className="
              text-sm
              text-gray-400
            ">
              Customer delivery information
            </p>

          </div>

        </div>


        <div className="
          mt-5
          rounded-xl
          bg-gray-50
          p-5
        ">

          {order?.address ? (

            typeof order.address ===
            "object" ? (

              <div className="
                space-y-2
                text-sm
                text-gray-600
              ">

                {order.address.name && (
                  <p className="
                    font-semibold
                    text-[#423640]
                  ">
                    {order.address.name}
                  </p>
                )}

                {order.address.phone && (
                  <p>
                    Phone:{" "}
                    {order.address.phone}
                  </p>
                )}

                {order.address.address && (
                  <p>
                    {order.address.address}
                  </p>
                )}

                {order.address.city && (
                  <p>
                    {order.address.city}
                    {order.address.state
                      ? `, ${order.address.state}`
                      : ""}
                  </p>
                )}

                {order.address.pincode && (
                  <p>
                    PIN:{" "}
                    {order.address.pincode}
                  </p>
                )}

              </div>

            ) : (

              <p className="
                whitespace-pre-line
                text-sm
                leading-6
                text-gray-600
              ">
                {order.address}
              </p>

            )

          ) : (

            <p className="
              text-sm
              text-gray-400
            ">
              No delivery address available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;