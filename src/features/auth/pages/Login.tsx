import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import type { LoginFormValues } from "../types";
import { LoginSchema } from "../validation";
import styles from "../../../styles/Login.module.css";

export const Login = () => {
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: "",
    passwordHash: "",
  };

  //   Email: superadmin@adwar.com
  // Password: 12341234

  const onSubmit = (values: LoginFormValues) => {
    const { email } = values;
    const role = email.includes("super")
      ? "superadmin"
      : email.includes("tenant")
      ? "tenant"
      : "customer";

    localStorage.setItem("token", "123456");
    localStorage.setItem("user", JSON.stringify({ role, email }));

    toast.success("Login successful");

    if (role === "superadmin") navigate("/superadmin/tenants");
    else if (role === "tenant") navigate("/tenant/dashboard");
    else navigate("/customer/orders");
  };

  return (
    <div className={styles.wrapper}>
      <Typography.Title level={3}>Login</Typography.Title>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
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

            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
