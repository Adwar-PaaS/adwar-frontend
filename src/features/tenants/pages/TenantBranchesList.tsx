import { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Row,
  Col,
  Space,
  message,
  Popconfirm,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchTenantBranches } from "../../auth/api/tenantApi";
import { deleteBranch } from "../../auth/api/customerApi";
import { BranchModal } from "../../Customer/components/BranchModal";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";

interface Branch {
  id: string;
  name: string;
  status: string;
  type: string;
  category: string;
  address: {
    label: string;
    address1: string;
    city: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const TenantBranchesList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

const { data, isLoading } = useQuery({
  queryKey: ["tenantBranches", tenantId],
  queryFn: () => fetchTenantBranches(tenantId!),
  enabled: !!tenantId,
});

const branches: Branch[] = data?.data?.data?.branches || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleModalSubmit = () => {
    queryClient.invalidateQueries({
      queryKey: ["tenantBranches", tenantId],
    });
    setModalOpen(false);
    setEditingBranch(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBranch(id);
      message.success("Branch deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["tenantBranches", tenantId],
      });
    } catch (error) {
      message.error("Failed to delete branch");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Branch) => (
        <Button type="link" onClick={() => navigate(`${record.id}`)}>
          {record.name}
        </Button>
      ),
    },
    {
      title: "City",
      dataIndex: ["address", "city"],
      key: "city",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
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

          <Popconfirm
            title="Are you sure you want to delete this branch?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Typography.Title level={3}>Tenant Branches</Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
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
        branch={editingBranch || undefined}
      />
    </div>
  );
};
