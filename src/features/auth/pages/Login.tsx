import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useEffect } from "react";

import type { LoginFormValues } from "../types";
import { LoginSchema } from "../validation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUser, setLoading, setError, clearError } from "../../../store/slices/authSlice";
import { authAPI } from "../api/authApi";
import { getRoleBasedRoute } from "../../../utils/roleUtils";
import styles from "../../../styles/Login.module.css";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getRoleBasedRoute(user);
      navigate(dashboardRoute, { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const initialValues: LoginFormValues = {
    email: "",
    passwordHash: "",
  };

  const handleSubmit = async ({ email, passwordHash }: LoginFormValues) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authAPI.login({ email, password: passwordHash });
      const user = response.data.user;

      dispatch(setUser(user));
      toast.success("Login successful");

      const dashboardRoute = getRoleBasedRoute(user);
      navigate(dashboardRoute, { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <img
          src="/login-illustration.jpeg"
          alt="Login Visual"
          className={styles.loginImage}
        />
      </div>

      <div className={styles.formSection}>
        <Typography.Title level={3}>Login</Typography.Title>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email}
              >
                <Input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={
                  touched.passwordHash && errors.passwordHash ? "error" : ""
                }
                help={touched.passwordHash && errors.passwordHash}
              >
                <Input.Password
                  name="passwordHash"
                  value={values.passwordHash}
                  onChange={handleChange}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
