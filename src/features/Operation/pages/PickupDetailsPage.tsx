import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Typography, Tag, Button, message, Space } from "antd";
import {
  fetchPickupOrders,
  approvePickupRequest,
  rejectPickupRequest,
  fetchAllPickups,
} from "../../auth/api/operationApi";

interface PickupOrder {
  id: string;
  sku: string;
  quantity: number;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED"
    | "APPROVED"
    | "REJECTED";
  createdAt: string;
  updatedAt: string;
  failedReason?: string | null;
}

export const PickupDetailsPage = () => {
 const { tenantId, pickupId } = useParams<{ tenantId: string; pickupId: string }>();
   const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["pickupOrders", pickupId],
    queryFn: () => fetchPickupOrders(pickupId!),
    enabled: !!pickupId,
  });

  const { data: requestsData } = useQuery({
    queryKey: ["pickupRequests", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });
  
  const orders: PickupOrder[] = ordersData?.data?.data?.orders || [];
  const requests: any[] = requestsData?.data?.requests || [];

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => approvePickupRequest(requestId),
    onSuccess: () => {
      message.success("Request approved successfully!");
      if (pickupId) {
        queryClient.invalidateQueries({ queryKey: ["pickupOrders", pickupId] });
      }
      queryClient.invalidateQueries({ queryKey: ["pickupRequests"] });
    },
    onError: () => {
      message.error("Failed to approve request.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => rejectPickupRequest(requestId),
    onSuccess: () => {
      message.success("Request rejected successfully!");
      if (pickupId) {
        queryClient.invalidateQueries({ queryKey: ["pickupOrders", pickupId] });
      }
      queryClient.invalidateQueries({ queryKey: ["pickupRequests"] });
    },
    onError: () => {
      message.error("Failed to reject request.");
    },
  });

  const columns = [
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    {
      title: "Customer Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Delivery Location",
      dataIndex: "deliveryLocation",
      key: "deliveryLocation",
    },
    {
      title: "Merchant Location",
      dataIndex: "merchantLocation",
      key: "merchantLocation",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: PickupOrder) => {
        let color = "blue";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        if (status === "PENDING") color = "orange";
        if (status === "FAILED") color = "volcano";
        if (status === "APPROVED") color = "cyan";
        if (status === "REJECTED") color = "magenta";

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
      title: "Pickup Request Status",
      key: "actions",
      render: (_: any) => {
        const request = requests.find((r) => r.pickupId === pickupId);

        if (!request || request.status !== "PENDING") {
          return (
            <Tag color={request?.status === "APPROVED" ? "cyan" : "magenta"}>
              {request?.status}
            </Tag>
          );
        }

        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => approveMutation.mutate(request.id)}
              loading={approveMutation.isPending}
            >
              Approve
            </Button>
            <Button
              danger
              size="small"
              onClick={() => rejectMutation.mutate(request.id)}
              loading={rejectMutation.isPending}
            >
              Reject
            </Button>
          </Space>
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
      <Typography.Title level={3}>
        Pickup Orders for: {pickupId}
      </Typography.Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
