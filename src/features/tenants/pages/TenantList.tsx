import { Table, Tag, Button, Space } from "antd";
import { useState } from "react";
import { TenantFormModal } from "../components/TenantFormModal";
import type { TenantFormValues } from "../tenants.types";
import styles from "./TenantList.module.css";

const initialTenants: TenantFormValues[] = [
  {
    name: "Acme Corp",
    email: "admin@acme.com",
    phone: "+1234567890",
    status: "active",
  },
  {
    name: "Beta Logistics",
    email: "contact@beta.com",
    phone: "+9876543210",
    status: "inactive",
  },
  {
    name: "Corp",
    email: "add@acme.com",
    phone: "+1234167890",
    status: "active",
  }
];

export const TenantList = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantFormValues | null>(
    null
  );

  const openAddModal = () => {
    setEditingTenant(null);
    setModalOpen(true);
  };

  const openEditModal = (tenant: TenantFormValues) => {
    setEditingTenant(tenant);
    setModalOpen(true);
  };

  const handleSubmit = (values: TenantFormValues) => {
    if (editingTenant) {
      setTenants((prev) =>
        prev.map((t) => (t.email === editingTenant.email ? values : t))
      );
    } else {
      setTenants((prev) => [...prev, values]);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TenantFormValues) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tenants</h2>
        <Button type="primary" onClick={openAddModal}>
          Add Tenant
        </Button>
      </div>

      <Table
        rowKey="email"
        columns={columns}
        dataSource={tenants}
        pagination={{ pageSize: 5 }}
      />

      <TenantFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingTenant || undefined}
        isEdit={!!editingTenant}
      />
    </div>
  );
};
