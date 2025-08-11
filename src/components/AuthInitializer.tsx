import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/auth/authSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        try {
          if (!isTokenExpired(token)) {
            dispatch(setUser(JSON.parse(user)));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    initialize();
  }, [dispatch]);

  return null;
};

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // If we can't parse, assume expired
  }
}

export default AuthInitializer;