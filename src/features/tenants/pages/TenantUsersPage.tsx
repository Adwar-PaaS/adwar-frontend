import { Button, Table, Space } from "antd";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTenantUsers, createTenantUser } from "../../auth/api/tenantApi";
import { useParams } from "react-router-dom";
import { TenantUserModal } from "./TenantUserModal";
import { toast } from "react-toastify";

export const TenantUsersPage = () => {
  const { tenantId } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch only tenant users for this tenant
  const { data, isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: () => getTenantUsers(tenantId!),
    enabled: !!tenantId,
  });

  const users = data?.data?.data?.users || [];

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

  const handleCreateUser = (values: any) => {
    if (!tenantId) return;

    const payload = {
      email: values.email,
      password: values.password || "mypassword123",
      fullName: values.name,
      phone: values.phone,
      role: values.role,
      tenantId: tenantId,
    };

    console.log("Submitting payload:", { ...values, tenantId });
    createUserMutation.mutate(payload);
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Role", dataIndex: "role" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Tenant Users</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        style={{ marginTop: 16 }}
      />

      <TenantUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateUser}
        warehouses={[
          { id: "1", name: "Warehouse A" },
          { id: "2", name: "Warehouse B" },
        ]}
      />
    </div>
  );
};
