import { Table, Tag, Typography, Button, Modal, Select, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllPickups,
  updatePickupBranch,
} from "../../auth/api/operationApi";
import { fetchTenantBranches } from "../../auth/api/tenantApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { useState } from "react";

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
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });

  const pickups: PickupRequest[] = data?.data?.pickups || [];
  const approvedPickups = pickups.filter((p) => p.status === "APPROVED");

  // Get already assigned pickups from localStorage
  const assignedPickups: string[] = JSON.parse(
    localStorage.getItem("assignedPickups") || "[]"
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const { data: branchesData } = useQuery({
    queryKey: ["tenantBranches", tenantId],
    queryFn: () => fetchTenantBranches(tenantId!),
    enabled: isModalOpen && !!tenantId,
  });

  const branches = branchesData?.data?.data?.branches || [];

  const { mutateAsync: assignBranch, isPending: isAssigning } = useMutation({
    mutationFn: async () => {
      if (!selectedBranch) return;
      await Promise.all(
        selectedRowKeys.map((pickupId) =>
          updatePickupBranch(pickupId as string, selectedBranch)
        )
      );
    },
    onSuccess: () => {
      message.success("Branch assigned successfully!");

      // Save assigned pickups to localStorage
      const stored = JSON.parse(
        localStorage.getItem("assignedPickups") || "[]"
      );
      const updated = Array.from(new Set([...stored, ...selectedRowKeys]));
      localStorage.setItem("assignedPickups", JSON.stringify(updated));

      setIsModalOpen(false);
      setSelectedRowKeys([]);
      setSelectedBranch(null);
      queryClient.invalidateQueries({ queryKey: ["pickupsList", tenantId] });
    },
    onError: () => {
      message.error("Failed to assign branch.");
    },
  });

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
    {
      title: "Branch Assignment",
      key: "branchAssigned",
      render: (_: any, record: PickupRequest) =>
        assignedPickups.includes(record.id) ? (
          <Tag color="green">Already Assigned</Tag>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={3}>Approved Pickup Requests</Typography.Title>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={() => setIsModalOpen(true)}
        >
          Select Branch
        </Button>
      </div>

      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (record: PickupRequest) => ({
            disabled: assignedPickups.includes(record.id), // disable already assigned pickups
          }),
        }}
        columns={columns}
        dataSource={approvedPickups}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Assign Branch to Pickups"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => assignBranch()}
        confirmLoading={isAssigning}
        okButtonProps={{ disabled: !selectedBranch }}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select a branch"
          onChange={(value) => setSelectedBranch(value)}
        >
          {branches.map((branch: any) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};
