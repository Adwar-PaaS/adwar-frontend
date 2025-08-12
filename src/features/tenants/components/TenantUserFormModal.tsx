import { Modal, Form, Input, Select, Button } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import styles from "./TenantFormModal.module.css";

interface TenantUserValues {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface TenantUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantUserValues) => void;
}

export const TenantUserFormModal = ({
  open,
  onClose,
  onSubmit,
}: TenantUserFormModalProps) => {
  const defaultValues: TenantUserValues = {
    fullName: "",
    email: "",
    password: "",
    role: "TenantAdmin",
  };

  return (
    <Modal
      title="Create Tenant User"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
    >
      <Formik
        initialValues={defaultValues}
        onSubmit={(values) => {
          onSubmit(values);
          toast.success("Tenant user created");
          onClose();
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Full Name" required>
              <Input
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Item>

            <Form.Item label="Email" required>
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Item>

            <Form.Item label="Password" required>
              <Input.Password
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </Form.Item>

            <Form.Item label="Role" required>
              <Select
                value={values.role}
                onChange={(val) => setFieldValue("role", val)}
              >
                <Select.Option value="TenantAdmin">Tenant Admin</Select.Option>
                <Select.Option value="TenantManager">
                  Tenant Manager
                </Select.Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitButton}
            >
              Create User
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
