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

    address: "123 Main St",
    logoUrl: "https://www.adwar.com.sa/uploads/1656262965.png",
    createdAt: "2025-08-01",
    createdBy: "Admin",
        status: "active",
  },
  {
    name: "Beta Logistics",
    email: "contact@beta.com",
    phone: "+9876543210",
 
    address: "456 Beta Ave",
    logoUrl: "https://www.adwar.com.sa/uploads/1656262965.png",
    createdAt: "2025-07-15",
    createdBy: "SuperAdmin",
       status: "inactive",
  },
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
    
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      render: (url: string) =>
        url ? <img src={url} alt="logo" width={40} height={40} /> : "N/A",
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
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
