import {
  Modal,
  Form,
  Button,
  Collapse,
  Checkbox,
  Typography,
  Select,
  Spin,
} from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./RoleModal.module.css";
import { fetchRoles, fetchPermissions } from "../../auth/api/tenantApi";

interface RoleFormValues {
  name: string;
  roleId: string;
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
  roleId: Yup.string().required("Please select a role"),
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
    roleId: "",
    permissions: [],
  };

  const [selectedRoleId, setSelectedRoleId] = useState(defaultValues.roleId);

  // Fetch roles
  const { data: rolesData, isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Fetch permissions
  const { data: permissionsData, isLoading: loadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  const roles = rolesData?.data?.data?.roles || [];
  const permissions = permissionsData?.data?.data?.permissions || [];

  return (
    <Modal
      title={isEdit ? "Edit Role" : "Add Role"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={RoleSchema}
        onSubmit={(values) => {
          console.log("Submitting values: ", values); // ✅ Debug log
          onSubmit(values);
          onClose();
        }}
        enableReinitialize
      >
        {({
          values,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
          submitForm,
        }) => {
          const handleCheckboxChange = (checked: boolean, perm: string) => {
            const newPerms = checked
              ? [...values.permissions, perm]
              : values.permissions.filter((p) => p !== perm);
            setFieldValue("permissions", newPerms);
          };

          return (
            <Form
              layout="vertical"
              autoComplete="off"
              onFinish={() => submitForm()} 
            >
              <Form.Item
                label="Select Role"
                validateStatus={touched.roleId && errors.roleId ? "error" : ""}
                help={touched.roleId && errors.roleId}
              >
                {loadingRoles ? (
                  <Spin />
                ) : (
                  <Select
                    placeholder="Select a role"
                    value={values.roleId}
                    onChange={(val) => {
                      setSelectedRoleId(val);
                      setFieldValue("roleId", val);
                    }}
                  >
                    {roles?.map((role: any) => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Typography.Title level={5}>Permissions</Typography.Title>
              {loadingPermissions ? (
                <Spin />
              ) : (
                <Collapse accordion className={styles.customCollapse}>
                  {permissions?.map((permGroup: any) => (
                    <Collapse.Panel
                      header={permGroup.entity}
                      key={permGroup.entity}
                    >
                      <div className={styles.checkboxGrid}>
                        {permGroup.actions.map((action: string) => {
                          const value = `${permGroup.entity}:${action}`;
                          return (
                            <Checkbox
                              key={value}
                              checked={values.permissions.includes(value)}
                              onChange={(e) =>
                                handleCheckboxChange(e.target.checked, value)
                              }
                            >
                              {action}
                            </Checkbox>
                          );
                        })}
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              )}

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
