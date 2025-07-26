import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== "ADMIN") {
    return <Navigate to="/candidateDashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
