import { useState } from "react";
import { Table, Tag, Typography, Button, Row, Col, Space, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditOutlined } from "@ant-design/icons";
import { fetchOrdersByCustomer } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { CustomerCreateOrder, type FailedReason, type OrderStatus } from "../components/CustomerCreateOrder";
import { CustomerUpdateOrder } from "../components/CustomerUpdateOrder";

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
  status: string;
  totalWeight: string;
  totalValue: string;
  packageCount: number;
  failedReason: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export const CustomerOrdersList = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData, isLoading: isUserLoading } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const { data, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: () => fetchOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });

  const orders: Order[] = data?.data?.data?.orders || [];

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Convert Order -> OrderFormValues + id
  const mapOrderToUpdateForm = (order: Order) => ({
    id: order.id,
    orderNumber: order.orderNumber || "",
    specialInstructions: order.specialInstructions || "",
    priority: order.priority || "MEDIUM",
    estimatedDelivery: order.estimatedDelivery || "",
    status: order.status as OrderStatus,
    failedReason: order.failedReason as FailedReason | undefined,
    items: order.items?.map((item) => ({
      sku: item.sku || "",
      name: item.name || "",
      description: item.description || "",
      weight: Number(item.weight) || 0,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
    })) || [],
  });

  const handleModalSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["customerOrders", customerId] });
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setEditingOrder(null);
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
    { title: "Weight (kg)", dataIndex: "totalWeight", key: "totalWeight" },
    { title: "Value ($)", dataIndex: "totalValue", key: "totalValue" },
    { title: "Packages", dataIndex: "packageCount", key: "packageCount" },
    {
      title: "Special Instructions",
      dataIndex: "specialInstructions",
      key: "specialInstructions",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => {
        let color = "blue";
        switch (status) {
          case "CREATED":
            color = "purple";
            break;
          case "COMPLETED":
            color = "green";
            break;
          case "CANCELLED":
            color = "red";
            break;
          case "PENDING":
            color = "orange";
            break;
          case "FAILED":
            color = "volcano";
            break;
          case "DRAFT":
            color = "geekblue";
            break;
        }

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
              setUpdateModalOpen(true);
            }}
          >
            <EditOutlined /> Edit
          </Button>
        </Space>
      ),
    },
  ];

  if (isUserLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, marginTop: 24 }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={3}>Customer Orders</Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setCreateModalOpen(true)}>
            Add Order
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isOrdersLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
      />

      {createModalOpen && (
        <CustomerCreateOrder
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {updateModalOpen && editingOrder && (
        <CustomerUpdateOrder
          open={updateModalOpen}
          order={mapOrderToUpdateForm(editingOrder)}
          onClose={() => setUpdateModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};
