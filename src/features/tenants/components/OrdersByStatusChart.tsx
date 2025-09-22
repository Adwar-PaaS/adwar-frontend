import type { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../../styles/dashboard.module.css";

const data = [
  { name: "Pending", value: 45 },
  { name: "Shipped", value: 85 },
  { name: "Delivered", value: 150 },
  { name: "Failed", value: 20 },
];

const COLORS = ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"];

const OrdersByStatusChart: FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.label}>Orders by Status</div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {data.map((__, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersByStatusChart;
