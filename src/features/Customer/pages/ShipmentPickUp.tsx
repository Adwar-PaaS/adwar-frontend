import { useState } from "react";
import { Table, Tag, Typography, Button, Row, Col, message, Space } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrdersByCustomer, createPickup } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { AllPickups } from "../components/AllPickups";

interface Order {
  id: string;
  orderNumber: string;
  totalWeight: string;
  totalValue: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "DRAFT" | "COMPLETED" | "CANCELLED";
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export const ShipmentPickUp = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const [pickedOrderIds, setPickedOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pickedOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllPickups, setShowAllPickups] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: () => fetchOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });

  const orders: Order[] = data?.data?.data?.orders || [];

  const handleCreatePickup = async () => {
    if (!selectedRowKeys.length) return;
    try {
      setLoading(true);
      await createPickup(selectedRowKeys as string[]);
      message.success("Pickup created successfully!");

      const newPicked = [...pickedOrderIds, ...selectedRowKeys.map(String)];
      setPickedOrderIds(newPicked);
      localStorage.setItem("pickedOrders", JSON.stringify(newPicked));

      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["customerPickups"] });
    } catch {
      message.error("Failed to create pickup");
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Total Weight (kg)", dataIndex: "totalWeight", key: "totalWeight" },
    { title: "Total Value ($)", dataIndex: "totalValue", key: "totalValue" },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Order["priority"]) => {
        const color =
          priority === "HIGH"
            ? "red"
            : priority === "MEDIUM"
            ? "orange"
            : "green";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => {
        const color =
          status === "PENDING"
            ? "blue"
            : status === "COMPLETED"
            ? "green"
            : status === "CANCELLED"
            ? "red"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Estimated Delivery",
      dataIndex: "estimatedDelivery",
      key: "estimatedDelivery",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Typography.Title level={3}>Orders for Pickup</Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              disabled={!selectedRowKeys.length}
              loading={loading}
              onClick={handleCreatePickup}
            >
              Create Pickup
            </Button>
            <Button
              type="default"
              onClick={() => setShowAllPickups((prev) => !prev)}
            >
              {showAllPickups ? "Hide All Pickups" : "View All Pickups"}
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={orderColumns}
        dataSource={orders}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getCheckboxProps: (record) => ({
            disabled: pickedOrderIds.includes(record.id),
          }),
        }}
      />

      {showAllPickups && <AllPickups />}
    </div>
  );
};
