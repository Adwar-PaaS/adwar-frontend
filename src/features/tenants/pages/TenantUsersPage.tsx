import { Button, Table, Space, Row, Col, Typography, Switch } from "antd";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTenantUsers,
  createTenantUser,
  updateTenantUser,
  toggleUserStatus,
} from "../../auth/api/tenantApi";
import { TenantAdminUserModal } from "../components/TenantAdminUserModal";
import { toast } from "react-toastify";
import styles from "../../../styles/TenantUsersPage.module.css";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { EditOutlined } from "@ant-design/icons";
import type { createTenantUserPayload } from "../tenants.types";

export const TenantUsersPage = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: () => getTenantUsers(tenantId!),
    enabled: !!tenantId,
  });

  const users =
    data?.data?.data?.users?.map((item: any) => ({
      id: item.user.id,
      fullName: item.user.fullName,
      email: item.user.email,
      phone: item.user.phone,
      status: item.user.status,
      role: item.user.role?.name || "N/A", // for display
      roleId: item.user.role?.name || "", // keep roleId as string (since API returns strings)
      warehouse: item.warehouse?.name || "N/A",
      assignWarehouses: item.user.assignWarehouses || [],
    })) || [];

  const createUserMutation = useMutation({
    mutationFn: createTenantUser,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
      setModalOpen(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create user";
      toast.error(msg);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) =>
      updateTenantUser(id, values),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
      setModalOpen(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update user";
      toast.error(msg);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      toggleUserStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    },
  });

  const handleSubmit = (values: any) => {
    if (!tenantId) return;

    const payload: createTenantUserPayload = {
      fullName: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password || "mypassword123",
      tenantId: tenantId,
      roleId: values.roleId, 
    };

    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        values: {
          fullName: values.name,
          email: values.email,
          phone: values.phone,
          roleId: values.roleId, 
        },
      });
    } else {
      createUserMutation.mutate(payload);
    }
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record: any) => {
        const isActive = status === "ACTIVE";
        return (
          <Switch
            checked={isActive}
            loading={loadingId === record.id}
            onChange={(checked) => {
              const newStatus = checked ? "ACTIVE" : "INACTIVE";
              setLoadingId(record.id);
              updateStatusMutation.mutate(
                { id: record.id, status: newStatus },
                { onSettled: () => setLoadingId(null) }
              );
            }}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
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
            Tenant Users
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
          >
            Add User
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
      />

      <TenantAdminUserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        tenantId={tenantId!}
        initialValues={
          editingUser
            ? {
                name: editingUser.fullName,
                email: editingUser.email,
                roleId: editingUser.roleId,
                phone: editingUser.phone,
                status: editingUser.status,
                assignWarehouses: editingUser.assignWarehouses || [],
              }
            : undefined
        }
        isEdit={!!editingUser}
      />
    </div>
  );
};
