import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
