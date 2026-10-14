
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addItem } from "../../redux/slices/cartSlice";

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const moveToCart = (product) => {
    dispatch(addItem(product));
    dispatch(removeFromWishlist(product.id));
  };

  // Empty Wishlist
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f1f3] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md w-full">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#f8e9ed] flex items-center justify-center mb-6">
            <Heart
              size={38}
              className="text-[#ad4058]"
            />
          </div>

          <h2 className="text-2xl font-bold text-[#423640]">
            Your Wishlist is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Save your favorite cakes and pastries here.
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
            Explore Products
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
            <Heart
              size={24}
              className="text-white"
              fill="currentColor"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#423640]">
              Wishlist
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>

        </div>

      </div>

      {/* WISHLIST ITEMS */}
      <div className="max-w-6xl mx-auto space-y-4">

        {items.map((item) => (

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
              hover:shadow-lg
              transition-all
              duration-300
            "
          >

            {/* IMAGE */}
            <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

              <img
                src={item.image}
                alt={item.name}
                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition-transform
                  duration-500
                "
              />

            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 w-full text-center sm:text-left">

              <p className="text-xs uppercase tracking-wider text-[#ad4058] font-semibold mb-1">
                Saved Item
              </p>

              <h3 className="text-lg font-semibold text-[#423640]">
                {item.name}
              </h3>

              <p className="text-xl font-bold text-[#ad4058] mt-2">
                ₹{item.price}
              </p>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              {/* MOVE TO CART */}
              <button
                type="button"
                onClick={() => moveToCart(item)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
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
                <ShoppingCart size={17} />
                Move to Cart
              </button>

              {/* REMOVE */}
              <button
                type="button"
                onClick={() =>
                  dispatch(removeFromWishlist(item.id))
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-gray-200
                  text-gray-500
                  font-semibold
                  hover:border-red-300
                  hover:bg-red-50
                  hover:text-red-500
                  transition-all
                "
              >
                <Trash2 size={17} />
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* BOTTOM SHOPPING LINK */}
      <div className="max-w-6xl mx-auto mt-8">

        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            text-[#ad4058]
            font-semibold
            hover:text-[#852f43]
            transition
          "
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>

      </div>

    </div>
  );
};

export default Wishlist;

