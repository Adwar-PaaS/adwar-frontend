import { Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import styles from "../../styles/TenantAdminPanel.module.css";
import { useAppSelector } from "../../store/hooks";
import { handleLogout } from "../../utils/logout";
import { NotificationsBell } from "../../features/Operation/components/NotificationsBell";

const { Sider, Content, Header } = Layout;

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
      key: `${basePath}/pickups`,
      icon: <TruckOutlined />,
      label: "Pickups",
    },
    {
      key: `${basePath}/approved-pickups`,
      icon: <CheckCircleOutlined />,
      label: "Approved Pickups",
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
        <div className={styles.logo}>Operations</div>
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
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            paddingRight: 20,
          }}
        >
          {user && (
            <Typography.Text style={{ fontSize: 20 }}>
              Welcome back,
              {user.fullName}!
            </Typography.Text>
          )}
          <NotificationsBell />
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
