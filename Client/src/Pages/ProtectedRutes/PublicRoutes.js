import React from "react";
import { useAuth } from "../AuthProvider/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PublicRoutes;
