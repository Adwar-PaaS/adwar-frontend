import { useState } from "react";
import { Button, Table, Space, Row, Col, Typography, Tag, Spin } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "../../../styles/OrderListPage.module.css";
import { OrderModal } from "../components/OrderModal";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../auth/api/tenantApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { UpdateStatusModal } from "../components/UpdateOrderStatusModal";
import { AssignWarehouseModal } from "../components/AssignWarehouseModal";

interface Order {
  id: string;
  sku: string;
  quantity: number;
  failedReason: string | null;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "APPROVED" | "FAILED";
  warehouseId: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const OrderListPage = () => {
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders({ page: 1, limit: 50 }),
  });

  const orders = data?.data?.orders || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState<string | null>(null);

  const [assignWarehouseOpen, setAssignWarehouseOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (sku: string, record: Order) => (
        <Link to={`${record.id}`} style={{ color: "#1677ff" }}>
          {sku}
        </Link>
      ),
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    {
      title: "Customer Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Delivery Location",
      dataIndex: "deliveryLocation",
      key: "deliveryLocation",
    },
    {
      title: "Merchant Location",
      dataIndex: "merchantLocation",
      key: "merchantLocation",
    },
    { title: "Description", dataIndex: "description", key: "description" },
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
          <Button
            type="link"
          >
            Assign Driver
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedOrder(record);
              setAssignWarehouseOpen(true);
            }}
          >
            Assign Warehouse
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
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

      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tenantId={tenantId}
        onSubmit={() => {
          refetch();
        }}
      />

      {selectedOrder && tenantId && (
        <AssignWarehouseModal
          open={assignWarehouseOpen}
          onClose={() => setAssignWarehouseOpen(false)}
          tenantId={tenantId}
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          onSuccess={refetch}
        />
      )}

      <UpdateStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        orderId={statusOrderId}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
