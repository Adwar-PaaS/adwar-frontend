import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { TenantFormModal } from "../components/TenantFormModal";
import type { TenantFormValues } from "../tenants.types";
import styles from "./TenantList.module.css";
import { createTenant, getTenants } from "../../auth/api/tenantApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const TenantList = () => {
  const [tenants, setTenants] = useState<TenantFormValues[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await getTenants();
      setTenants(response.data.data.data);
      console.log( response.data);
    } catch (error) {
      toast.error("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const openAddModal = () => {
    setEditingTenant(null);
    setModalOpen(true);
  };

  const openEditModal = (tenant: TenantFormValues) => {
    setEditingTenant(tenant);
    setModalOpen(true);
  };

  const handleSubmit = async (values: TenantFormValues) => {
    try {
      if (editingTenant) {
        setTenants((prev) =>
          prev.map((tenant) =>
            tenant.email === editingTenant.email ? values : tenant
          )
        );
      } else {
        await createTenant(values);
        toast.success("Tenant created successfully");
        fetchTenants();
      }
    } catch (error) {
      toast.error("Failed to create tenant");
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
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (date: string) => dayjs(date).format("YYYY-MM-DD"), },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy", },
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
        rowKey="id"
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
