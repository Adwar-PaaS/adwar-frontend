import { useState } from "react";
import { Table, Tag, Typography, Button, message, Space } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCustomerPickups, requestPickup } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import type { ColumnsType } from "antd/es/table";

interface PickupRow {
  id: string;
  pickupNumber: string;
  status: "CREATED" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  type: "REGULAR" | "EXPRESS";
  createdAt: string;
  updatedAt: string;
}

export const AllPickups = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["customerPickups", customerId],
    queryFn: () => fetchCustomerPickups(customerId!),
    enabled: !!customerId,
  });

  const pickups: PickupRow[] = data?.data?.data?.pickups || [];

  // Local storage for selected pickups
  const [selectedPickupIds, setSelectedPickupIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("selectedPickups");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // Request pickup handler
  const handleRequestPickup = async () => {
    if (!selectedPickupIds.length) return;
    try {
      setLoading(true);

      // Send API call for each selected pickup
      await Promise.all(
        selectedPickupIds.map((id) =>
          requestPickup(id, {
            pickupStatus: "PENDING",
            orderStatus: "PENDING",
          })
        )
      );

      message.success("Pickup(s) requested successfully!");

      // Save to localStorage
      localStorage.setItem("selectedPickups", JSON.stringify(selectedPickupIds));

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["customerPickups", customerId] });
    } catch {
      message.error("Failed to request pickup(s).");
    } finally {
      setLoading(false);
    }
  };

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

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          disabled={!selectedPickupIds.length}
          loading={loading}
          onClick={handleRequestPickup}
        >
          Request Pickup
        </Button>
      </Space>

      <Table<PickupRow>
        rowKey="id"
        loading={isLoading}
        dataSource={pickups}
        columns={pickupColumns}
        bordered
        scroll={{ x: "max-content" }}
        rowSelection={{
          selectedRowKeys: selectedPickupIds,
          onChange: (keys) => setSelectedPickupIds(keys as string[]),
          getCheckboxProps: (record) => ({
            disabled: record.status !== "CREATED",
          }),
        }}
      />
    </div>
  );
};
