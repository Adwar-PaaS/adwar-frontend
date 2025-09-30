import React from "react";
import { Table, Typography, Tag } from "antd";

const { Text } = Typography;

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  weight: string;
  isFragile: boolean;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  total: string;
  product: Product;
}

interface OrderItemsTableProps {
  items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  const columns = [
    {
      title: "SKU",
      dataIndex: ["product", "sku"],
      key: "sku",
    },
    {
      title: "Product Name",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Description",
      dataIndex: ["product", "description"],
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: string) => <Text>{Number(price).toLocaleString()} EGP</Text>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: string) => <Text strong>{Number(total).toLocaleString()} EGP</Text>,
    },
    {
      title: "Weight",
      dataIndex: ["product", "weight"],
      key: "weight",
      render: (weight: string) => `${weight} g`,
    },
    {
      title: "Fragile",
      dataIndex: ["product", "isFragile"],
      key: "isFragile",
      render: (fragile: boolean) =>
        fragile ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>,
    },
  ];

  return (
    <div className="mt-4">
      <Typography.Title level={4}>Order Items</Typography.Title>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default OrderItemsTable;
