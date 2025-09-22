import { Table, Tag, Typography, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPickups } from "../../auth/api/operationApi";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

export interface PickupRequest {
  id: string;
  pickupId: string;
  requestedBy: string;
  respondedBy?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export const PickupsListPage = () => {
  const navigate = useNavigate();
  const { data: currentUserData } = useCurrentUser();

  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });

  const pickups: PickupRequest[] = data?.data?.requests || [];

  const columns = [
    {
      title: "Pickup ID",
      dataIndex: "pickupId",
      key: "pickupId",
      render: (pickupId: string) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/tenant/${tenantId}/operation/pickups/${pickupId}`)
          }
        >
          {pickupId}
        </Button>
      ),
    },
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
      <Typography.Title level={3}>Pickup Requests</Typography.Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={pickups}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
