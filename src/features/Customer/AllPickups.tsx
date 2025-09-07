import { Table, Tag, Typography, Button, message, Space } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomerPickups, createPickupRequest } from "../auth/api/tenantApi";
import { useCurrentUser } from "../../components/auth/useCurrentUser";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";

interface PickupRow {
  pickupId: string;
  status: "CREATED" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  orderIds: string[];
}

export const AllPickups = () => {
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["customerPickups", customerId],
    queryFn: () => fetchCustomerPickups(customerId!),
    enabled: !!customerId,
  });

  const pickups: PickupRow[] = data?.data?.data?.pickups || [];

  const mutation = useMutation({
    mutationFn: async (payload: { pickupId: string; orderIds: string[] }) =>
      await createPickupRequest(payload.pickupId),
    onSuccess: () => {
      message.success("Request sent successfully!");
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["customerPickups"] });
    },
    onError: () => {
      message.error("Failed to send request.");
    },
  });

  const handleSendRequest = () => {
    if (!selectedRowKeys.length) return;

    const selectedPickups = pickups.filter((p) =>
      selectedRowKeys.includes(p.pickupId)
    );

    selectedPickups.forEach((p) => {
      mutation.mutate({ pickupId: p.pickupId, orderIds: p.orderIds });
    });
  };

  const pickupColumns: ColumnsType<PickupRow> = [
    { title: "Pickup ID", dataIndex: "pickupId", key: "pickupId" },
    {
      title: "Number of Orders",
      dataIndex: "orderIds",
      key: "orderCount",
      render: (orderIds: string[]) => orderIds.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PickupRow["status"]) => {
        let color = "blue";
        if (status === "CREATED") color = "purple";
        if (status === "PENDING") color = "orange";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>All Pickups</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          loading={mutation.isPending}
          onClick={handleSendRequest}
        >
          Send Request for Selected
        </Button>
      </Space>
      <Table<PickupRow>
        rowKey="pickupId"
        loading={isLoading}
        dataSource={pickups}
        columns={pickupColumns}
        bordered
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getCheckboxProps: (record) => ({
            disabled: record.status === "PENDING", // prevent selecting already pending pickups
          }),
        }}
      />
    </div>
  );
};
