import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenants } from "../../auth/api/tenantApi";
import { Button, Col, Tag, Row, Spin, Table, Typography } from "antd";
import styles from "./TenantDetails.module.css";
import { TenantUserFormModal } from "../components/TenantUserFormModal";

export const TenantDetails = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   const [userModalOpen, setUserModalOpen] = useState(false);
   //   useEffect(() => {
    //     const fetchTenant = async () => {
        //       try {
            //         const response = await getTenants(); // Or a getTenantById endpoint
            //         const found = response.data.data.find((t: any) => t.id === id);
            //         setTenant(found);
            //       } finally {
                //         setLoading(false);
                //       }
                //     };
                //     fetchTenant();
                //   }, [id]);
                
                useEffect(() => {
                    const dummyData = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "01012345678",
        status: "Activate",
        address: "123 Main St, Cairo",
        logoUrl: "/login-illustration.jpeg",
        createdAt: "2025-08-01T10:00:00Z",
        creator: { fullName: "Admin User" }
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "01098765432",
        status: "Deactivate",
        address: "456 Elm St, Giza",
        logoUrl: "/login-illustration.jpeg",
        createdAt: "2025-08-05T14:30:00Z",
        creator: { fullName: "Admin User" }
    }
  ];
  
  const found = dummyData.find((t) => t.id === id);
  setTenant(found);
  setLoading(false);
}, [id]);


if (loading) return <Spin />;

if (!tenant) return <div>Tenant not found</div>;
const isActive = tenant?.status === "Activate";

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

   const handleCreateTenantAdmin = () => {

  };

  return (
 <div className={styles.container}>
      {/* Logo + Name Row */}
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

      {/* Details Table */}
      <Table
        columns={columns}
        dataSource={detailsData}
        pagination={false}
        bordered
        className={styles.detailsTable}
        showHeader={false} // Hide column headers
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
        onSubmit={handleCreateTenantAdmin}
      />
    </div>
  );
};
