import { Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPickups } from "../../auth/api/operationApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

export interface PickupRequest {
  id: string;
  pickupNumber: string;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED"
    | "APPROVED"
    | "REJECTED";
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const ApprovedPickupsListPage = () => {
  const { data: currentUserData } = useCurrentUser();

  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });

  const pickups: PickupRequest[] = data?.data?.pickups || [];
  const approvedPickups = pickups.filter((p) => p.status === "APPROVED");

  const columns = [
    { title: "Pickup Number", dataIndex: "pickupNumber", key: "pickupNumber" },
    { title: "Type", dataIndex: "type", key: "Type" },
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
