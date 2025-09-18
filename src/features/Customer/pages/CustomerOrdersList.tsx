import { useState } from "react";
import { Table, Tag, Typography, Button, Row, Col, Space } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditOutlined } from "@ant-design/icons";
import { fetchOrdersByCustomer } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import {
  OrderModal,
  type FailedReason,
} from "../../tenants/components/OrderModal";

interface OrderItem {
  sku: string;
  name: string;
  description: string;
  weight: number;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  specialInstructions: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedDelivery: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "ASSIGNED_FOR_PICKUP"
    | "PICKED_UP"
    | "RECEIVED_IN_WAREHOUSE"
    | "STORED_ON_SHELVES"
    | "READY_FOR_DISPATCH"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "FAILED"
    | "RESCHEDULED"
    | "CANCELLED"
    | "RETURNED_TO_OPERATION"
    | "READY_TO_RETURN_TO_ORIGIN"
    | "RETURNED_TO_ORIGIN";
  failedReason: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export const CustomerOrdersList = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: () => fetchOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });

  const orders: Order[] = data?.data?.data?.orders || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleModalSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["customerOrders", customerId] });
    setModalOpen(false);
    setEditingOrder(null);
  };

const getOrderForModal = (order: Order | null) => {
  if (!order) return undefined;

  return {
    id: order.id,
    orderNumber: order.orderNumber || "ORD-",
    specialInstructions: order.specialInstructions || "",
    priority: order.priority || "MEDIUM",
    estimatedDelivery: order.estimatedDelivery || "",
    status: order.status || "PENDING",
    failedReason: order.failedReason
      ? (order.failedReason as FailedReason)
      : undefined,
    items:
      order.items && order.items.length > 0
        ? order.items.map((item: any) => ({
            sku: item.productId || "PROD-", // map productId → sku
            name: item.name || "",
            description: item.description || "",
            weight: Number(item.weight) || 0,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
          }))
        : [
            {
              sku: "PROD-",
              name: "",
              description: "",
              weight: 0,
              quantity: 1,
              unitPrice: 0,
            },
          ],
  };
};




  const columns = [
    { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    {
      title: "Estimated Delivery",
      dataIndex: "estimatedDelivery",
      key: "estimatedDelivery",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Items",
      key: "items",
      render: (_: any, record: Order) => (
        <div>
          {record.items && record.items.length > 0 ? (
            record.items.map((item, idx) => (
              <div key={idx}>
                <b>{item.name}</b> (SKU: {item.sku}) - {item.quantity} × $
                {item.unitPrice}
              </div>
            ))
          ) : (
            <i>No items</i>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => {
        let color = "blue";
        if (status === "CREATED") color = "purple";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        if (status === "PENDING") color = "orange";
        if (status === "FAILED") color = "volcano";
        if (status === "DRAFT") color = "geekblue";

        return (
          <div>
            <Tag color={color}>{status}</Tag>
            {status === "FAILED" && record.failedReason && (
              <div style={{ fontSize: 10, color: "red" }}>
                Reason: {record.failedReason.replace(/_/g, " ")}
              </div>
            )}
          </div>
        );
      },
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingOrder(record);
              setModalOpen(true);
            }}
          >
            <EditOutlined /> Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Typography.Title level={3}>Customer Orders</Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setEditingOrder(null);
              setModalOpen(true);
            }}
          >
            Add Order
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
      />

      <OrderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingOrder(null);
        }}
        onSubmit={handleModalSubmit}
        order={getOrderForModal(editingOrder)}
      />
    </div>
  );
};
