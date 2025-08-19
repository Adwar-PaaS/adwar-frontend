import { Modal, Form, Input, Select, Button } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "./TenantUserModal.module.css";

interface TenantUserFormValues {
  name: string;
  email: string;
  phone?: string;
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
  isEdit?: boolean;
}

const TenantUserSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
  phone: Yup.string().nullable(),
  warehouseId: Yup.string().nullable(),
});

export const TenantUserModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: TenantUserFormModalProps) => {
  const defaultValues: TenantUserFormValues =
    initialValues || {
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "ACTIVATE",
    };

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
        validationSchema={TenantUserSchema}
        onSubmit={(values) => {
          onSubmit(values);
          toast.success(isEdit ? "User updated successfully" : "User created");
          onClose();
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
           
            <Form.Item
              label="Full Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Item>

            <Form.Item
              label="Email Address"
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && errors.email}
            >
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              validateStatus={touched.phone && errors.phone ? "error" : ""}
              help={touched.phone && errors.phone}
            >
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Form.Item
              label="Role"
              validateStatus={touched.role && errors.role ? "error" : ""}
              help={touched.role && errors.role}
            >
              <Select
                value={values.role}
                onChange={(val) => setFieldValue("role", val)}
                placeholder="Select role"
              >
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="OPERATION">Operation</Select.Option>
                <Select.Option value="DRIVER">Driver</Select.Option>
                <Select.Option value="PICKER">Picker</Select.Option>
                <Select.Option value="CUSTOMER">Customer</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              validateStatus={touched.status && errors.status ? "error" : ""}
              help={touched.status && errors.status}
            >
              <Select
                value={values.status}
                onChange={(val) => setFieldValue("status", val)}
                placeholder="Select status"
              >
                <Select.Option value="Activate">Activate</Select.Option>
                <Select.Option value="Deactivate">Deactivate</Select.Option>
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
