import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenantById } from "../../auth/api/tenantApi";
import { Button, Col, Tag, Row, Spin, Table, Typography } from "antd";
import styles from "./TenantDetails.module.css";
import { TenantUserFormModal } from "../components/TenantUserFormModal";

export const TenantDetails = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userModalOpen, setUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await getTenantById(id!);
        setTenant(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTenant();
  }, [id]);

  if (loading) return <Spin />;
  if (!tenant) return <div>Tenant not found</div>;

  const isActive = tenant.status === "Activate";

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
          Create Tenant Admin
        </Button>
      </Row>

      <TenantUserFormModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};
