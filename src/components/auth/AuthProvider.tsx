import React, { type ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  setUser,
  clearUser,
  setInitialized,
} from "../../store/slices/authSlice";
import { authAPI } from "../../features/auth/api/authApi";
import { Spin } from "antd";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  // const { initialized } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.checkAuth();
        dispatch(setUser(response.data.user));
      } catch {
        dispatch(clearUser());
      } finally {
        dispatch(setInitialized());
        setChecking(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (checking) {
    return <Spin size="large" fullscreen />;
  }

  return <>{children}</>;
};

export default AuthProvider;
