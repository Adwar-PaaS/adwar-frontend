import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { stabilizeAuth } from "../features/auth/authSlice";

const AuthStabilizer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { token, user } = JSON.parse(authData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(stabilizeAuth());
      } catch {
        localStorage.removeItem("auth");
      }
    } else {
      dispatch(stabilizeAuth());
    }
  }, [dispatch]);

  return null;
};

export default AuthStabilizer;