import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../../styles/TenantAdminPanel.module.css";
import { useAppSelector } from "../../store/hooks";
import { handleLogout } from "../../utils/logout";

const { Sider, Content } = Layout;

export const OperationsPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantSlug } = useParams();
  const { user } = useAppSelector((state) => state.auth);

  const basePath = `/tenant/${tenantSlug}/operation`;

  const menuItems = [
    {
      key: `${basePath}/dashboard`,
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: `${basePath}/tasks`,
      icon: <ShoppingCartOutlined />,
      label: "Tasks",
    },
    {
      key: `${basePath}/reports`,
      icon: <DatabaseOutlined />,
      label: "Reports",
    },
    {
      key: `${basePath}/users`,
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "logout",
      icon: (
        <span className={styles.logoutIcon}>
          <LogoutOutlined />
        </span>
      ),
      label: <span className={styles.logoutText}>Logout</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className={styles.sidebar} width={200}>
        <div className={styles.logo}>
          Operations
          {user && (
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
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
              handleLogout();
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
