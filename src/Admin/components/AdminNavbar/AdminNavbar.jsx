import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  return (
    <header
      className="
        flex
        h-20
        w-full
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white
        px-8
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold text-[#423640]">
          Bonvivant Admin
        </h1>

        <p className="text-sm text-gray-500">
          Manage your store
        </p>
      </div>

      {/* Right */}
      <button
        type="button"
        onClick={() => navigate("/admin/profile")}
        className="
          flex
          items-center
          gap-3
          rounded-xl
          px-3
          py-2
          transition
          hover:bg-gray-100
        "
      >
        {/* Profile Icon */}
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#f8e9ed]
          "
        >
          <User
            size={21}
            className="text-[#ad4058]"
          />
        </div>

        {/* Admin Info */}
        <div className="text-left">
          <p className="text-sm font-semibold text-[#423640]">
            {admin.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            Administrator
          </p>
        </div>
      </button>
    </header>
  );
};

export default AdminNavbar;