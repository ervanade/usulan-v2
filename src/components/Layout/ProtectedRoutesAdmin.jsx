import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutesAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user")) || undefined;

  if (!user || user === null) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role != "1") {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesAdmin;
