import { Navigate } from "react-router-dom";
import UserDashboard from "./dashboards/UserDashboard";
import CreatorDashboard from "./dashboards/CreatorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const Dashboard = () => {
  const isDevPreview = import.meta.env.DEV && !sessionStorage.getItem("isLoggedin");

  if (isDevPreview) {
    sessionStorage.setItem("isLoggedin", "true");
    sessionStorage.setItem("role", "user");
    sessionStorage.setItem("userName", "Preview User");
  }

  const isLoggedin = sessionStorage.getItem("isLoggedin") === "true";
  const userRole = sessionStorage.getItem("role");

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "creator":
        return <CreatorDashboard />;
      case "user":
        return <UserDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return renderDashboard();
};

export default Dashboard;
