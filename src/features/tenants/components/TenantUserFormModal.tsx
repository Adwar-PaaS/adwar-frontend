import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getRoles } from "../../auth/api/tenantApi";
import styles from "./TenantFormModal.module.css";

interface Role {
  id: string;
  name: string;
  tenantId?: string | null;
}

interface TenantUserValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
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
  const [roles, setRoles] = useState<Role[]>([]);

  const defaultValues: TenantUserValues = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        setRoles(res.data.data.roles || []);
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
            roleId: values.roleId,
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
              {
                <Select
                  value={values.roleId}
                  onChange={(val) => setFieldValue("roleId", val)}
                  placeholder="Select role"
                >
                  {roles.map((role) => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>
              }
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
