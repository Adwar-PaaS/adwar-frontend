import { Button, Table, Space, Row, Col, Typography } from "antd";
import { useState } from "react";
import { RoleModal } from "../components/RoleModal";
import styles from "./TenantRolesPage.module.css";

interface Role {
  id: string;
  name: string;
}

export const TenantRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleSave = (values: { name: string }) => {
    if (editingRole) {
      // update
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id ? { ...role, ...values } : role
        )
      );
    } else {
      // create
      setRoles((prev) => [
        ...prev,
        { id: Date.now().toString(), ...values },
      ]);
    }
    setModalOpen(false);
    setEditingRole(null);
  };

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
  };

  const columns = [
    { title: "Role Name", dataIndex: "name" },
    
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingRole(record);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row align="middle" justify="space-between" className={styles.headerRow}>
        <Col>
          <Typography.Title level={3} className={styles.name}>
            Roles
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setEditingRole(null);
              setModalOpen(true);
            }}
          >
            Add Role
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={roles}
        bordered
        style={{ marginTop: 16 }}
      />

      <RoleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSave}
        isEdit={!!editingRole}
      />
    </div>
  );
};
