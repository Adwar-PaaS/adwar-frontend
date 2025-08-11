import { useAppSelector } from '../../app/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from "antd";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);

   useEffect(() => {
    if (!loading) {
      setIsHydrated(true);
    }
  }, [loading]);

  if (!isHydrated) {
    return <Spin size="large" fullscreen />;
  }

  const token = localStorage.getItem("token");
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;