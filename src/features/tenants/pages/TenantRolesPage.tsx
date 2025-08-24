import { Button, Table, Space, Row, Col, Typography } from "antd";
import { useState } from "react";
import { RoleModal } from "../components/RoleModal";
import styles from "./TenantRolesPage.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRolePermissions,
  fetchRoles,
} from "../../auth/api/tenantApi";

interface Role {
  id: string;
  name: string;
}

export const TenantRolesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const queryClient = useQueryClient();

  // Fetch roles
  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const roles = rolesData?.data?.roles || [];

  const assignPermissionsMutation = useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModalOpen(false);
      setEditingRole(null);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

const handleSave = (values: {
  name: string;
  roleId: string;
  permissions: string[];
}) => {
  assignPermissionsMutation.mutate({
    roleId: values.roleId,
    permissions: values.permissions,
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
