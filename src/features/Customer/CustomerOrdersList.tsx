import { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { fetchOrdersByCustomer } from "../auth/api/tenantApi";
import { useCurrentUser } from "../../components/auth/useCurrentUser";
import { OrderModal } from "../tenants/components/OrderModal";

interface Order {
  id: string;
  sku: string;
  quantity: number;
  failedReason: string | null;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"
    | "APPROVED"
    | "CREATED"
    | "FAILED";
  createdAt: string;
  updatedAt: string;
  warehouseId?: string;
  customerName?: string;
  customerPhone?: string;
}

export const CustomerOrdersList = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

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
      sku: order.sku,
      quantity: order.quantity,
      warehouseId: order.warehouseId ?? "",
      deliveryLocation: order.deliveryLocation,
      merchantLocation: order.merchantLocation,
      description: order.description,
      customerName: order.customerName ?? "",
      customerPhone: order.customerPhone ?? "",
    };
  };

  const columns = [
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Delivery Location", dataIndex: "deliveryLocation", key: "deliveryLocation" },
    { title: "Merchant Location", dataIndex: "merchantLocation", key: "merchantLocation" },
    { title: "Description", dataIndex: "description", key: "description" },
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
            icon={<PlusOutlined />}
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
        tenantId={tenantId!}
        order={getOrderForModal(editingOrder)}
      />
    </div>
  );
};
