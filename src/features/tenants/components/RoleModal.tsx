import {
  Modal,
  Form,
  Input,
  Button,
  Collapse,
  Checkbox,
  Typography,
} from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./RoleModal.module.css";

interface RoleFormValues {
  name: string;
  permissions: string[];
}

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
  initialValues?: RoleFormValues;
  isEdit?: boolean;
}

const RoleSchema = Yup.object().shape({
  name: Yup.string().required("Role name is required"),
});

export const RoleModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: RoleModalProps) => {
  const defaultValues: RoleFormValues = initialValues || {
    name: "",
    permissions: [],
  };

  const userPermissions = [
    { label: "Create User", value: "create_user" },
    { label: "Edit User", value: "edit_user" },
    { label: "Delete User", value: "delete_user" },
    { label: "View User", value: "view_user" },
  ];

  const orderPermissions = [
    { label: "Create Order", value: "create_order" },
    { label: "Edit Order", value: "edit_order" },
    { label: "Cancel Order", value: "cancel_order" },
    { label: "View Order", value: "view_order" },
  ];

  const warehousePermissions = [
    { label: "Create Warehouse", value: "create_warehouse" },
    { label: "Edit Warehouse", value: "edit_warehouse" },
    { label: "Delete Warehouse", value: "delete_warehouse" },
    { label: "View Warehouse", value: "view_warehouse" },
  ];

  const customerPermissions = [
    { label: "Create Customer", value: "create_customer" },
    { label: "Edit Customer", value: "edit_customer" },
    { label: "Delete Customer", value: "delete_customer" },
    { label: "View Customer", value: "view_customer" },
  ];

  const tenantPermissions = [
    { label: "Create Tenant", value: "create_tenant" },
    { label: "Edit Tenant", value: "edit_tenant" },
    { label: "Delete Tenant", value: "delete_tenant" },
    { label: "View Tenant", value: "view_tenant" },
  ];

  return (
    <Modal
      title={isEdit ? "Edit Role" : "Add Role"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={RoleSchema}
        onSubmit={(values) => {
          onSubmit(values);
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
        }) => {
          const renderPanel = (
            title: string,
            permissions: { label: string; value: string }[]
          ) => (
            <Collapse.Panel header={title} key={title}>
              <div className={styles.checkboxGrid}>
                {permissions.map((perm) => (
                  <Checkbox
                    key={perm.value}
                    checked={values.permissions.includes(perm.value)}
                    onChange={(e) => {
                      const newPerms = e.target.checked
                        ? [...values.permissions, perm.value]
                        : values.permissions.filter((p) => p !== perm.value);
                      setFieldValue("permissions", newPerms);
                    }}
                  >
                    {perm.label}
                  </Checkbox>
                ))}
              </div>
            </Collapse.Panel>
          );

          return (
            <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
              <Form.Item
                label="Role Name"
                validateStatus={touched.name && errors.name ? "error" : ""}
                help={touched.name && errors.name}
              >
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter role name"
                />
              </Form.Item>

              <Typography.Title level={5}>Permissions</Typography.Title>
              <Collapse accordion className={styles.customCollapse}>
                {renderPanel("User Permissions", userPermissions)}
                {renderPanel("Order Permissions", orderPermissions)}
                {renderPanel("Warehouse Permissions", warehousePermissions)}
                {renderPanel("Customer Permissions", customerPermissions)}
                {renderPanel("Tenant Permissions", tenantPermissions)}
              </Collapse>

              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ marginTop: 16 }}
              >
                {isEdit ? "Update Role" : "Create Role"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
