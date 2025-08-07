import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import type { LoginFormValues } from "../types";
import { LoginSchema } from "../validation";
import { login } from "../api/authApi.ts";
import styles from "../../../styles/Login.module.css";

export const Login = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful");

      navigate("/superadmin/tenants");
    },
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  const initialValues: LoginFormValues = {
    email: "",
    passwordHash: "",
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
          onSubmit={({ email, passwordHash }) =>
            mutate({ email, password: passwordHash })
          }
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
                loading={isPending}
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
