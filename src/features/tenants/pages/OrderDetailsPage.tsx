import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button, Card, Spin, Tag, Typography, Table } from "antd";
import { fetchOrderById } from "../../auth/api/tenantApi";
import styles from "../../../styles/OrderDetailsPage.module.css";
import { OrderModal } from "../components/OrderModal";
import { useState } from "react";
import { UploadFileModal } from "../components/UploadFileModal";

export const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });

  const order = data;

  const handleUpload = (file: File) => {
    console.log("Uploaded file:", file);
  };

  if (isLoading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  if (isError || !order)
    return (
      <Typography.Text type="danger">
        Failed to load order details
      </Typography.Text>
    );

  const columns = [
    { title: "Field", dataIndex: "field", key: "field" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const dataSource = [
    { key: "1", field: "Order Number", value: order.orderNumber },
    { key: "2", field: "Reference Number", value: order.referenceNumber || "N/A" },
    { key: "3", field: "Total Weight", value: order.totalWeight },
    { key: "4", field: "Total Value", value: order.totalValue },
    { key: "5", field: "Package Count", value: order.packageCount },
    { key: "6", field: "Special Instructions", value: order.specialInstructions || "N/A" },
    {
      key: "7",
      field: "Status",
      value: (
        <Tag
          color={
            order.status === "COMPLETED"
              ? "green"
              : order.status === "CANCELLED"
              ? "red"
              : order.status === "PENDING"
              ? "orange"
              : order.status === "FAILED"
              ? "volcano"
              : "blue"
          }
        >
          {order.status}
        </Tag>
      ),
    },
    { key: "8", field: "Priority", value: order.priority },
    { key: "9", field: "Estimated Delivery", value: order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString() : "N/A" },
    { key: "10", field: "Delivered At", value: order.deliveredAt || "Not delivered yet" },
    { key: "11", field: "Created At", value: new Date(order.createdAt).toLocaleString() },
    { key: "12", field: "Updated At", value: new Date(order.updatedAt).toLocaleString() },
    { key: "13", field: "Customer Name", value: `${order.customer.firstName} ${order.customer.lastName}` },
    { key: "14", field: "Customer Email", value: order.customer.email },
    { key: "15", field: "Customer Phone", value: order.customer.phone },
  ];

  return (
    <div className={styles.container}>
      <Card
        title={`Order Details - ${order.orderNumber}`}
        extra={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Edit
            </Button>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              Upload File
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="middle"
        />
      </Card>

      <OrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={order}
        onSubmit={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />

      <UploadFileModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};
