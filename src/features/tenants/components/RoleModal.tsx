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

export interface RoleFormValues {
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
  roleId: Yup.string().required("Please select a role"),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least 1 permission"),
});

export const RoleModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: RoleModalProps) => {
  const defaultValues: RoleFormValues = initialValues || {
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
          onSubmit(values);
          onClose();
        }}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          submitForm,
        }) => {
          const handleCheckboxChange = (
            checked: boolean,
            permGroup: any,
            action: string
          ) => {
            const allActions = permGroup.actions.filter(
              (a: any) => a !== "All"
            );
            let newPerms = [...values.permissions];

            if (action === "All") {
              if (checked) {
                //  Add all actions for this entity
                newPerms = [
                  ...newPerms,
                  ...permGroup.actions.map(
                    (a: any) => `${permGroup.entity}:${a}`
                  ),
                ];
              } else {
                //  Remove all actions for this entity
                newPerms = newPerms.filter(
                  (p) => !p.startsWith(`${permGroup.entity}:`)
                );
              }
            } else {
              const value = `${permGroup.entity}:${action}`;
              if (checked) {
                newPerms.push(value);
              } else {
                newPerms = newPerms.filter((p) => p !== value);
              }

              // Check if all individual actions are selected -> add "All"
              const entityPerms = newPerms.filter((p) =>
                p.startsWith(`${permGroup.entity}:`)
              );
              const allSelected = allActions.every((a: any) =>
                entityPerms.includes(`${permGroup.entity}:${a}`)
              );
              const allValue = `${permGroup.entity}:All`;

              if (allSelected && !entityPerms.includes(allValue)) {
                newPerms.push(allValue);
              } else if (!allSelected) {
                newPerms = newPerms.filter((p) => p !== allValue);
              }
            }

            setFieldValue("permissions", Array.from(new Set(newPerms)));
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
                    {roles?.map((role: string) => (
                      <Select.Option key={role} value={role}>
                        {role}
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
                          const checked = values.permissions.includes(value);

                          return (
                            <Checkbox
                              key={value}
                              checked={checked}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e.target.checked,
                                  permGroup,
                                  action
                                )
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
