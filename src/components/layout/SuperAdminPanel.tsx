import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logout";
import { LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import styles from "./SuperAdminPanel.module.css";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

const { Sider, Content } = Layout;

export const SuperAdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/superadmin/tenants",
      label: <Link to="/superadmin/tenants">Tenants</Link>,
    },
    {
      key: "logout",
      icon: <span className={styles.logoutIcon}><LogoutOutlined /></span>,
      label: <span className={styles.logoutText}>Logout</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className={styles.sidebar} width={200}>
        <div className={styles.logo}>
          Super Admin
          {user && (
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
              {user.fullName}
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className={styles.menu}
          onClick={({ key }) => {
            if (key === "logout") {
              logout();
            } else {
              navigate(key);
            }
          }}
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
