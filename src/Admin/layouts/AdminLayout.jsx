import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f6]">

      <AdminSidebar />

      <div className="ml-64 min-h-screen">

        <AdminNavbar />

        <main className="min-h-[calc(100vh-80px)] bg-[#f8f5f6] p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;