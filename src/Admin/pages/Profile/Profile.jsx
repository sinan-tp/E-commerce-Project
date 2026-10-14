import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";

const Profile = () => {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin")) || {};
    } catch { 
      return {};
    } 
  });

  const [form, setForm] = useState({
    name: admin.name || "Admin",
    email: admin.email || "",
    password: "", 
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.password &&
      form.password !== form.confirmPassword
    ) {
      setMessage("Passwords do not match.");
      return;
    }
    
    const updatedAdmin = {
      ...admin,
      name: form.name,  
      email: form.email,
    };

    localStorage.setItem(
      "admin",
      JSON.stringify(updatedAdmin)
    );

    setAdmin(updatedAdmin); 

    setForm((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));

    setMessage("Profile updated successfully.");
  };

  return (
    <div className=" max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#423640]">
          Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your admin account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Profile */}
        <div className=" bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#f8e9ed] flex items-center justify-center">
              <User
                size={42}
                className="text-[#ad4058]"
              />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#423640]">
              {form.name || "Admin"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {form.email || "Administrator"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8e9ed] text-[#ad4058] text-sm font-medium">
              <ShieldCheck size={16} />
              Administrator
            </div>

          </div>

        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#423640]">
              Account Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update your account details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#423640] mb-2">
                Full Name
              </label>

              <div className="relative">
              

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    outline-none
                    focus:border-[#ad4058]
                    focus:ring-2
                    focus:ring-[#ad4058]/20
                  "
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#423640] mb-2">
                Email Address
              </label>

              <div className="relative">
               

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    outline-none
                    focus:border-[#ad4058]
                    focus:ring-2
                    focus:ring-[#ad4058]/20
                  "
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[#423640] mb-2">
                New Password
              </label>

              <div className="relative">
               

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#423640] mb-2">
                Confirm Password
              </label>

              <div className="relative">
                

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
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

            {/* Message */}
            {message && (
              <div
                className={`
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }
                `}
              >
                {message}
              </div>
            )}

            {/* Save */}
            <button
              type="submit"
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-[#ad4058]
                text-white
                px-6
                py-3
                rounded-xl
                font-medium
                hover:bg-[#852f43]
                transition
              "
            >
              <Save size={18} />
              Save Changes
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Profile;