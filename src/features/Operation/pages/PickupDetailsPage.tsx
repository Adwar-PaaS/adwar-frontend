import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Table, Typography, Tag } from "antd";
import { fetchPickupOrders } from "../../auth/api/operationApi";

interface PickupOrder {
  id: string;
  sku: string;
  quantity: number;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  failedReason?: string | null;
}

export const PickupDetailsPage = () => {
  const { pickupId } = useParams<{ pickupId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["pickupOrders", pickupId],
    queryFn: () => fetchPickupOrders(pickupId!),
    enabled: !!pickupId,
  });

  const orders: PickupOrder[] = data?.data?.data?.orders || [];

  const columns = [
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Customer Phone", dataIndex: "customerPhone", key: "customerPhone" },
    { title: "Delivery Location", dataIndex: "deliveryLocation", key: "deliveryLocation" },
    { title: "Merchant Location", dataIndex: "merchantLocation", key: "merchantLocation" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: PickupOrder) => {
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
  ];

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={3}>Pickup Orders</Typography.Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
