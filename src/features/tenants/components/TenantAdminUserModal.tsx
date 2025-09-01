import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "../../../styles/TenantUsersPage.module.css";
import { fetchTenantWarehouses, fetchTenantRoles } from "../../auth/api/tenantApi";
import { useQuery } from "@tanstack/react-query";

interface Role {
  id: string;
  name: string;
}

interface TenantUserFormValues {
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  warehouseId?: string;
  status: string;
  assignWarehouses?: string[];
}

interface TenantUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantUserFormValues) => void;
  tenantId: string;
  initialValues?: TenantUserFormValues;
  isEdit?: boolean;
}

const TenantUserSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  roleId: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
  assignWarehouses: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one warehouse"),
  phone: Yup.string().nullable(),
  warehouseId: Yup.string().nullable(),
});

export const TenantAdminUserModal = ({
  open,
  onClose,
  onSubmit,
  tenantId,
  initialValues,
  isEdit = false,
}: TenantUserFormModalProps) => {
  const defaultValues: TenantUserFormValues = initialValues || {
    name: "",
    email: "",
    phone: "",
    roleId: "",
    status: "ACTIVE",
    assignWarehouses: [],
  };

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["tenantRoles", tenantId],
    queryFn: () => fetchTenantRoles(tenantId),
    enabled: !!tenantId,
  });

  const roles: Role[] = rolesData || [];

  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ["tenantWarehouses", tenantId],
    queryFn: () => fetchTenantWarehouses(tenantId),
    enabled: !!tenantId,
  });

  const warehouses = warehouseData?.data?.data?.warehouses || [];

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
          const payload = {
            ...values,
            tenantId,
          };
          onSubmit(payload);
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
              validateStatus={touched.roleId && errors.roleId ? "error" : ""}
              help={touched.roleId && errors.roleId}
            >
              {rolesLoading ? (
                <Spin />
              ) : (
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
              )}
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
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Assign Warehouses"
              validateStatus={
                touched.assignWarehouses && errors.assignWarehouses
                  ? "error"
                  : ""
              }
              help={touched.assignWarehouses && errors.assignWarehouses}
            >
              {warehouseLoading ? (
                <Spin />
              ) : (
                <Select
                  mode="multiple"
                  placeholder="Select warehouses"
                  value={values.assignWarehouses}
                  onChange={(val) => setFieldValue("assignWarehouses", val)}
                >
                  {warehouses.map((wh: any) => (
                    <Select.Option key={wh.id} value={wh.id}>
                      {wh.name} - {wh.location}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
