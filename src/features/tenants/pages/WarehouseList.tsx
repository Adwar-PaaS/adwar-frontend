import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import {
  updateWarehouse,
  createWarehouse,
  fetchTenantWarehouses,
} from "../../auth/api/tenantApi";
import { useAppSelector } from "../../../store/hooks";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "../../../styles/WarehouseList.module.css";
import { WarehouseFormModal } from "../components/WarehouseFormModal";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  status: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export const WarehouseList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  const fetchWarehouses = async () => {
    if (!tenantId) return;
    try {
      const response = await fetchTenantWarehouses(tenantId);
      setWarehouses(response.data.data.warehouses || []);
    } catch (error) {
      toast.error("Failed to fetch warehouses");
      setWarehouses([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWarehouses();
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, tenantId]);
  const handleSubmit = async (values: any) => {
    try {
      const { name, location, capacity } = values;
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, {
          name,
          location,
          capacity,
        });
        toast.success("Warehouse updated successfully");
      } else {
        await createWarehouse({ name, location, capacity, tenantId });
        toast.success("Warehouse created successfully");
      }
      fetchWarehouses();
    } catch {
      toast.error(editingWarehouse ? "Failed to update" : "Failed to create");
    } finally {
      setModalOpen(false);
      setEditingWarehouse(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Warehouse) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/tenant/${tenantSlug}/admin/warehouses/${record.id}`)
          }
          className={styles.warehouseNameButton}
        >
          {record.name}
        </Button>
      ),
    },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Current Stock", dataIndex: "currentStock", key: "currentStock" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "OPEN" ? "green" : "red"}>
          {status === "OPEN" ? "OPEN" : "CLOSED"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Warehouse) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingWarehouse(record);
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
      <div className={styles.header}>
        <h2 className={styles.title}>Warehouses</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Warehouse
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={warehouses}
        pagination={{ pageSize: 5 }}
      />

      <WarehouseFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWarehouse(null);
        }}
        onSubmit={handleSubmit}
        tenantId={tenantId!}
        initialValues={editingWarehouse || undefined}
        isEdit={!!editingWarehouse}
      />
    </div>
  );
};
