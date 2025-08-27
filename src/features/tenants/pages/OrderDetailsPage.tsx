import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Spin, Typography } from "antd";
import { fetchOrderById } from "../../auth/api/tenantApi";
import styles from "./OrderDetailsPage.module.css";

export const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (isError || !order) return <Typography.Text type="danger">Failed to load order details</Typography.Text>;

  return (
    <div className={styles.container}>
      <Card title={`Order Details - ${order.sku}`} >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="SKU">{order.sku}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{order.quantity}</Descriptions.Item>
          <Descriptions.Item label="Customer Name">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Customer Phone">{order.customerPhone}</Descriptions.Item>
          <Descriptions.Item label="Delivery Location">{order.deliveryLocation}</Descriptions.Item>
          <Descriptions.Item label="Merchant Location">{order.merchantLocation}</Descriptions.Item>
          <Descriptions.Item label="Description">{order.description}</Descriptions.Item>
          <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
          <Descriptions.Item label="Warehouse ID">{order.warehouseId || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Delivered At">{order.deliveredAt || "Not delivered yet"}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{new Date(order.updatedAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
