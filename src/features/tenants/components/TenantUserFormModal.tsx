import { Modal, Form, Input, Select, Button } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import styles from "./TenantFormModal.module.css";

interface TenantUserValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  tenantId: string;
}

interface TenantUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantUserValues) => void;
  tenantId: string;
}

export const TenantUserFormModal = ({
  open,
  onClose,
  onSubmit,
  tenantId,
}: TenantUserFormModalProps) => {
  const defaultValues: TenantUserValues = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    tenantId,
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
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            name="tenantUserForm"
          >
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

            <Form.Item label="Phone" required>
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Form.Item label="Role" required>
              <Select
                value={values.role}
                onChange={(val) => setFieldValue("role", val)}
              >
                <Select.Option value="SUPERADMIN">SUPERADMIN</Select.Option>
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="DRIVER">DRIVER</Select.Option>
                <Select.Option value="PICKER">PICKER</Select.Option>
                <Select.Option value="OPERATION">OPERATION</Select.Option>
                <Select.Option value="CUSTOMER">CUSTOMER</Select.Option>
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
