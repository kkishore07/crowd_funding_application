import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedin = sessionStorage.getItem("isLoggedin") === "true";

  if (!isLoggedin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
