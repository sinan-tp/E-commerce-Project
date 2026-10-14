import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1f3] flex items-center justify-center px-6">

      {/* Register Card */}
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
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#423640] mb-2">
            Create an Account
          </h2>

          <p className="text-[#6b6067]">
            Join Bonvivant and enjoy delicious treats
          </p>
        </div>

        {/* Error */}
        {error && (
          <p
            className="
              mb-5
              rounded-lg
              bg-red-50
              px-4
              py-3
              text-center
              text-sm
              text-red-600
            "
          >
            {error}
          </p>
        )}

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#423640] mb-2">
            Full Name
          </label>

          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              border
              border-[#ddd3d7]
              px-4
              py-3
              outline-none
              text-[#423640]
              placeholder:text-[#a69ba1]
              focus:border-[#ad4058]
              focus:ring-2
              focus:ring-[#ad4058]/20
              transition
            "
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#423640] mb-2">
            Email
          </label>

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              border
              border-[#ddd3d7]
              px-4
              py-3
              outline-none
              text-[#423640]
              placeholder:text-[#a69ba1]
              focus:border-[#ad4058]
              focus:ring-2
              focus:ring-[#ad4058]/20
              transition
            "
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-semibold text-[#423640] mb-2">
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              border
              border-[#ddd3d7]
              px-4
              py-3
              outline-none
              text-[#423640]
              placeholder:text-[#a69ba1]
              focus:border-[#ad4058]
              focus:ring-2
              focus:ring-[#ad4058]/20
              transition
            "
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
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
            transition-all
            duration-300
          "
        >
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-[#6b6067] mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-[#ad4058] hover:text-[#852f43] transition"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;

