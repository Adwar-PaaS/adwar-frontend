// src/features/Customer/pages/PickupsListPage.tsx
import { useState } from "react";
import { Table, Tag, Typography, Row, Col, Button, Space } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { fetchAllPickups } from "../../auth/api/operationApi";

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
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList"],
    queryFn: fetchAllPickups,
  });

  const pickups: PickupRequest[] = data?.data?.requests || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPickup, setEditingPickup] = useState<PickupRequest | null>(null);

  const columns = [
    { title: "Pickup ID", dataIndex: "pickupId", key: "pickupId" },
    { title: "Requested By", dataIndex: "requestedBy", key: "requestedBy" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        if (status === "PENDING") color = "orange";
        if (status === "FAILED") color = "volcano";
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PickupRequest) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingPickup(record);
              setModalOpen(true);
            }}
          >
            <EditOutlined /> Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Typography.Title level={3}>Pickup Requests</Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPickup(null);
              setModalOpen(true);
            }}
          >
            Add Pickup
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={pickups}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
      />

      {modalOpen && (
        <div>
          <div>Modal content for {editingPickup?.id || "new pickup"}</div>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </div>
      )}
    </div>
  );
};
