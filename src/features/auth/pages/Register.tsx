import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { registerUser } from "../api/tenantApi";
import { useNavigate } from "react-router-dom";
import type { RegisterUserPayload } from "../../tenants/users.types";
import styles from "../../../styles/Login.module.css"; 

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterUserPayload) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Registration successful!");
      navigate("/tenant-selection"); 
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <img
          src="/login-illustration.jpeg"
          alt="Register Visual"
          className={styles.loginImage}
        />
      </div>

      <div className={styles.formSection}>
        <Title level={3}>Register</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
