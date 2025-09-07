import { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { fetchBranchesByCustomer } from "../../auth/api/tenantApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
// import { BranchModal } from "../../tenants/components/BranchModal"; 

interface Branch {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export const CustomerBranchesList = () => {
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const customerId = currentUserData?.data?.data?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["customerBranches", customerId],
    queryFn: () => fetchBranchesByCustomer(customerId!),
    enabled: !!customerId,
  });

  const branches: Branch[] = data?.data?.data?.branches || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleModalSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["customerBranches", customerId] });
    setModalOpen(false);
    setEditingBranch(null);
  };

  const getBranchForModal = (branch: Branch | null) => {
    if (!branch) return undefined;
    return {
      id: branch.id,
      name: branch.name,
      location: branch.location,
      phone: branch.phone,
      status: branch.status,
    };
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Branch["status"]) => {
        let color = status === "ACTIVE" ? "green" : "red";
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
      render: (_: any, record: Branch) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingBranch(record);
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
          <Typography.Title level={3}>Customer Branches</Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBranch(null);
              setModalOpen(true);
            }}
          >
            Add Branch
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={branches}
        loading={isLoading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: "max-content" }}
      />

      {/* <BranchModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBranch(null);
        }}
        onSubmit={handleModalSubmit}
        branch={getBranchForModal(editingBranch)}
      /> */}
    </div>
  );
};
