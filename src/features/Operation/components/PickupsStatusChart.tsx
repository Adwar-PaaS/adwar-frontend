import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPickups } from "../../auth/api/operationApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography } from "antd";

const COLORS = [
  "#FFBB28",
  "#00C49F",
  "#FF8042",
  "#0088FE",
  "#FF00FF",
  "#00FFFF",
];

export const PickupsStatusChart = () => {
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });

  const pickups = data?.data?.pickups || [];

  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {};
    pickups.forEach((p: any) => {
      stats[p.status] = (stats[p.status] || 0) + 1;
    });
    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  }, [pickups]);

  if (isLoading)
    return <Typography.Text>Loading pickups stats...</Typography.Text>;

  return (
    <Card title="Pickups by Status">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={statusStats}
            dataKey="count"
            nameKey="status"
            outerRadius={100}
            label
          >
            {statusStats.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
