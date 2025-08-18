import { Modal, Form, Input, Select, Button } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import styles from "./TenantUserModal.module.css";

interface TenantUserFormValues {
  name: string;
  email: string;
  role: string;
  warehouseId?: string;
  status: string;
}

interface TenantUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantUserFormValues) => void;
  warehouses?: { id: string; name: string }[];
  initialValues?: TenantUserFormValues;
}

export const TenantUserModal = ({
  open,
  onClose,
  onSubmit,
  warehouses = [],
  initialValues,
}: TenantUserFormModalProps) => {
  const defaultValues: TenantUserFormValues =
    initialValues || {
      name: "",
      email: "",
      role: "",
      warehouseId: "",
      status: "",
    };

  const isEdit = Boolean(initialValues);

  return (
    <Modal
      title={isEdit ? "Edit Tenant User" : "Add Tenant User"}
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
          toast.success(
            isEdit ? "Tenant user updated successfully" : "Tenant user created"
          );
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
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Item>

            <Form.Item label="Email Address" required>
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Item>

            <Form.Item label="Role" required>
              <Select
                value={values.role}
                onChange={(val) => setFieldValue("role", val)}
                placeholder="Select role"
              >
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="OPERATIONS">Operations</Select.Option>
                <Select.Option value="DRIVER">Driver</Select.Option>
                <Select.Option value="PICKER">Picker</Select.Option>
                <Select.Option value="USER">User</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Warehouse" required>
              <Select
                value={values.warehouseId}
                onChange={(val) => setFieldValue("warehouseId", val)}
                placeholder="Select warehouse"
              >
                {warehouses.map((wh) => (
                  <Select.Option key={wh.id} value={wh.id}>
                    {wh.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Status" required>
              <Select
                value={values.status}
                onChange={(val) => setFieldValue("status", val)}
                placeholder="Select status"
              >
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitButton}
            >
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
