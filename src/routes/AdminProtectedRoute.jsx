import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;