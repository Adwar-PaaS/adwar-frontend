import { Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerPickups } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import type { ColumnsType } from "antd/es/table";

interface PickupRow {
  id: string;
  pickupNumber: string;
  status: "CREATED" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  type: "REGULAR" | "EXPRESS";
  scheduledFor: string | null;
  completedAt: string | null;
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

  const pickups: PickupRow[] = data?.data?.data?.pickups || [];

  const pickupColumns: ColumnsType<PickupRow> = [
    { title: "Pickup Number", dataIndex: "pickupNumber", key: "pickupNumber" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PickupRow["status"]) => {
        let color = "blue";
        if (status === "CREATED") color = "purple";
        else if (status === "PENDING") color = "orange";
        else if (status === "PROCESSING") color = "gold";
        else if (status === "COMPLETED") color = "green";
        else if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Scheduled For",
      dataIndex: "scheduledFor",
      key: "scheduledFor",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>All Pickups</Typography.Title>
      <Table<PickupRow>
        rowKey="id"
        loading={isLoading}
        dataSource={pickups}
        columns={pickupColumns}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
