import { Table, Tag, Button, Space, Spin } from "antd";
import { useState } from "react";
import { TenantFormModal } from "../components/TenantFormModal";
import type { TenantFormValues } from "../tenants.types";
import {
  createTenant,
  getTenants,
  updateTenant,
} from "../../auth/api/tenantApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import styles from "./TenantList.module.css";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const TenantList = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantFormValues | null>(
    null
  );

  //  Don’t redirect until auth check is finished
  if (!initialized) {
    return <Spin size="large" fullscreen />;
  }

  // Redirect only if auth check is finished and user is NOT authenticated
  if (initialized && !isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
  }
  
  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await getTenants();
      return response.data.data.tenants;
    },
    enabled: isAuthenticated,
  });

  const tenants = data || [];

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
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("status", values.status);
      formData.append("address", values.address);

      if (file) {
        formData.append("logoUrl", file);
      }

      if (editingTenant) {
        await updateTenant(editingTenant.id!, formData);
        toast.success("Tenant updated successfully");
      } else {
        await createTenant(formData);
        toast.success("Tenant created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    } catch {
      toast.error("Failed to save tenant");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TenantFormValues) => (
        <Link to={`/tenants/${record.id}`}>{text}</Link>
      ),
    },
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

  if (isLoading) {
    return <Spin size="large" fullscreen />;
  }

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
