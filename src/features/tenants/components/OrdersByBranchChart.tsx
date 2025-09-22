import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../../styles/dashboard.module.css";

const data = [
  { branch: "Cairo", orders: 120 },
  { branch: "Alexandria", orders: 95 },
  { branch: "Giza", orders: 80 },
  { branch: "Mansoura", orders: 60 },
];

const OrdersByBranchChart: FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.label}>Orders by Branch</div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersByBranchChart;
