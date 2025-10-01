import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import { TenantFormModal } from "../components/TenantFormModal";
import type { TenantFormValues } from "../tenants.types";
import {
  createTenant,
  getTenants,
  updateTenant,
} from "../../auth/api/tenantApi";
import { useAppSelector } from "../../../store/hooks";

import styles from "../../../styles/TenantList.module.css";

export const TenantList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [tenants, setTenants] = useState<TenantFormValues[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantFormValues | null>(null);
  const [columns, setColumns] = useState<any[]>([]);

  const fetchTenants = async () => {
    try {
      const response = await getTenants();
      setTenants(response.data.data.tenants || []);
    } catch {
      toast.error("Failed to fetch tenants");
      setTenants([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);

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
      formData.append("address[address1]", values.address.address1);
      formData.append("address[city]", values.address.city);
      formData.append("address[country]", values.address.country);
      if (file) formData.append("logoUrl", file);

      if (editingTenant) {
        const response = await updateTenant(editingTenant.id!, formData);
        const updatedTenant = response.data.data;
        setTenants((prev) =>
          prev.map((t) => (t.id === editingTenant.id ? updatedTenant : t))
        );
        toast.success("Tenant updated successfully");
      } else {
        const response = await createTenant(formData);
        const newTenant = response.data.data;
        setTenants((prev) => [...prev, newTenant]);
        toast.success("Tenant created successfully");
      }

      fetchTenants();
      setModalOpen(false);
      setEditingTenant(null);
    } catch {
      toast.error("Failed to save tenant");
    }
  };

  useEffect(() => {
    const initialColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (_: string, record: TenantFormValues) => (
          <Button
            type="link"
            onClick={() => navigate(`/tenants/${record.id}`)}
            className={styles.tenantNameButton}
          >
            {record.name}
          </Button>
        ),
      },
      { title: "Email", dataIndex: "email", key: "email", width: 200 },
      { title: "Phone", dataIndex: "phone", key: "phone", width: 150 },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        width: 300,
        render: (address: any) =>
          address
            ? `${address.address1 || ""}, ${address.city || ""}, ${address.country || ""}`.replace(
                /(,\s*)+$/,
                ""
              )
            : "N/A",
      },
      {
        title: "Logo",
        dataIndex: "logoUrl",
        key: "logoUrl",
        width: 120,
        render: (url: string) => (
          <img
            src={url || "../logo-placeholder.jpg"}
            alt="logo"
            width={40}
            height={40}
          />
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
      },
      {
        title: "Created By",
        dataIndex: "creator",
        key: "createdBy",
        width: 180,
        render: (creator: { firstName?: string; lastName?: string }) =>
          creator ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim() : "N/A",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status: string) => (
          <Tag color={status === "ACTIVE" ? "green" : "red"}>
            {status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (_: any, record: TenantFormValues) => (
          <Space>
            <Button type="link" onClick={() => openEditModal(record)}>
              <EditOutlined /> Edit
            </Button>
          </Space>
        ),
      },
    ];

    setColumns(initialColumns);
  }, [navigate]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(columns);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setColumns(reordered);
  };


  const DraggableHeader = ({ }: { children: React.ReactNode }) => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-columns" direction="horizontal">
        {(droppableProvided) => (
          <tr ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            {columns.map((col, index) => (
              <Draggable key={col.key} draggableId={col.key.toString()} index={index}>
                {(provided) => (
                  <th
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      background: "#fafafa",
                      fontWeight: 600,
                      cursor: "grab",
                      whiteSpace: "nowrap",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {col.title}
                  </th>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </tr>
        )}
      </Droppable>
    </DragDropContext>
  );
  
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
        scroll={{ x: "max-content" }}
        components={{
          header: {
            row: DraggableHeader,
          },
        }}
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
