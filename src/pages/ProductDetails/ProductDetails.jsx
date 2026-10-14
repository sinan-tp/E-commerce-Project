
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Trash2,
  Check,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

import {
  getProductById,
} from "../../services/productService";

import {
  getUserById,
} from "../../services/userService";

import {
  addItem,
  removeItem,
} from "../../redux/slices/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

import Loader from "../../components/Loader/Loader";


const ProductDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // =====================================================
  // USER
  // =====================================================

  const user = useSelector(
    (state) => state.auth?.user
  );


  // =====================================================
  // CART
  // =====================================================

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );


  // =====================================================
  // WISHLIST
  // =====================================================

  const wishlist = useSelector(
    (state) => state.wishlist?.items || []
  );


  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] =
    useState(null);


  // =====================================================
  // NOTIFICATION
  // =====================================================

  const showNotification = (
    message,
    type = "success"
  ) => {

    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 2500);

  };


  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);

        const data =
          await getProductById(id);

        setProduct(data);

      } catch (error) {

        console.error(
          "Product fetch error:",
          error
        );

        setProduct(null);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  // =====================================================
  // CHECK USER BLOCKED
  // =====================================================

  const checkUserBlocked = async () => {

    // -----------------------------------------------
    // USER NOT LOGGED IN
    // -----------------------------------------------

    if (!user?.id) {

      navigate("/login");

      return true;
    }


    try {

      // Get latest user from JSON Server
      const latestUser =
        await getUserById(user.id);


      // -----------------------------------------------
      // CHECK BLOCK STATUS
      // -----------------------------------------------

      if (
        latestUser.isBlocked === true ||
        latestUser.isBlocked === "true"
      ) {

        showNotification(
          "Your account has been blocked by the administrator.",
          "error"
        );

        return true;
      }


      // User is not blocked
      return false;

    } catch (error) {

      console.error(
        "User status check failed:",
        error
      );

      showNotification(
        "Unable to verify your account. Please try again.",
        "error"
      );

      // Stop the action if verification fails
      return true;
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return <Loader />;

  }


  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {

    return (

      <div className="
        min-h-screen
        bg-[#f8f5f6]
        flex
        items-center
        justify-center
        px-4
      ">

        <div className="
          w-full
          max-w-md
          bg-white
          border
          border-gray-100
          rounded-3xl
          shadow-xl
          p-8
          text-center
        ">

          <div className="
            w-14
            h-14
            mx-auto
            rounded-full
            bg-[#f8e9ed]
            flex
            items-center
            justify-center
            text-[#ad4058]
            mb-4
          ">

            <ShoppingCart size={25} />

          </div>


          <h2 className="
            text-xl
            font-bold
            text-[#423640]
          ">

            Product not found

          </h2>


          <p className="
            mt-2
            text-sm
            leading-relaxed
            text-gray-500
          ">

            This product may have been removed
            or is currently unavailable.

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
              justify-center
              px-6
              py-2.5
              rounded-xl
              bg-[#ad4058]
              text-white
              font-semibold
              hover:bg-[#852f43]
              transition-all
              duration-300
            "
          >

            Back to Products

          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // STOCK
  // =====================================================

  const totalStock =
    Number(product.stock) || 0;


  // =====================================================
  // FIND PRODUCT IN CART
  // =====================================================

  const cartItem =
    cartItems.find(
      (item) =>
        String(item.id) ===
        String(product.id)
    );


  // =====================================================
  // CART QUANTITY
  // =====================================================

  const cartQuantity =
    cartItem
      ? Number(cartItem.quantity) || 0
      : 0;


  // =====================================================
  // PRODUCT IS IN CART
  // =====================================================

  const isInCart =
    Boolean(cartItem);


  // =====================================================
  // STOCK STATUS
  // =====================================================

  const outOfStock =
    totalStock <= 0;


  // =====================================================
  // WISHLIST STATUS
  // =====================================================

  const isWishlisted =
    wishlist.some(
      (item) =>
        String(item.id) ===
        String(product.id)
    );


  // =====================================================
  // ADD / REMOVE CART
  // =====================================================

  const handleCartClick = async () => {

    // -----------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------

    if (!user) {

      navigate("/login");

      return;
    }


    // -----------------------------------------------
    // BLOCK CHECK
    // -----------------------------------------------

    const isBlocked =
      await checkUserBlocked();


    if (isBlocked) {

      return;

    }


    // -----------------------------------------------
    // REMOVE FROM CART
    // -----------------------------------------------

    if (isInCart) {

      dispatch(
        removeItem(product.id)
      );

      showNotification(
        `${product.name} removed from cart`,
        "remove"
      );

      setQuantity(1);

      return;

    }


    // -----------------------------------------------
    // OUT OF STOCK
    // -----------------------------------------------

    if (outOfStock) {

      showNotification(
        "This product is out of stock",
        "error"
      );

      return;

    }


    // -----------------------------------------------
    // INVALID QUANTITY
    // -----------------------------------------------

    if (
      quantity < 1 ||
      quantity > totalStock
    ) {

      showNotification(
        "Invalid quantity",
        "error"
      );

      return;

    }


    // -----------------------------------------------
    // ADD TO CART
    // -----------------------------------------------

    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      dispatch(
        addItem(product)
      );

    }


    showNotification(
      `${quantity} ${
        quantity === 1
          ? "item"
          : "items"
      } added to cart`,
      "success"
    );


    setQuantity(1);

  };


  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = async () => {

    // -----------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------

    if (!user) {

      navigate("/login");

      return;

    }


    // -----------------------------------------------
    // BLOCK CHECK
    // -----------------------------------------------

    const isBlocked =
      await checkUserBlocked();


    if (isBlocked) {

      return;

    }


    // -----------------------------------------------
    // OUT OF STOCK
    // -----------------------------------------------

    if (outOfStock) {

      showNotification(
        "This product is out of stock",
        "error"
      );

      return;

    }


    // -----------------------------------------------
    // INVALID QUANTITY
    // -----------------------------------------------

    if (
      quantity < 1 ||
      quantity > totalStock
    ) {

      showNotification(
        "Invalid quantity",
        "error"
      );

      return;

    }


    // -----------------------------------------------
    // ADD SELECTED QUANTITY
    // -----------------------------------------------

    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      dispatch(
        addItem(product)
      );

    }


    // -----------------------------------------------
    // GO TO CHECKOUT
    // -----------------------------------------------

    navigate("/checkout");

  };


  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = async () => {

    // -----------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------

    if (!user) {

      navigate("/login");

      return;

    }


    // -----------------------------------------------
    // BLOCK CHECK
    // -----------------------------------------------

    const isBlocked =
      await checkUserBlocked();


    if (isBlocked) {

      return;

    }


    // -----------------------------------------------
    // REMOVE WISHLIST
    // -----------------------------------------------

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


    // -----------------------------------------------
    // ADD WISHLIST
    // -----------------------------------------------

    dispatch(
      addToWishlist(product)
    );


    showNotification(
      `${product.name} added to wishlist`,
      "success"
    );

  };


  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = () => {

    setQuantity(
      (current) =>
        Math.min(
          totalStock,
          current + 1
        )
    );

  };


  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = () => {

    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );

  };


  // =====================================================
  // MANUAL QUANTITY
  // =====================================================

  const handleQuantityChange = (e) => {

    const value =
      Number(e.target.value);


    if (
      Number.isNaN(value) ||
      value < 1
    ) {

      setQuantity(1);

      return;

    }


    if (
      value > totalStock
    ) {

      setQuantity(
        totalStock
      );

      return;

    }


    setQuantity(value);

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="
      min-h-screen
      bg-[#f8f5f6]
      py-5
      md:py-7
      px-4
      sm:px-6
      lg:px-8
    ">


      {/* =================================================
          NOTIFICATION
      ================================================= */}

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
            py-3
            rounded-xl
            shadow-2xl
            text-white
            font-medium
            text-sm

            ${
              notification.type === "remove"
                ? "bg-[#423640]"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-green-600"
            }
          `}
        >

          <span className="text-base">

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


      {/* =================================================
          PAGE CONTAINER
      ================================================= */}

      <div className="
        max-w-6xl
        mx-auto
      ">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            group
            inline-flex
            items-center
            gap-2
            mb-4
            text-sm
            font-semibold
            text-[#423640]
            hover:text-[#ad4058]
            transition-colors
          "
        >

          <span className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-full
            bg-white
            border
            border-gray-200
            shadow-sm
            group-hover:border-[#ad4058]
            transition-all
          ">

            <ArrowLeft size={16} />

          </span>

          Back to Products

        </button>


        {/* =================================================
            MAIN PRODUCT CARD
        ================================================= */}

        <div className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-[0_15px_40px_rgba(66,54,64,0.08)]
          overflow-hidden
          grid
          grid-cols-1
          lg:grid-cols-[1fr_1fr]
        ">


          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div className="
            relative
            bg-[#f1e7ea]
            min-h-[320px]
            sm:min-h-[380px]
            lg:min-h-[480px]
            overflow-hidden
          ">

            <img
              src={product.image}
              alt={product.name}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                hover:scale-[1.03]
              "
            />


            <div className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-black/10
              pointer-events-none
            " />


            {/* DISCOUNT */}

            <div className="
              absolute
              top-5
              left-5
              z-10
              inline-flex
              items-center
              gap-1
              bg-[#ad4058]
              text-white
              text-xs
              font-bold
              tracking-wide
              px-3
              py-2
              rounded-full
              shadow-lg
            ">

              10% OFF

            </div>


            {/* OUT OF STOCK */}

            {outOfStock && (

              <div className="
                absolute
                inset-0
                z-20
                bg-black/45
                backdrop-blur-[2px]
                flex
                items-center
                justify-center
              ">

                <div className="
                  bg-white
                  rounded-2xl
                  px-6
                  py-4
                  text-center
                  shadow-2xl
                ">

                  <p className="
                    text-xs
                    uppercase
                    tracking-widest
                    font-semibold
                    text-gray-400
                  ">

                    Availability

                  </p>


                  <p className="
                    mt-1
                    text-lg
                    font-bold
                    text-red-500
                  ">

                    Out of Stock

                  </p>

                </div>

              </div>

            )}


            {/* IN CART */}

            {isInCart && !outOfStock && (

              <div className="
                absolute
                bottom-5
                left-5
                z-20
                bg-white
                text-[#ad4058]
                px-3.5
                py-1.5
                rounded-full
                text-xs
                font-bold
                shadow-lg
              ">

                ✓ In Cart ({cartQuantity})

              </div>

            )}

          </div>


          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="
            p-5
            sm:p-6
            md:p-7
            lg:p-8
            flex
            flex-col
            justify-center
          ">


            {/* CATEGORY */}

            <div className="
              flex
              items-center
              gap-3
              mb-3
            ">

              <span className="
                text-[11px]
                uppercase
                tracking-[0.2em]
                font-bold
                text-[#ad4058]
              ">

                {product.category}

              </span>


              <span className="
                w-8
                h-px
                bg-[#ad4058]/30
              " />

            </div>


            {/* NAME */}

            <h1 className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              leading-tight
              font-bold
              tracking-tight
              text-[#423640]
            ">

              {product.name}

            </h1>


            {/* DESCRIPTION */}

            <p className="
              mt-3
              text-sm
              leading-6
              text-gray-500
              max-w-xl
            ">

              {product.description}

            </p>


            {/* PRICE */}

            <div className="
              flex
              items-center
              flex-wrap
              gap-3
              mt-5
            ">

              <span className="
                text-2xl
                sm:text-3xl
                font-bold
                text-[#423640]
              ">

                ₹{product.price}

              </span>


              <span className="
                text-sm
                sm:text-base
                text-gray-400
                line-through
              ">

                ₹{Number(product.price) + 200}

              </span>


              <span className="
                inline-flex
                items-center
                px-2.5
                py-1
                rounded-full
                bg-green-50
                text-green-600
                text-[11px]
                font-bold
              ">

                Save 10%

              </span>

            </div>


            {/* STOCK */}

            <div className="mt-4">

              {totalStock > 0 ? (

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-green-50
                  border
                  border-green-100
                  text-green-700
                  text-xs
                  font-semibold
                ">

                  <span className="
                    flex
                    items-center
                    justify-center
                    w-5
                    h-5
                    rounded-full
                    bg-green-500
                    text-white
                  ">

                    <Check
                      size={11}
                      strokeWidth={3}
                    />

                  </span>

                  In Stock ({totalStock} available)

                </div>

              ) : (

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-red-50
                  border
                  border-red-100
                  text-red-600
                  text-xs
                  font-semibold
                ">

                  Currently unavailable

                </div>

              )}

            </div>


            {/* CART STATUS */}

            {isInCart && (

              <div className="
                mt-4
                rounded-xl
                border
                border-[#ad4058]/15
                bg-[#fdf5f7]
                p-3
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  flex-wrap
                ">

                  <div>

                    <p className="
                      text-sm
                      font-bold
                      text-[#423640]
                    ">

                      Already in your cart

                    </p>


                    <p className="
                      text-xs
                      text-gray-500
                      mt-1
                    ">

                      {cartQuantity}{" "}
                      {cartQuantity === 1
                        ? "item"
                        : "items"}{" "}
                      of this product

                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigate("/cart")
                    }
                    className="
                      text-xs
                      font-bold
                      text-[#ad4058]
                      hover:underline
                    "
                  >

                    View Cart →

                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                QUANTITY
            ================================================= */}

            {!isInCart &&
              !outOfStock && (

                <div className="mt-5">

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  ">

                    <label className="
                      text-sm
                      font-bold
                      text-[#423640]
                    ">

                      Quantity

                    </label>


                    <span className="
                      text-xs
                      text-gray-400
                    ">

                      Max {totalStock}

                    </span>

                  </div>


                  <div className="
                    inline-flex
                    items-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    overflow-hidden
                  ">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                      className="
                        w-11
                        h-11
                        flex
                        items-center
                        justify-center
                        text-xl
                        font-medium
                        text-[#423640]
                        hover:bg-[#f8f5f6]
                        disabled:text-gray-300
                        disabled:cursor-not-allowed
                        transition
                      "
                    >

                      −

                    </button>


                    <input
                      type="number"
                      min="1"
                      max={totalStock}
                      value={quantity}
                      onChange={
                        handleQuantityChange
                      }
                      className="
                        w-12
                        h-11
                        text-center
                        text-sm
                        font-bold
                        text-[#423640]
                        border-x
                        border-gray-200
                        outline-none
                        bg-white
                      "
                    />


                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >= totalStock
                      }
                      className="
                        w-11
                        h-11
                        flex
                        items-center
                        justify-center
                        text-xl
                        font-medium
                        text-[#423640]
                        hover:bg-[#f8f5f6]
                        disabled:text-gray-300
                        disabled:cursor-not-allowed
                        transition
                      "
                    >

                      +

                    </button>

                  </div>

                </div>

              )}


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-3
              mt-6
            ">


              {/* ADD / REMOVE CART */}

              <button
                type="button"
                disabled={
                  outOfStock && !isInCart
                }
                onClick={
                  handleCartClick
                }
                className={`
                  min-h-[50px]
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  rounded-xl
                  font-bold
                  text-sm
                  active:scale-[0.98]
                  transition-all
                  duration-300

                  ${
                    isInCart
                      ? `
                        bg-[#423640]
                        text-white
                        hover:bg-[#2f272d]
                        hover:shadow-lg
                      `
                      : `
                        bg-[#ad4058]
                        text-white
                        hover:bg-[#852f43]
                        hover:shadow-lg
                      `
                  }

                  ${
                    outOfStock && !isInCart
                      ? `
                        bg-gray-100
                        text-gray-400
                        cursor-not-allowed
                        shadow-none
                      `
                      : ""
                  }
                `}
              >

                {isInCart ? (

                  <>

                    <Trash2 size={17} />

                    Remove

                  </>

                ) : (

                  <>

                    <ShoppingCart size={17} />

                    {outOfStock
                      ? "Out of Stock"
                      : quantity > 1
                      ? `Add ${quantity}`
                      : "Add to Cart"}

                  </>

                )}

              </button>


              {/* BUY NOW */}

              <button
                type="button"
                disabled={outOfStock}
                onClick={
                  handleBuyNow
                }
                className="
                  min-h-[50px]
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  rounded-xl
                  bg-[#423640]
                  text-white
                  font-bold
                  text-sm
                  hover:bg-[#2f272d]
                  hover:shadow-lg
                  active:scale-[0.98]
                  disabled:bg-gray-100
                  disabled:text-gray-400
                  disabled:cursor-not-allowed
                  transition-all
                  duration-300
                "
              >

                <Zap size={17} />

                Buy Now

              </button>


              {/* WISHLIST */}

              <button
                type="button"
                onClick={
                  handleWishlist
                }
                className="
                  min-h-[50px]
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  rounded-xl
                  border
                  border-[#ad4058]
                  bg-white
                  text-[#ad4058]
                  font-bold
                  text-sm
                  hover:bg-[#ad4058]
                  hover:text-white
                  hover:shadow-lg
                  active:scale-[0.98]
                  transition-all
                  duration-300
                "
              >

                <Heart
                  size={17}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />

                {isWishlisted
                  ? "Wishlisted"
                  : "Wishlist"}

              </button>

            </div>


            {/* =================================================
                BENEFITS
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
              mt-5
              pt-5
              border-t
              border-gray-100
            ">


              {/* DELIVERY */}

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  w-9
                  h-9
                  shrink-0
                  rounded-lg
                  bg-[#f8e9ed]
                  flex
                  items-center
                  justify-center
                  text-[#ad4058]
                ">

                  <Truck size={17} />

                </div>


                <div>

                  <p className="
                    text-xs
                    font-bold
                    text-[#423640]
                  ">

                    Fast Delivery

                  </p>


                  <p className="
                    text-[10px]
                    text-gray-400
                    mt-0.5
                  ">

                    Freshly delivered

                  </p>

                </div>

              </div>


              {/* SECURITY */}

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  w-9
                  h-9
                  shrink-0
                  rounded-lg
                  bg-[#f8e9ed]
                  flex
                  items-center
                  justify-center
                  text-[#ad4058]
                ">

                  <ShieldCheck size={17} />

                </div>


                <div>

                  <p className="
                    text-xs
                    font-bold
                    text-[#423640]
                  ">

                    Secure Checkout

                  </p>


                  <p className="
                    text-[10px]
                    text-gray-400
                    mt-0.5
                  ">

                    Safe & trusted payment

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default ProductDetails;
