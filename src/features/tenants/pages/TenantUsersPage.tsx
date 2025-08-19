import { Button, Table, Space, Row, Col, Typography, Modal } from "antd";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTenantUsers, createTenantUser, updateTenantUser, updateUserStatus } from "../../auth/api/tenantApi";
import { useParams } from "react-router-dom";
import { TenantUserModal } from "./TenantUserModal";
import { toast } from "react-toastify";
import styles from "./TenantUsersPage.module.css";

export const TenantUsersPage = () => {
  const { tenantId } = useParams();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Fetch tenant users
  const { data, isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: () => getTenantUsers(tenantId!),
    enabled: !!tenantId,
  });

  const users = data?.data?.data?.users || [];

  // Create user
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

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) =>
      updateTenantUser(id, values),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update user";
      toast.error(msg);
    },
  });

    // Update user status
  const updateStatusMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    updateUserStatus(id, status),
  onSuccess: () => {
    toast.success("Status updated successfully");
    queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
  },
  onError: (error: any) => {
    const msg = error.response?.data?.message || "Failed to update status";
    toast.error(msg);
  },
});

  // Handle create/edit
  const handleSubmit = (values: any) => {
    if (!tenantId) return;

    if (editingUser) {
      // Edit mode
      updateUserMutation.mutate({
        id: editingUser.id,
        values: {
          fullName: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone,
          status: values.status,
        },
      });
    } else {
      // Create mode
      const payload = {
        email: values.email,
        password: values.password || "mypassword123",
        fullName: values.name,
        phone: values.phone,
        role: values.role,
        tenantId: tenantId,
        status: values.status,
      };
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
    render: (status: string) => (
      <span style={{ color: status === "Activate" ? "green" : "red" }}>
        {status} 
      </span>
    ),
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
            Edit
          </Button>

           <Button type="link" danger>
          Delete
        </Button>

        <Button
        type="link"
        onClick={() => {
          const newStatus =
            record.status === "Activate" ? "Deactivate" : "Activate";

          Modal.confirm({
            title: "Confirm Status Change",
            content: `Are you sure you want to ${newStatus.toLowerCase()} this user?`,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              updateStatusMutation.mutate({ id: record.id, status: newStatus });
            },
          });
        }}
      >
        {record.status === "Activate" ? "Deactivate" : "Activate"}
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

      <TenantUserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        initialValues={
          editingUser
            ? {
                name: editingUser.fullName,
                email: editingUser.email,
                role: editingUser.role,
                phone: editingUser.phone,
                status: editingUser.status,
              }
            : undefined
        }
        isEdit={!!editingUser}
      />
    </div>
  );
};
