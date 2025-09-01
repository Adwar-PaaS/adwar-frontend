import { Modal, Form, Input, Select, Button } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getRoles } from "../../auth/api/tenantApi";
import styles from "../../../styles/TenantFormModal.module.css";

interface TenantUserValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  roleName: string;
}

interface TenantUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantUserValues) => void;
  tenantId: string;
}

export const TenantSuperAdminUserFormModal = ({
  open,
  onClose,
  onSubmit,
  tenantId,
}: TenantUserFormModalProps) => {
  const [roles, setRoles] = useState<string[]>([]);

  const defaultValues: TenantUserValues = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "",
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        setRoles(res.data?.data?.roles || []);
        console.log("Fetched roles:", res.data?.data?.roles);
      } catch (error) {
        toast.error("Failed to load roles");
      } finally {
      }
    };
    if (open) fetchRoles();
  }, [open]);

  return (
    <Modal
      title="Create Tenant User"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Formik
        initialValues={defaultValues}
        onSubmit={(values) => {
          const payload = {
            ...values,
            tenantId,
          };
          onSubmit(payload);
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
                value={values.roleName}
                onChange={(val) => setFieldValue("roleName", val)}
                placeholder="Select role"
              >
                {roles.map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
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
