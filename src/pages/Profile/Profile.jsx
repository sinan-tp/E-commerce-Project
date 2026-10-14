
import { useState } from "react";
import {

  
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { updateUser } from "../../services/userService";

const Profile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f8e9ed] flex items-center justify-center">
            <User
              size={30}
              className="text-[#ad4058]"
            />
          </div>

          <h2 className="text-xl font-semibold text-[#423640]">
            Login Required
          </h2>

          <p className="text-gray-500 mt-2">
            You need to log in to view your profile.
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // =========================
  // PHONE CHANGE
  // =========================

  const handlePhoneChange = (e) => {
    // Only numbers
    const value = e.target.value.replace(/\D/g, "");

    // Maximum 10 digits
    if (value.length <= 10) {
      setForm((previous) => ({
        ...previous,
        phone: value,
      }));
    }

    setError("");
    setMessage("");
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setError("");
    setMessage("");

    setEditing(true);
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setError("");
    setMessage("");

    setEditing(false);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    setError("");
    setMessage("");

    // Name validation
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    // Email validation
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    // Phone validation
    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    // Address validation
    if (!form.address.trim()) {
      setError("Address is required.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // UPDATE USER
      // =========================

      const updatedUser = await updateUser(user.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      // =========================
      // UPDATE REDUX
      // =========================

      dispatch(loginSuccess(updatedUser));

      // =========================
      // UPDATE LOCAL STORAGE
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // =========================
      // UPDATE FORM
      // =========================

      setForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });

      // =========================
      // SUCCESS
      // =========================

      setMessage("Profile updated successfully.");

      // Exit edit mode
      setEditing(false);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">

      <div className="max-w-2xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#ad4058] flex items-center justify-center shadow-md">
            <User
              size={38}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#423640] mt-4">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your account information
          </p>

        </div>

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* ================= CARD HEADER ================= */}

          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[#423640]">
                Personal Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your account details
              </p>
            </div>

            {/* EDIT BUTTON */}

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-[#ad4058]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#852f43]
                  transition
                "
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}

          </div>

          {/* ================= SUCCESS MESSAGE ================= */}

          {message && (
            <div className="mx-6 mt-5 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          )}

          {/* ================= ERROR MESSAGE ================= */}

          {error && (
            <div className="mx-6 mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ================= DETAILS ================= */}

          <div className="p-6 space-y-5">

            {/* ================= NAME ================= */}

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

              <div className="w-11 h-11 rounded-lg bg-[#f8e9ed] flex items-center justify-center flex-shrink-0">
                <User
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Name
                </p>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="
                      w-full
                      px-4
                      py-2.5
                      rounded-lg
                      border
                      border-gray-300
                      outline-none
                      focus:border-[#ad4058]
                      focus:ring-2
                      focus:ring-[#ad4058]/20
                    "
                  />
                ) : (
                  <p className="text-base font-semibold text-[#423640]">
                    {user.name}
                  </p>
                )}

              </div>

            </div>

            {/* ================= EMAIL ================= */}

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

              <div className="w-11 h-11 rounded-lg bg-[#f8e9ed] flex items-center justify-center flex-shrink-0">
                <Mail
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Email
                </p>

                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="
                      w-full
                      px-4
                      py-2.5
                      rounded-lg
                      border
                      border-gray-300
                      outline-none
                      focus:border-[#ad4058]
                      focus:ring-2
                      focus:ring-[#ad4058]/20
                    "
                  />
                ) : (
                  <p className="text-base font-semibold text-[#423640]">
                    {user.email}
                  </p>
                )}

              </div>

            </div>

            {/* ================= PHONE ================= */}

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

              <div className="w-11 h-11 rounded-lg bg-[#f8e9ed] flex items-center justify-center flex-shrink-0">
                <Phone
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Phone Number
                </p>

                {editing ? (
                  <>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter 10 digit phone number"
                      maxLength={10}
                      inputMode="numeric"
                      className="
                        w-full
                        px-4
                        py-2.5
                        rounded-lg
                        border
                        border-gray-300
                        outline-none
                        focus:border-[#ad4058]
                        focus:ring-2
                        focus:ring-[#ad4058]/20
                      "
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      {form.phone.length}/10 digits
                    </p>
                  </>
                ) : (
                  <p className="text-base font-semibold text-[#423640]">
                    {user.phone || "Not added"}
                  </p>
                )}

              </div>

            </div>

            {/* ================= ADDRESS ================= */}

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

              <div className="w-11 h-11 rounded-lg bg-[#f8e9ed] flex items-center justify-center flex-shrink-0">
                <MapPin
                  size={20}
                  className="text-[#ad4058]"
                />
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Address
                </p>

                {editing ? (
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    rows="3"
                    className="
                      w-full
                      px-4
                      py-2.5
                      rounded-lg
                      border
                      border-gray-300
                      outline-none
                      resize-none
                      focus:border-[#ad4058]
                      focus:ring-2
                      focus:ring-[#ad4058]/20
                    "
                  />
                ) : (
                  <p className="text-base font-semibold text-[#423640] leading-relaxed">
                    {user.address || "Not added"}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* ================= SAVE + CANCEL ================= */}

          {editing && (
            <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-xl
                  bg-[#ad4058]
                  text-white
                  font-semibold
                  hover:bg-[#852f43]
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <Save size={18} />

                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-gray-600
                  font-semibold
                  hover:bg-gray-50
                  disabled:opacity-50
                  transition
                "
              >
                <X size={18} />

                Cancel
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
