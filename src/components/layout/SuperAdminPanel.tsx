import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./SuperAdminPanel.module.css";

const { Sider, Content } = Layout;

export const SuperAdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/superadmin/tenants",
      label: <Link to="/superadmin/tenants">Tenants</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className={styles.sidebar} width={200}>
        <div className={styles.logo}>Super Admin</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className={styles.menu}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
