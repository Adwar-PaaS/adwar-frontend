import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "../../../styles/TenantUsersPage.module.css";
import {
  fetchTenantBranches,
  fetchTenantRoles,
} from "../../auth/api/tenantApi";
import { useQuery } from "@tanstack/react-query";

interface Role {
  id: string;
  name: string;
}

interface TenantUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  warehouseId?: string;
  status: string;
  assignWarehouses?: string[];
  addresses: {
    label: string;
    address1: string;
    address2?: string;
    district?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    type: string;
    isPrimary: boolean;
    isDefault: boolean;
  }[];
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
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  roleId: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
  assignWarehouses: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one branch"),
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
  const defaultValues: TenantUserFormValues = {
  ...initialValues,
  addresses:
    initialValues?.addresses && initialValues.addresses.length > 0
      ? initialValues.addresses
      : [
          {
            label: "Home",
            address1: "",
            address2: "",
            district: "",
            city: "",
            state: "",
            country: "EG",
            postalCode: "",
            latitude: 0,
            longitude: 0,
            type: "HOME",
            isPrimary: true,
            isDefault: true,
          },
        ],
  firstName: initialValues?.firstName || "",
  lastName: initialValues?.lastName || "",
  email: initialValues?.email || "",
  phone: initialValues?.phone || "",
  roleId: initialValues?.roleId || "",
  status: initialValues?.status || "ACTIVE",
  assignWarehouses: initialValues?.assignWarehouses || [],
};


  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["tenantRoles", tenantId],
    queryFn: () => fetchTenantRoles(tenantId),
    enabled: !!tenantId,
  });

  const { data, isLoading: branchesLoading } = useQuery({
    queryKey: ["tenantBranches", tenantId],
    queryFn: () => fetchTenantBranches(tenantId),
    enabled: !!tenantId,
  });

  const roles: Role[] = rolesData || [];
  const branches = data?.data?.data?.branches || [];

  return (
    <Modal
      title={isEdit ? "Edit Tenant User" : "Add Tenant User"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
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
              label="First Name"
              validateStatus={
                touched.firstName && errors.firstName ? "error" : ""
              }
              help={touched.firstName && errors.firstName}
            >
              <Input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              validateStatus={
                touched.lastName && errors.lastName ? "error" : ""
              }
              help={touched.lastName && errors.lastName}
            >
              <Input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
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
              label="Address Line 1"
              validateStatus={
                touched.addresses?.[0]?.address1 &&
                (errors.addresses as any)?.[0]?.address1
                  ? "error"
                  : ""
              }
              help={
                touched.addresses?.[0]?.address1 &&
                (errors.addresses as any)?.[0]?.address1
              }
            >
              <Input
                name="addresses[0].address1"
                value={values.addresses[0].address1}
                onChange={handleChange}
                placeholder="Enter address line 1"
              />
            </Form.Item>

            <Form.Item label="Address Line 2">
              <Input
                name="addresses[0].address2"
                value={values.addresses[0].address2}
                onChange={handleChange}
                placeholder="Enter address line 2"
              />
            </Form.Item>

            <Form.Item label="City">
              <Input
                name="addresses[0].city"
                value={values.addresses[0].city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </Form.Item>

            <Form.Item label="State">
              <Input
                name="addresses[0].state"
                value={values.addresses[0].state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </Form.Item>

            <Form.Item label="Country">
              <Input
                name="addresses[0].country"
                value={values.addresses[0].country}
                onChange={handleChange}
                placeholder="Enter country code (e.g. EG)"
              />
            </Form.Item>

            <Form.Item label="Postal Code">
              <Input
                name="addresses[0].postalCode"
                value={values.addresses[0].postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
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
              label="Assign Branches"
              validateStatus={
                touched.assignWarehouses && errors.assignWarehouses
                  ? "error"
                  : ""
              }
              help={touched.assignWarehouses && errors.assignWarehouses}
            >
              {branchesLoading ? (
                <Spin />
              ) : (
                <Select
                  mode="multiple"
                  placeholder="Select branches"
                  value={values.assignWarehouses}
                  onChange={(val) => setFieldValue("assignWarehouses", val)}
                >
                  {branches.map((branch: any) => (
                    <Select.Option key={branch.id} value={branch.id}>
                      {branch.name}
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
