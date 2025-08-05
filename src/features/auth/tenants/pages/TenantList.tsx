import { Table, Tag } from 'antd'
import styles from './TenantList.module.css'

const data = [
  {
    id: 1,
    name: 'Acme Corp',
    email: 'admin@acme.com',
    phone: '+1234567890',
    status: 'active',
  },
  {
    id: 2,
    name: 'Beta Logistics',
    email: 'contact@beta.com',
    phone: '+9876543210',
    status: 'inactive',
  },
  {
    id: 3,
    name: 'Gamma Group',
    email: 'info@gamma.com',
    phone: '+192837465',
    status: 'active',
  },
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    ),
  },
]

export const TenantList = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tenants</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
