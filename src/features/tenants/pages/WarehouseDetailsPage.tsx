import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Table, Spin, Typography, Tag } from "antd";
import {
  fetchWarehouseById,
  fetchWarehouseOrders,
  fetchWarehouseDrivers,
  fetchWarehouseUsers,
} from "../../auth/api/tenantApi";
import styles from "../../../styles/WarehouseDetailsPage.module.css";

interface Order {
  id: string;
  sku: string;
  quantity: number;
  customerName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Driver {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  status: string;
  role: {
    id: string;
    name: string;
  };
  tenantId: string;
  warehouseId: string;
}

interface WarehouseUser {
  id: string;
  userId: string;
  tenantId: string;
  warehouseId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    status: string;
    role: {
      id: string;
      name: string;
    };
  };
}

export const WarehouseDetailsPage = () => {
  const { warehouseId } = useParams<{ warehouseId: string }>();

  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => fetchWarehouseById(warehouseId!),
    enabled: !!warehouseId,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["warehouseOrders", warehouseId],
    queryFn: () => fetchWarehouseOrders(warehouseId!),
    enabled: !!warehouseId,
  });

  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["warehouseDrivers", warehouseId],
    queryFn: () => fetchWarehouseDrivers(warehouseId!),
    enabled: !!warehouseId,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["warehouseUsers", warehouseId],
    queryFn: () => fetchWarehouseUsers(warehouseId!),
    enabled: !!warehouseId,
  });

  if (warehouseLoading || ordersLoading || driversLoading || usersLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  const warehouse = warehouseData?.data?.data?.warehouse;
  const orders: Order[] = ordersData?.data?.data?.orders || [];
  const drivers: Driver[] = driversData?.data?.data?.drivers || [];
  const users: WarehouseUser[] = usersData?.data?.data?.users || [];

  if (!warehouse) {
    return (
      <Typography.Text type="danger">
        Failed to load warehouse details
      </Typography.Text>
    );
  }

  const orderColumns = [
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "COMPLETED"
              ? "green"
              : status === "PENDING"
              ? "orange"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const driverColumns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  const userColumns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  const driverData = drivers.map((driver) => ({
    key: driver.id,
    fullName: driver.fullName,
    email: driver.email,
    phone: driver.phone,
    status: driver.status,
  }));

  const userData = users.map((entry) => ({
    key: entry.id,
    fullName: entry.user.fullName,
    email: entry.user.email,
    phone: entry.user.phone,
    status: entry.user.status,
    role: entry.user.role?.name || "N/A",
  }));

  return (
    <div className={styles.container}>
      <Card
        title={`Warehouse - ${warehouse.name}`}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Location">
            {warehouse.location}
          </Descriptions.Item>
          <Descriptions.Item label="Capacity">
            {warehouse.capacity}
          </Descriptions.Item>
          <Descriptions.Item label="Current Stock">
            {warehouse.currentStock}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={warehouse.status === "OPEN" ? "green" : "red"}>
              {warehouse.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(warehouse.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(warehouse.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Orders" style={{ marginBottom: 24 }}>
        <Table
          rowKey="id"
          columns={orderColumns}
          dataSource={orders}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card title="Drivers" style={{ marginBottom: 24 }}>
        <Table
          rowKey="key"
          columns={driverColumns}
          dataSource={driverData}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card title="Users">
        <Table
          rowKey="key"
          columns={userColumns}
          dataSource={userData}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};
