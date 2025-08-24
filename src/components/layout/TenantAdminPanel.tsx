import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import styles from "./TenantAdminPanel.module.css";
import { useAppSelector } from "../../store/hooks";
import { handleLogout } from "../../utils/logout";

const { Sider, Content } = Layout;

export const TenantAdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantSlug } = useParams();
  const { user } = useAppSelector((state) => state.auth);

  const basePath = `/tenant/${tenantSlug}/admin`;

  const menuItems = [
    {
      key: `${basePath}/dashboard`,
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
       key: `${basePath}/orders`,
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
     key: `${basePath}/warehouses`,
      icon: <DatabaseOutlined />,
      label: "Warehouses",
    },
    {
      key: `${basePath}/users`,
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: `${basePath}/roles`,
      icon: <HighlightOutlined />,
      label: "Roles",
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
          Tenant Admin
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
