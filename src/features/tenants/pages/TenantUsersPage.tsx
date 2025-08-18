import { Button, Table, Space } from "antd";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersByTenantId, createTenantUser } from "../../auth/api/tenantApi";
import { useParams } from "react-router-dom";
import { TenantUserModal } from "./TenantUserModal";
import { toast } from "react-toastify";

export const TenantUsersPage = () => {
  const { tenantId } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["tenantUsers", tenantId],
    queryFn: async () => {
      const res = await getUsersByTenantId(tenantId!);
      return res.data.data.users;
    },
    enabled: !!tenantId,
  });

  const handleCreateUser = async (values: any) => {
    try {
      await createTenantUser({ ...values, tenantId });
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const columns = [
    { title: "Full Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      render: (warehouse: any) => warehouse?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span style={{ color: status === "ACTIVE" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => console.log("Edit", record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => console.log("Delete", record)}>
            Delete
          </Button>
        </Space>
      ),
    },
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
