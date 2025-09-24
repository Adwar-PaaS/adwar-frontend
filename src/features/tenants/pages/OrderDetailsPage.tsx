import { useState } from "react";
import { Table, Tag, Typography, Button, Card, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById } from "../../auth/api/tenantApi";
import { CustomerUpdateOrder, type FailedReason, type OrderStatus } from "../../Customer/components/CustomerUpdateOrder";
import styles from "../../../styles/OrderDetailsPage.module.css";

export const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  if (isLoading)
    return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;

  if (isError || !order)
    return <Typography.Text type="danger">Failed to load order details</Typography.Text>;

  // Map order to update form values
  const mapOrderToUpdateForm = (order: any) => ({
    id: order.id,
    orderNumber: order.orderNumber || "",
    specialInstructions: order.specialInstructions || "",
    priority: order.priority || "MEDIUM",
    estimatedDelivery: order.estimatedDelivery || "",
    status: order.status as OrderStatus,
    failedReason: order.failedReason as FailedReason | undefined,
    items: order.items?.map((item: any) => ({
      productId: item.productId || "",
      sku: item.sku || "",
      name: item.name || "",
      description: item.description || "",
      weight: Number(item.weight) || 0,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
    })) || [],
  });

  const handleModalSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    setUpdateModalOpen(false);
    refetch();
  };

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
          <Button type="primary" onClick={() => setUpdateModalOpen(true)}>
            Edit Order
          </Button>
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

      {updateModalOpen && (
        <CustomerUpdateOrder
          open={updateModalOpen}
          order={mapOrderToUpdateForm(order)}
          onClose={() => setUpdateModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};
