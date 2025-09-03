import { useState } from "react";
import { Table, Tag, Typography, Button, Row, Col, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrdersByCustomer, createPickup } from "../auth/api/tenantApi";
import { useCurrentUser } from "../../components/auth/useCurrentUser";

interface Shipment {
  id: string;
  sku: string;
  deliveryLocation: string;
  status: "CREATED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export const ShipmentPickUp = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const [pickedOrderIds, setPickedOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pickedOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const { data, isLoading } = useQuery({
    queryKey: ["customerShipments", customerId],
    queryFn: () => fetchOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });

  const shipments: Shipment[] = data?.data?.data?.orders || [];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreatePickup = async () => {
    if (!selectedRowKeys.length) return;
    try {
      setLoading(true);
      await createPickup(selectedRowKeys as string[]);
      message.success({
        content: "Pickup created successfully!",
        key: "pickup-success",
        duration: 3,
      });

      const newPicked = [...pickedOrderIds, ...selectedRowKeys.map(String)];
      setPickedOrderIds(newPicked);
      localStorage.setItem("pickedOrders", JSON.stringify(newPicked));

      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["customerShipments"] });
    } catch (err) {
      message.error("Failed to create pickup");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Order Number", dataIndex: "sku", key: "sku" },
    {
      title: "Destination",
      dataIndex: "deliveryLocation",
      key: "deliveryLocation",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Shipment["status"]) => {
        let color = "blue";
        if (status === "CREATED") color = "purple";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
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
      <Row align="middle" justify="space-between">
        <Col>
          <Typography.Title level={3}>Shipments for Pickup</Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            disabled={!selectedRowKeys.length}
            loading={loading}
            onClick={handleCreatePickup}
          >
            Create Pickup
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={shipments}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getCheckboxProps: (record) => ({
            disabled: pickedOrderIds.includes(record.id),
          }),
        }}
      />
    </div>
  );
};
