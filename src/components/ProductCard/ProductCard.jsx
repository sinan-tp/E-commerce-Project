import {
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  addItem,
  removeItem,
} from "../../redux/slices/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

import { useState } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ========================================
  // NOTIFICATION
  // ========================================

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  // ========================================
  // USER
  // ========================================

  const user = useSelector(
    (state) => state.auth?.user
  );


  // CART


  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const cartItem = cartItems.find(
    (item) =>
      String(item.id) === String(product.id)
  );

  const isInCart = Boolean(cartItem);

  const cartQuantity = cartItem
    ? Number(cartItem.quantity) || 0
    : 0;

  // ========================================
  // WISHLIST
  // ========================================

  const wishlist = useSelector(
    (state) => state.wishlist?.items || []
  );

  const isWishlisted = wishlist.some(
    (item) =>
      String(item.id) === String(product.id)
  );

  // ========================================
  // STOCK
  // ========================================

  const totalStock =
    Number(product.stock) || 0;

  const outOfStock = totalStock <= 0;

  // ========================================
  // PRODUCT DETAILS
  // ========================================

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  // ========================================
  // ADD / REMOVE CART
  // ========================================

  const handleCartClick = (e) => {
    e.stopPropagation();

    // Login required
    if (!user) {
      navigate("/login");
      return;
    }

    // ======================================
    // REMOVE FROM CART
    // ======================================

    if (isInCart) {
      dispatch(removeItem(product.id));

      showNotification(
        `${product.name} removed from cart`,
        "remove"
      );

      return;
    }

    // ======================================
    // OUT OF STOCK
    // ======================================

    if (outOfStock) {
      showNotification(
        "This product is out of stock",
        "error"
      );

      return;
    }

    // ======================================
    // ADD TO CART
    // ======================================

    dispatch(addItem(product));

    showNotification(
      `${product.name} added to cart`,
      "success"
    );
  };

  // ========================================
  // WISHLIST
  // ========================================

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      dispatch(
        removeFromWishlist(product.id)
      );

      showNotification(
        `${product.name} removed from wishlist`,
        "remove"
      );

      return;
    }

    dispatch(addToWishlist(product));

    showNotification(
      `${product.name} added to wishlist`,
      "success"
    );
  };


  return (
    <>
      {/* ==================================
          NOTIFICATION
      =================================== */}

      {notification && (
        <div
          className={`
            fixed
            top-5
            right-5
            z-[9999]
            flex
            items-center
            gap-3
            px-5
            py-3.5
            rounded-xl
            shadow-2xl
            text-white
            font-medium
            transition-all
            duration-300

            ${
              notification.type === "remove"
                ? "bg-[#423640]"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-green-600"
            }
          `}
        >
          <span className="text-lg">
            {notification.type === "remove"
              ? "🗑️"
              : notification.type === "error"
              ? "⚠️"
              : "✓"}
          </span>

          <span>
            {notification.message}
          </span>
        </div>
      )}

      {/* ==================================
          PRODUCT CARD
      =================================== */}

      <div
        onClick={handleProductClick}
        className="
          group
          bg-white
          rounded-2xl
          overflow-hidden
          border
          border-gray-200
          shadow-sm
          hover:shadow-xl
          hover:-translate-y-1
          transition-all
          duration-300
          cursor-pointer
        "
      >
        {/* ==================================
            IMAGE
        =================================== */}

        <div
          className="
            relative
            h-64
            bg-[#f1e7ea]
            overflow-hidden
          "
        >
          {/* PRODUCT IMAGE */}

          <img
            src={product.image}
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />

          {/* DISCOUNT */}

          <span
            className="
              absolute
              top-4
              left-4
              bg-[#ad4058]
              text-white
              text-xs
              font-semibold
              px-3
              py-1.5
              rounded-full
              z-10
            "
          >
            10% OFF
          </span>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={handleWishlist}
            className={`
              absolute
              top-4
              right-4
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              shadow-md
              transition-all
              duration-300
              z-10

              ${
                isWishlisted
                  ? "bg-[#ad4058] text-white"
                  : "bg-white/95 text-[#423640] hover:bg-[#ad4058] hover:text-white"
              }
            `}
          >
            <Heart
              size={19}
              fill={
                isWishlisted
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

          {/* OUT OF STOCK */}

          {outOfStock && (
            <div
              className="
                absolute
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-20
              "
            >
              <span
                className="
                  bg-white
                  text-red-500
                  font-bold
                  px-5
                  py-2.5
                  rounded-xl
                  shadow-lg
                "
              >
                Out of Stock
              </span>
            </div>
          )}

          {/* IN CART BADGE */}

          {isInCart && !outOfStock && (
            <div
              className="
                absolute
                bottom-4
                left-4
                bg-white
                text-[#ad4058]
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
                shadow-lg
                z-20
              "
            >
              ✓ In Cart
            </div>
          )}
        </div>

        {/* ==================================
            CONTENT
        =================================== */}

        <div className="p-5">

          {/* CATEGORY */}

          <p
            className="
              text-xs
              uppercase
              tracking-[0.15em]
              font-semibold
              text-[#ad4058]
              mb-2
            "
          >
            {product.category}
          </p>

          {/* NAME */}

          <h2
            className="
              text-xl
              font-bold
              text-[#423640]
              line-clamp-1
              group-hover:text-[#ad4058]
              transition
            "
          >
            {product.name}
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              text-sm
              text-gray-500
              leading-relaxed
              mt-3
              line-clamp-2
              min-h-[40px]
            "
          >
            {product.description}
          </p>

          {/* PRICE */}

          <div
            className="
              flex
              items-center
              gap-3
              mt-5
              flex-wrap
            "
          >
            <span
              className="
                text-2xl
                font-bold
                text-[#423640]
              "
            >
              ₹{product.price}
            </span>

            <span
              className="
                text-sm
                text-gray-400
                line-through
              "
            >
              ₹{Number(product.price) + 200}
            </span>

            <span
              className="
                text-xs
                font-semibold
                text-green-600
              "
            >
              10% OFF
            </span>
          </div>

          {/* STOCK */}

          <div className="mt-3">

            {totalStock > 0 ? (
              <p
                className="
                  text-xs
                  text-green-600
                  font-medium
                "
              >
                ✓ In Stock ({totalStock} available)
              </p>
            ) : (
              <p
                className="
                  text-xs
                  text-red-500
                  font-medium
                "
              >
                ✕ Currently unavailable
              </p>
            )}

          </div>

          

              {/* ADD / REMOVE BUTTON */}
          

          <button
            type="button"
            disabled={outOfStock && !isInCart}
            onClick={handleCartClick}
            className={`
              w-full
              mt-5
              flex
              items-center
              justify-center
              gap-2
              py-3.5
              rounded-xl
              font-semibold
              active:scale-[0.98]
              transition-all
              duration-300

              ${
                isInCart
                  ? "bg-[#423640] text-white hover:bg-[#2f272d] hover:shadow-lg"
                  : outOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#ad4058] text-white hover:bg-[#852f43] hover:shadow-lg"
              }
            `}
          >
            {isInCart ? (
              <>
                <Trash2 size={19} />
                Remove from Cart
              </>
            ) : (
              <>
                <ShoppingCart size={19} />
                {outOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;