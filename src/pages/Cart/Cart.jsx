
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  X,
} from "lucide-react";

import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const { items, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  const dispatch = useDispatch();

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f1f3] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md w-full">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#f8e9ed] flex items-center justify-center mb-6">
            <ShoppingBag
              size={38}
              className="text-[#ad4058]"
            />
          </div>

          <h2 className="text-2xl font-bold text-[#423640]">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              mt-6
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
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1f3] py-10 px-4 md:px-8">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#ad4058] flex items-center justify-center">
            <ShoppingBag
              size={24}
              className="text-white"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#423640]">
              Your Cart
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">

          {items.map((item) => {

            // Maximum quantity allowed
            const maxStock = Number(item.stock) || 0;

            // Check if cart reached stock limit
            const isMaxStock =
              maxStock > 0 && item.quantity >= maxStock;

            return (
              <div
                key={item.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  p-4
                  md:p-5
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  gap-5
                  hover:shadow-md
                  transition-all
                  duration-300
                "
              >

                {/* PRODUCT IMAGE */}
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* PRODUCT INFO */}
                <div className="flex-1 w-full">

                  <h3 className="text-lg font-semibold text-[#423640]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-[#ad4058] font-medium mt-1">
                    ₹{item.price} each
                  </p>

                  {/* STOCK */}
                  <p className="text-xs text-gray-500 mt-1">
                    Stock available:{" "}
                    <span className="font-semibold text-[#423640]">
                      {maxStock}
                    </span>
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">

                    {/* DECREASE */}
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(decreaseQuantity(item.id))
                      }
                      disabled={item.quantity <= 1}
                      className="
                        w-9
                        h-9
                        rounded-lg
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        text-[#423640]
                        hover:bg-[#f7e9ed]
                        hover:border-[#ad4058]
                        hover:text-[#ad4058]
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      <Minus size={15} />
                    </button>

                    {/* QUANTITY */}
                    <span className="w-8 text-center font-semibold text-[#423640]">
                      {item.quantity}
                    </span>

                    {/* INCREASE */}
                    <button
                      type="button"
                      onClick={() => {
                        // Only increase if quantity is below stock
                        if (item.quantity < maxStock) {
                          dispatch(increaseQuantity(item.id));
                        }
                      }}
                      disabled={isMaxStock || maxStock <= 0}
                      className="
                        w-9
                        h-9
                        rounded-lg
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        text-[#423640]
                        hover:bg-[#f7e9ed]
                        hover:border-[#ad4058]
                        hover:text-[#ad4058]
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  {/* STOCK LIMIT MESSAGE */}
                  {isMaxStock && (
                    <p className="text-xs text-[#ad4058] font-medium mt-2">
                      Maximum available stock reached
                    </p>
                  )}

                </div>

                {/* PRICE + REMOVE */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3">

                  <p className="text-xl font-bold text-[#423640]">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch(removeItem(item.id))
                    }
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      text-red-500
                      hover:text-red-700
                      transition
                    "
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

          {/* CLEAR CART */}
          <div className="flex justify-end pt-2">

            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-500
                hover:text-red-500
                transition
              "
            >
              <X size={17} />
              Clear Cart
            </button>

          </div>

        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-3">

            <h3 className="text-xl font-bold text-[#423640]">
              Order Summary
            </h3>

            <div className="border-t border-gray-100 my-5" />

            {/* ITEMS */}
            <div className="flex justify-between text-sm mb-4">

              <span className="text-gray-500">
                Items
              </span>

              <span className="font-medium text-[#423640]">
                {totalQuantity}
              </span>

            </div>

            {/* DELIVERY */}
            <div className="flex justify-between text-sm mb-4">

              <span className="text-gray-500">
                Delivery
              </span>

              <span className="text-green-600 font-medium">
                FREE
              </span>

            </div>

            <div className="border-t border-gray-100 my-5" />

            {/* TOTAL */}
            <div className="flex justify-between items-center">

              <span className="text-lg font-semibold text-[#423640]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#ad4058]">
                ₹{totalPrice}
              </span>

            </div>

            {/* CHECKOUT */}
            <Link
              to="/checkout"
              className="
                mt-6
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3.5
                rounded-xl
                bg-[#ad4058]
                text-white
                font-semibold
                hover:bg-[#852f43]
                hover:shadow-lg
                active:scale-[0.98]
                transition-all
                duration-300
              "
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            {/* CONTINUE SHOPPING */}
            <Link
              to="/products"
              className="
                mt-4
                w-full
                flex
                items-center
                justify-center
                py-3
                rounded-xl
                border
                border-[#ad4058]
                text-[#ad4058]
                font-semibold
                hover:bg-[#ad4058]
                hover:text-white
                transition-all
              "
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
