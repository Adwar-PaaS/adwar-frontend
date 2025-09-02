import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Typography, Spin } from "antd";
import { fetchOrdersByCustomer } from "../auth/api/tenantApi";
import { useCurrentUser } from "../../components/auth/useCurrentUser"; // adjust path

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
    | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export const CustomerOrdersList = () => {
 const { data: currentUserData } = useCurrentUser();
 
 const customerId = currentUserData?.data?.data?.user?.id;

  const {
    data,
    isLoading: isOrdersLoading,
  } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: () => fetchOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });

  const orders: Order[] = data?.data?.orders || [];

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
      <Typography.Title level={3}>Customer Orders</Typography.Title>
      {isOrdersLoading ? (
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
    </div>
  );
};
