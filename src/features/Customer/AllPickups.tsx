import { Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerPickups } from "../auth/api/tenantApi";
import { useCurrentUser } from "../../components/auth/useCurrentUser";

interface Shipment {
  id: string;
  sku: string;
  deliveryLocation: string;
  status: "CREATED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export const AllPickups = () => {
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["customerPickups", customerId],
    queryFn: () => fetchCustomerPickups(customerId!),
    enabled: !!customerId,
  });

  const allOrders = data?.data?.data?.orders || [];

  const pickupOrdersColumns = [
    { title: "Order Number", dataIndex: ["order", "sku"], key: "sku" },
    { title: "Destination", dataIndex: ["order", "deliveryLocation"], key: "deliveryLocation" },
    {
      title: "Status",
      dataIndex: ["order", "status"],
      key: "status",
      render: (status: Shipment["status"]) => {
        let color = "blue";
        if (status === "CREATED") color = "purple";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Pickup ID", dataIndex: "pickupId", key: "pickupId" },
    {
      title: "Created At",
      dataIndex: ["order", "createdAt"],
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>All Pickup Orders</Typography.Title>
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={allOrders}
        columns={pickupOrdersColumns}
        bordered
      />
    </div>
  );
};
