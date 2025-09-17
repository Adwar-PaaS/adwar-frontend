import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  TruckOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../../styles/CustomerPanel.module.css";
import { useAppSelector } from "../../store/hooks";
import { handleLogout } from "../../utils/logout";
import { useCurrentUser } from "../auth/useCurrentUser";

const { Sider, Content } = Layout;

export const CustomerPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { data: currentUserData } = useCurrentUser();


  const tenantSlug =
    currentUserData?.data?.data?.user?.tenant?.slug;

  const basePath = `/tenant/${tenantSlug}/customer/dashboard`;

  const menuItems = [
    {
      key: `${basePath}`,
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: `${basePath}/orders`,
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
      key: `${basePath}/shipments`,
      icon: <TruckOutlined />,
      label: "Shipments",
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
          Welcome
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
