import { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { fetchBranchesByCustomer } from "../../auth/api/customerApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { BranchModal } from "../components/BranchModal";

interface Branch {
  id: string;
  name: string;
  location: string;
  phone?: string;
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

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    { title: "Actions", key: "actions",
      render: (_: any, record: Branch) => (
        <Space>
          <Button type="link" onClick={() => {
            setEditingBranch(record);
            setModalOpen(true);
          }}>
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
          <Button type="primary" icon={<PlusOutlined />}
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

      <BranchModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBranch(null);
        }}
        onSubmit={handleModalSubmit}
        branch={editingBranch ? {
          id: editingBranch.id,
          name: editingBranch.name,
          location: editingBranch.location,
        } : undefined}
      />
    </div>
  );
};
