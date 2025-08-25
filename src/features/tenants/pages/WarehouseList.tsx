import { Table, Tag, Button, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { getWarehouses } from "../../auth/api/tenantApi";
import { useAppSelector } from "../../../store/hooks";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import styles from "./WarehouseList.module.css";
import { WarehouseFormModal } from "../components/WarehouseFormModal";
import { createWarehouse } from "../../auth/api/tenantApi";
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

  const { data: currentUserData, isLoading: authLoading } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await getWarehouses();
      setWarehouses(response.data.data.warehouses || []);
    } catch (error) {
      toast.error("Failed to fetch warehouses");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWarehouses();
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Spin size="large" fullscreen />;
  }

  const handleCreateWarehouse = async (values: any) => {
    try {
      const payload = { ...values, tenantId };
      await createWarehouse(payload);
      toast.success("Warehouse created successfully");
      fetchWarehouses();
    } catch {
      toast.error("Failed to create warehouse");
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
          onClick={() => navigate(`/warehouses/${record.id}`)}
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
          <Button type="link">
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
        dataSource={Array.isArray(warehouses) ? warehouses : []}
        pagination={{ pageSize: 5 }}
      />

      <WarehouseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateWarehouse}
        tenantId={tenantId!}
      />
    </div>
  );
};
