import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./PieChartCard.module.css";

interface PieChartCardProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export const PieChartCard = ({ data, colors = DEFAULT_COLORS }: PieChartCardProps) => {
  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>Orders Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
