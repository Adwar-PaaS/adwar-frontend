import { useState } from "react";
import { Button, Table, Space, Row, Col, Typography, Tag, Spin } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "../../../styles/TenantRolesPage.module.css";
import { RoleModal } from "../components/RoleModal";
import type { RoleFormValues } from "../components/RoleModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRolePermissions,
  fetchTenantRoles,
} from "../../auth/api/tenantApi";
import { toPermissionPayload } from "../../../utils/permissions";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

interface Permission {
  entityType: string;
  actionType: string[];
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export const TenantRolesPage = () => {
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles", tenantId],
    queryFn: () => fetchTenantRoles(tenantId!),
    enabled: !!tenantId,
  });

  const roles = data || [];

  const assignPermissionsMutation = useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: () => {
      toast.success("Permissions assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["roles", tenantId] });
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
    const selectedRole = roles.find((r: Role) => r.id === values.roleId);

    assignPermissionsMutation.mutate({
      name: (selectedRole?.name || values.roleId).toUpperCase(),
      permissions: payloadPermissions,
      tenantId,
    });
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: Permission[]) => {
        if (!permissions || permissions.length === 0) {
          return <Tag color="green">All</Tag>;
        }

        return permissions.map((perm, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <strong>{perm.entityType}</strong>{" "}
            {perm.actionType.map((action) => (
              <Tag key={action}>{action}</Tag>
            ))}
          </div>
        ));
      },
    },
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
            <EditOutlined /> Edit
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
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRole(null);
              setModalOpen(true);
            }}
          >
            Add Role
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={roles}
          bordered
          style={{ marginTop: 16 }}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      )}

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
