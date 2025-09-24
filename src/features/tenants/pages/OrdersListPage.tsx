import { useState } from "react";
import { Button, Table, Space, Row, Col, Typography, Tag, Spin } from "antd";
import { Link } from "react-router-dom";
import styles from "../../../styles/OrderListPage.module.css";
import { CustomerCreateOrder } from "../../Customer/components/CustomerCreateOrder";
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersForTenant } from "../../auth/api/tenantApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { UpdateStatusModal } from "../components/UpdateOrderStatusModal";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  priority: string;
  specialInstructions: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  failedReason: string | null;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  pickup?: {
    pickupNumber: string;
  } | null;
}

export const OrderListPage = () => {
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", tenantId],
    queryFn: () => fetchOrdersForTenant({ tenantId: tenantId! }),
    enabled: !!tenantId,
  });

  const orders: Order[] = data?.data?.orders || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState<string | null>(null);


  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber: string, record: Order) => (
        <Link to={`${record.id}`} style={{ color: "#1677ff" }}>
          {orderNumber}
        </Link>
      ),
    },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    {
      title: "Pickup Number",
      key: "pickup",
      render: (_: any, record: Order) =>
        record.pickup?.pickupNumber || "N/A",
    },
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
      title: "Estimated Delivery",
      dataIndex: "estimatedDelivery",
      key: "estimatedDelivery",
      render: (date: string) => new Date(date).toLocaleString(),
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
              setStatusOrderId(record.id);
              setStatusModalOpen(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row align="middle" justify="space-between" className={styles.headerRow}>
        <Col>
          <Typography.Title level={3} className={styles.name}>
            Orders
          </Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Add Order
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          bordered
          style={{ marginTop: 16 }}
          scroll={{ x: "max-content" }}
        />
      )}

      <CustomerCreateOrder
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => refetch()}
      />

      <UpdateStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        orderId={statusOrderId}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
