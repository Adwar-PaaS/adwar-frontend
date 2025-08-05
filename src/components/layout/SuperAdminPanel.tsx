import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './SuperAdminPanel.module.css'

const { Sider, Content } = Layout

export const SuperAdminPanel = () => {
  const location = useLocation()
  const selectedKey = location.pathname.split('/').pop() || ''

  const menuItems = [
    {
      key: 'tenants',
      label: <Link to="/superadmin/tenants">Tenants</Link>,
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider className={styles.sidebar} width={200}>
        <div className={styles.logo}>Super Admin</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
