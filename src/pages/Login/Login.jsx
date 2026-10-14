
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/userService";
import { loginSuccess } from "../../redux/slices/authSlice";
import { loadUserCart } from "../../redux/slices/cartSlice";
import { loadUserWishlist } from "../../redux/slices/wishlistSlice";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Remove error when user starts typing
    if (error) {
      setError("");
    }
  };

  // =====================================
  // LOGIN
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // =================================
      // CHECK EMAIL + PASSWORD
      // AND BLOCK STATUS
      // =================================

      const user = await loginUser(form);

      // =================================
      // EXTRA BLOCK CHECK
      // =================================

      if (
        user.isBlocked === true ||
        user.isBlocked === "true"
      ) {
        setError(
          "Your account has been blocked by the administrator."
        );

        return;
      }

      // =================================
      // SAVE USER
      // =================================

      dispatch(loginSuccess(user));

      // =================================
      // LOAD USER CART
      // =================================

      dispatch(loadUserCart());

      // =================================
      // LOAD USER WISHLIST
      // =================================

      dispatch(loadUserWishlist());

      // =================================
      // GO HOME
      // =================================

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

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
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          p-8
          md:p-10
        "
      >
        {/* =================================
            HEADER
        ================================== */}

        <div className="text-center mb-8">
          <h2
            className="
              text-4xl
              font-bold
              text-[#423640]
              mb-2
            "
          >
            Welcome Back
          </h2>

          <p className="text-[#6b6067]">
            Login to your Bonvivant account
          </p>
        </div>

        {/* =================================
            ERROR
        ================================== */}

        {error && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-center
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* =================================
            EMAIL
        ================================== */}

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
            Email
          </label>

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-[#ddd3d7]
              px-4
              py-3
              outline-none
              text-[#423640]
              focus:border-[#ad4058]
              focus:ring-2
              focus:ring-[#ad4058]/20
              transition
              disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
          />
        </div>

        {/* =================================
            PASSWORD
        ================================== */}

        <div className="mb-7">
          <label
            className="
              block
              text-sm
              font-semibold
              text-[#423640]
              mb-2
            "
          >
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-[#ddd3d7]
              px-4
              py-3
              outline-none
              text-[#423640]
              focus:border-[#ad4058]
              focus:ring-2
              focus:ring-[#ad4058]/20
              transition
              disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
          />
        </div>

        {/* =================================
            LOGIN BUTTON
        ================================== */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-[#ad4058]
            py-3.5
            text-white
            font-semibold
            hover:bg-[#852f43]
            hover:-translate-y-0.5
            hover:shadow-lg
            hover:shadow-[#ad4058]/20
            disabled:bg-gray-300
            disabled:hover:translate-y-0
            disabled:hover:shadow-none
            disabled:cursor-not-allowed
            transition-all
            duration-300
          "
        >
          {loading
            ? "Checking..."
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
