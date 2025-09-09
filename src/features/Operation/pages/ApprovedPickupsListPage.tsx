import { Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPickups } from "../../auth/api/operationApi";

export interface PickupRequest {
  id: string;
  pickupId: string;
  requestedBy: string;
  respondedBy?: string | null;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED"
    | "APPROVED"
    | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export const ApprovedPickupsListPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["approvedPickupsList"],
    queryFn: fetchAllPickups,
  });

  const pickups: PickupRequest[] = data?.data?.requests || [];
  const approvedPickups = pickups.filter((p) => p.status === "APPROVED");

  const columns = [
    { title: "Pickup ID", dataIndex: "pickupId", key: "pickupId" },
    { title: "Requested By", dataIndex: "requestedBy", key: "requestedBy" },
    { title: "Responded By", dataIndex: "respondedBy", key: "respondedBy" },
    {
      title: "Pickup Request Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        if (status === "PENDING") color = "orange";
        if (status === "FAILED") color = "volcano";
        if (status === "APPROVED") color = "cyan";
        if (status === "REJECTED") color = "magenta";

        return <Tag color={color}>{status}</Tag>;
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
      <Typography.Title level={3}>Approved Pickup Requests</Typography.Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={approvedPickups}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
