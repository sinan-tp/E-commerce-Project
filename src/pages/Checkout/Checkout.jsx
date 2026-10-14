import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  User,
  ShoppingBag,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Wallet,
  AlertCircle,
} from "lucide-react";

import { placeOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { loginSuccess } from "../../redux/slices/authSlice";

import { updateUser } from "../../services/userService";

const DELIVERY_CHARGE = 50;

const Checkout = () => {
  // ========================================
  // REDUX
  // ========================================

  const { items = [], totalPrice = 0 } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const { loading: orderLoading } = useSelector(
    (state) => state.orders || {}
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",

    // Load saved phone from profile
    phone: user?.phone || "",

    // Load saved address from profile
    address: user?.address || "",

    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ========================================
  // TOTAL
  // ========================================

  const finalTotal =
    Number(totalPrice) + DELIVERY_CHARGE;

  // ========================================
  // CHECK USER BLOCK STATUS
  // ========================================

  const checkUserBlocked = async () => {
    if (!user?.id) {
      return false;
    }

    const response = await fetch(
      `http://localhost:3000/users/${user.id}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to verify account status."
      );
    }

    const latestUser =
      await response.json();

    console.log(
      "Latest user:",
      latestUser
    );

    console.log(
      "Blocked:",
      latestUser.isBlocked
    );

    return latestUser.isBlocked === true;
  };

  // ========================================
  // PLACE ORDER
  // ========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    // ======================================
    // LOGIN CHECK
    // ======================================

    if (!user) {
      navigate("/login");
      return;
    }

    // ======================================
    // CART CHECK
    // ======================================

    if (items.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    try {
      // ====================================
      // CHECK BLOCK STATUS
      // ====================================

      const isBlocked =
        await checkUserBlocked();

      if (isBlocked) {
        setError(
          "Your account has been blocked by the administrator. You cannot place an order."
        );

        return;
      }

      // ====================================
      // CREATE ORDER
      // ====================================

      const order = {
        userId: user.id,

        customerName: form.name,

        email: form.email,

        phone: form.phone,

        address: form.address,

        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image,
        })),

        subtotal: Number(totalPrice),

        deliveryCharge:
          DELIVERY_CHARGE,

        totalAmount: finalTotal,

        status: "Pending",

        paymentMethod,

        paymentStatus:
          paymentMethod === "cod"
            ? "Pending"
            : "Paid",

        createdAt:
          new Date().toISOString(),
      };

      // ====================================
      // PLACE ORDER
      // ====================================

      const result = await dispatch(
        placeOrder(order)
      );

      // ====================================
      // ORDER SUCCESS
      // ====================================

      if (
        placeOrder.fulfilled.match(result)
      ) {
        // ==================================
        // SAVE PHONE + ADDRESS TO PROFILE
        // ==================================

        try {
          const updatedUser =
            await updateUser(user.id, {
              name: form.name,
              phone: form.phone,
              address: form.address,
            });

          // =================================
          // UPDATE REDUX + LOCAL STORAGE
          // =================================

          dispatch(
            loginSuccess(updatedUser)
          );

          console.log(
            "User profile updated:",
            updatedUser
          );
        } catch (profileError) {
          console.error(
            "Profile update failed:",
            profileError
          );
        }

        // ==================================
        // CLEAR CART
        // ==================================

        dispatch(clearCart());

        // ==================================
        // GO TO ORDERS
        // ==================================

        navigate("/orders");
      } else {
        console.error(
          "Order failed:",
          result.payload
        );

        setError(
          result.payload ||
            "Failed to place order."
        );
      }
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    }
  };

  // ========================================
  // EMPTY CART
  // ========================================

  if (items.length === 0) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f7f1f3]
          flex
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-10
            text-center
            max-w-md
            w-full
          "
        >
          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-full
              bg-[#f8e9ed]
              flex
              items-center
              justify-center
              mb-6
            "
          >
            <ShoppingBag
              size={38}
              className="text-[#ad4058]"
            />
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-[#423640]
            "
          >
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            There is nothing to check out right now.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-[#ad4058]
              text-white
              font-semibold
              hover:bg-[#852f43]
              hover:shadow-lg
              transition-all
            "
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN CHECKOUT
  // ========================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f1f3]
        py-10
        px-4
        md:px-8
      "
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          max-w-6xl
          mx-auto
          mb-8
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
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
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-[#ad4058]
              flex
              items-center
              justify-center
            "
          >
            <CreditCard
              size={24}
              className="text-white"
            />
          </div>

          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-[#423640]
              "
            >
              Checkout
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Complete your order and enjoy your treats.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          MAIN FORM
      ====================================== */}

      <form
        id="checkout-form"
        onSubmit={handlePlaceOrder}
        className="
          max-w-6xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-8
        "
      >
        {/* =================================
            LEFT SIDE
        ================================== */}

        <div className="lg:col-span-2 space-y-6">

          {/* =================================
              DELIVERY INFORMATION
          ================================== */}

          <div
            className="
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-6
              md:p-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-7
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#f8e9ed]
                  flex
                  items-center
                  justify-center
                "
              >
                <User
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#423640]
                  "
                >
                  Delivery Information
                </h2>

                <p className="text-sm text-gray-500">
                  Your saved phone and address are automatically loaded.
                </p>
              </div>
            </div>

            {/* NAME */}

            <div className="mb-5">
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-[#423640]
                  mb-2
                "
              >
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="
                  w-full
                  px-4
                  py-3.5
                  rounded-xl
                  border
                  border-gray-200
                  outline-none
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/20
                "
              />
            </div>

            {/* EMAIL + PHONE */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >
              {/* EMAIL */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-[#423640]
                    mb-2
                  "
                >
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="
                    w-full
                    px-4
                    py-3.5
                    rounded-xl
                    border
                    border-gray-200
                    outline-none
                    focus:border-[#ad4058]
                    focus:ring-2
                    focus:ring-[#ad4058]/20
                  "
                />
              </div>

              {/* PHONE */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-[#423640]
                    mb-2
                  "
                >
                  Phone Number
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="
                    w-full
                    px-4
                    py-3.5
                    rounded-xl
                    border
                    border-gray-200
                    outline-none
                    focus:border-[#ad4058]
                    focus:ring-2
                    focus:ring-[#ad4058]/20
                  "
                />

                
              </div>
            </div>

            {/* ADDRESS */}

            <div className="mt-5">
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-[#423640]
                  mb-2
                "
              >
                Delivery Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                rows="4"
                required
                className="
                  w-full
                  px-4
                  py-3.5
                  rounded-xl
                  border
                  border-gray-200
                  outline-none
                  resize-none
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/20
                "
              />

             
            </div>
          </div>

          {/* =================================
              PAYMENT
          ================================== */}

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-6
              md:p-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#f8e9ed]
                  flex
                  items-center
                  justify-center
                "
              >
                <CreditCard
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-gray-900
                  "
                >
                  Payment Details
                </h2>

                <p className="text-sm text-gray-500">
                  Select a payment method
                </p>
              </div>
            </div>

            {/* PAYMENT METHODS */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >
              {/* CARD */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("card")
                }
                className={`
                  flex
                  items-center
                  gap-3
                  p-4
                  rounded-lg
                  border
                  text-left
                  transition
                  ${
                    paymentMethod === "card"
                      ? "border-[#ad4058] bg-[#fff7f8]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <CreditCard
                  size={22}
                  className={
                    paymentMethod === "card"
                      ? "text-[#ad4058]"
                      : "text-gray-500"
                  }
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Card
                  </p>

                  <p className="text-xs text-gray-500">
                    Credit / Debit
                  </p>
                </div>

                {paymentMethod === "card" && (
                  <CheckCircle
                    size={18}
                    className="ml-auto text-[#ad4058]"
                  />
                )}
              </button>

              {/* UPI */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("upi")
                }
                className={`
                  flex
                  items-center
                  gap-3
                  p-4
                  rounded-lg
                  border
                  text-left
                  transition
                  ${
                    paymentMethod === "upi"
                      ? "border-[#ad4058] bg-[#fff7f8]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <Smartphone
                  size={22}
                  className={
                    paymentMethod === "upi"
                      ? "text-[#ad4058]"
                      : "text-gray-500"
                  }
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    UPI
                  </p>

                  <p className="text-xs text-gray-500">
                    GPay / PhonePe
                  </p>
                </div>

                {paymentMethod === "upi" && (
                  <CheckCircle
                    size={18}
                    className="ml-auto text-[#ad4058]"
                  />
                )}
              </button>

              {/* COD */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("cod")
                }
                className={`
                  flex
                  items-center
                  gap-3
                  p-4
                  rounded-lg
                  border
                  text-left
                  transition
                  ${
                    paymentMethod === "cod"
                      ? "border-[#ad4058] bg-[#fff7f8]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <Wallet
                  size={22}
                  className={
                    paymentMethod === "cod"
                      ? "text-[#ad4058]"
                      : "text-gray-500"
                  }
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    Pay on delivery
                  </p>
                </div>

                {paymentMethod === "cod" && (
                  <CheckCircle
                    size={18}
                    className="ml-auto text-[#ad4058]"
                  />
                )}
              </button>
            </div>

            {/* CARD FORM */}

            {paymentMethod === "card" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>

                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    className="
                      w-full
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-lg
                      text-sm
                      outline-none
                      focus:border-[#ad4058]
                      focus:ring-2
                      focus:ring-[#ad4058]/10
                    "
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM / YY"
                      maxLength="5"
                      required
                      className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        text-sm
                        outline-none
                        focus:border-[#ad4058]
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>

                    <input
                      type="password"
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="•••"
                      maxLength="3"
                      required
                      className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        text-sm
                        outline-none
                        focus:border-[#ad4058]
                      "
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI */}

            {paymentMethod === "upi" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>

                <input
                  type="text"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  placeholder="example@upi"
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-lg
                    text-sm
                    outline-none
                    focus:border-[#ad4058]
                  "
                />

                <p className="text-xs text-gray-500 mt-2">
                  Enter your valid UPI ID to continue.
                </p>
              </div>
            )}

            {/* COD */}

            {paymentMethod === "cod" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-lg
                  "
                >
                  <Wallet
                    size={20}
                    className="text-[#ad4058] mt-0.5"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Pay ₹{finalTotal} in cash when your order is delivered.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================
            RIGHT - ORDER SUMMARY
        ================================== */}

        <div>
          <div
            className="
              bg-white
              rounded-3xl
              shadow-md
              border
              border-gray-100
              p-6
              sticky
              top-24
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#f8e9ed]
                  flex
                  items-center
                  justify-center
                "
              >
                <ShoppingBag
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-[#423640]
                "
              >
                Order Summary
              </h2>
            </div>

            {/* ITEMS */}

            <div
              className="
                mt-6
                space-y-4
                max-h-72
                overflow-y-auto
              "
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-14
                      h-14
                      rounded-xl
                      object-cover
                      bg-gray-100
                    "
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#423640]
                        truncate
                      "
                    >
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[#423640]
                    "
                  >
                    ₹
                    {Number(item.price) *
                      Number(item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 my-6" />

            {/* SUBTOTAL */}

            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium text-[#423640]">
                ₹{totalPrice}
              </span>
            </div>

            {/* DELIVERY */}

            <div className="flex justify-between text-sm mb-5">
              <span className="text-gray-500">
                Delivery
              </span>

              <span className="font-medium text-[#423640]">
                ₹{DELIVERY_CHARGE}
              </span>
            </div>

            <div className="border-t border-gray-100 my-5" />

            {/* TOTAL */}

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#423640]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#ad4058]">
                ₹{finalTotal}
              </span>
            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={orderLoading}
              className="
                w-full
                mt-7
                flex
                items-center
                justify-center
                gap-2
                py-4
                rounded-xl
                bg-[#ad4058]
                text-white
                font-bold
                hover:bg-[#852f43]
                hover:shadow-lg
                active:scale-[0.98]
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                transition-all
              "
            >
              <CheckCircle size={19} />

              {orderLoading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            {/* ERROR MESSAGE */}

            {error && (
              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                  text-red-600
                "
              >
                <AlertCircle
                  size={21}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold">
                    Unable to place order
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Your payment information is secure.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;