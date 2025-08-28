import { Button, Table, Space, Row, Col, Typography } from "antd";
import { useState } from "react";
import { RoleModal } from "../components/RoleModal";
import type { RoleFormValues } from "../components/RoleModal";
import styles from "../../../styles/TenantRolesPage.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignRolePermissions, fetchRoles } from "../../auth/api/tenantApi";
import { toPermissionPayload } from "../../../utils/permissions";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

interface Role {
  id: string;
  name: string;
}

export const TenantRolesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const queryClient = useQueryClient();

  // Fetch roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const roles = rolesData?.data?.roles || [];

  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const assignPermissionsMutation = useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: () => {
      toast.success("Permissions assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModalOpen(false);
      setEditingRole(null);
    },
    onError: () => {
      toast.error("Failed to assign permissions");
    },
  });

  const handleSave = (values: RoleFormValues) => {
    if (!tenantId) {
      toast.error("Tenant ID not found");
      return;
    }

    const payloadPermissions = toPermissionPayload(values.permissions);
     const selectedRoleName = roles.find((r: any) => r === values.roleId) || values.roleId;


    assignPermissionsMutation.mutate({
      name: selectedRoleName,
      permissions: payloadPermissions,
      tenantId,
    });
  };

  const columns = [
    { title: "Role Name", dataIndex: "name" },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingRole(record);
              setModalOpen(true);
            }}
          >
            <EditOutlined />
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row align="middle" justify="space-between" className={styles.headerRow}>
        <Col>
          <Typography.Title level={3} className={styles.name}>
            Roles
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setEditingRole(null);
              setModalOpen(true);
            }}
          >
            Add Role
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={roles}
        bordered
        style={{ marginTop: 16 }}
      />

      <RoleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSave}
        isEdit={!!editingRole}
      />
    </div>
  );
};
