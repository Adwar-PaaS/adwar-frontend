import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  createSuperAdminUser,
  getTenantById,
  getUsersByTenantId,
} from "../../auth/api/tenantApi";
import { Button, Col, Tag, Row, Spin, Table, Typography } from "antd";
import styles from "../../../styles/TenantDetails.module.css";
import { TenantSuperAdminUserFormModal } from "../components/TenantSuperAdminUserFormModal";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TenantDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const userModalOpen = useState(false);
  const [isUserModalOpen, setUserModalOpen] = userModalOpen;

  // Fetch tenant + users in one query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tenant-details", id],
    queryFn: async () => {
      const [tenantRes, usersRes] = await Promise.all([
        getTenantById(id!),
        getUsersByTenantId(id!), // get users from API instead of tenant.users
      ]);
      return {
        tenant: tenantRes.data.data.tenant,
        users: Array.isArray(usersRes.data.data?.users)
          ? usersRes.data.data.users.map((u: any) => ({
              id: u.user.id,
              fullName: u.user.fullName,
              email: u.user.email,
              phone: u.user.phone,
              status: u.user.status,
              role: u.user.role?.name,
              warehouse: u.warehouse,
            }))
          : [],
      };
    },
    enabled: !!id,
  });

  // Mutation for creating tenant user
  const createUserMutation = useMutation({
    mutationFn: createSuperAdminUser,
    onSuccess: () => {
      toast.success("Tenant user created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenant-details", id] }); // Refetch data
    },
    onError: () => {
      toast.error("Failed to create tenant user");
    },
  });

  const handleCreateTenantAdmin = async (values: any) => {
    createUserMutation.mutate(values);
  };

  if (isLoading) return <Spin />;
  if (isError || !data?.tenant) return <div>Tenant not found</div>;

  const { tenant, users } = data;
  const isActive = tenant.status === "ACTIVE";

  const detailsData = [
    { key: "1", label: "Email", value: tenant.email },
    { key: "2", label: "Phone", value: tenant.phone },
    { key: "3", label: "Address", value: tenant.address },
    {
      key: "4",
      label: "Status",
      value: (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
  ];

  const columns = [
    {
      title: "Field",
      dataIndex: "label",
      key: "label",
      width: "30%",
      className: styles.labelColumn,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      className: styles.valueColumn,
    },
  ];

  return (
    <div className={styles.container}>
      <Row align="middle" gutter={16} className={styles.headerRow}>
        <Col>
          <img src={tenant.logoUrl} alt="logo" className={styles.logo} />
        </Col>
        <Col>
          <Typography.Title level={3} className={styles.name}>
            {tenant.name}
          </Typography.Title>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={detailsData}
        pagination={false}
        bordered
        className={styles.detailsTable}
        showHeader={false}
      />

      <Row justify="end">
        <Button
          type="primary"
          style={{ marginTop: "24px" }}
          onClick={() => setUserModalOpen(true)}
        >
          Create Tenant Users
        </Button>
      </Row>

      <Typography.Title level={4} style={{ marginTop: "32px" }}>
        Tenant Users
      </Typography.Title>

      <Table
        rowKey="id"
        columns={[
          { title: "Full Name", dataIndex: "fullName" },
          { title: "Email", dataIndex: "email" },
          { title: "Phone", dataIndex: "phone" },
          { title: "Role", dataIndex: "role" },
        ]}
        dataSource={users}
        pagination={false}
        bordered
        style={{ marginTop: "16px" }}
      />

      <TenantSuperAdminUserFormModal
        open={isUserModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSubmit={handleCreateTenantAdmin}
        tenantId={tenant.id}
      />
    </div>
  );
};
