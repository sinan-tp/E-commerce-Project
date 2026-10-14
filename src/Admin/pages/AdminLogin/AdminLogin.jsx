import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/admins?email=${form.email}&password=${form.password}`
      );

      const admins = await response.json();

      if (admins.length === 0) {
        setError("Invalid admin email or password");
        return;
      }

      const admin = admins[0];

      localStorage.setItem("admin", JSON.stringify(admin));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f6] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}

        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ad4058] flex items-center justify-center">
            <ShieldCheck
              size={34}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#423640]">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to manage Bonvivant
          </p>

        </div>


        {/* Login Card */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-[#423640] mb-2">
                Email
              </label>

              <div className="relative">


                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  required
                  className="
                    w-full
                    pl-11
                    pr-4
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


            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-[#423640] mb-2">
                Password
              </label>

              <div className="relative">

                

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="
                    w-full
                    pl-11
                    pr-4
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


            {/* Error */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3.5
                rounded-xl
                bg-[#ad4058]
                hover:bg-[#852f43]
                text-white
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>


        {/* Back */}

        <button
          onClick={() => navigate("/")}
          className="
            w-full
            mt-5
            text-sm
            text-gray-500
            hover:text-[#ad4058]
          "
        >
          ← Back to Bonvivant
        </button>

      </div>

    </div>
  );
};

export default AdminLogin;