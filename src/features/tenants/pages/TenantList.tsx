import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { TenantFormModal } from "../components/TenantFormModal";
import type { TenantFormValues } from "../tenants.types";
import styles from "./TenantList.module.css";
import {
  createTenant,
  getTenants,
  updateTenant,
} from "../../auth/api/tenantApi";
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
      setTenants(response.data.data);
      console.log(response.data);
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

  const handleSubmit = async (values: TenantFormValues, file?: File | null) => {
    try {
      console.log("Submitting tenant with values:", values);
      console.log("Submitting tenant with file:", file);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("status", values.status);
      formData.append("address", values.address);

      if (file) {
        formData.append("logo", file);
      }

      if (editingTenant) {
        // Update existing tenant - maintain position in the list
        const response = await updateTenant(editingTenant.id!, formData);
        const updatedTenant = response.data.data;
        
        // Update the tenant in the current state without changing order
        setTenants((prev) =>
          prev.map((tenant) =>
            tenant.id === editingTenant.id ? updatedTenant : tenant
          )
        );
        toast.success("Tenant updated successfully");
      } else {
        // Create new tenant - add to the list
        const response = await createTenant(formData);
        const newTenant = response.data.data;
        
        // Add new tenant to the end of the current list
        setTenants((prev) => [...prev, newTenant]);
        toast.success("Tenant created successfully");
      }
    } catch (error) {
      console.error("Error saving tenant:", error);
      toast.error("Failed to save tenant");
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
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Created By",
      dataIndex: "creator",
      key: "createdBy",
      render: (creator: { fullName: string }) => creator?.fullName,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const isActive = status === "Activate";
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
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
