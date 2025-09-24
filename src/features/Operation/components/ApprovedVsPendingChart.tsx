import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPickups } from "../../auth/api/operationApi";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography } from "antd";

export const ApprovedVsPendingChart = () => {
  const { data: currentUserData } = useCurrentUser();
  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["pickupsList", tenantId],
    queryFn: () => fetchAllPickups(tenantId!),
    enabled: !!tenantId,
  });

  const pickups = data?.data?.pickups || [];

  const approvedVsPending = useMemo(() => {
    const approved = pickups.filter((p: any) => p.status === "APPROVED").length;
    const pending = pickups.filter((p: any) => p.status === "PENDING").length;
    return [
      { name: "Approved", value: approved },
      { name: "Pending", value: pending },
    ];
  }, [pickups]);

  if (isLoading) return <Typography.Text>Loading pickups stats...</Typography.Text>;

  return (
    <Card title="Approved vs Pending Pickups">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={approvedVsPending}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
