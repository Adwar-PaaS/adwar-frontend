import { UserInfoCard } from "../components/UserInfoCard";
import { StatisticCard } from "../components/StatisticCard";
import { PieChartCard } from "../components/PieChartCard";

export const CustomerDashboard = () => {
  const pieData = [
    { name: "Created", value: 4 },
    { name: "Pending", value: 3 },
    { name: "Completed", value: 5 },
    { name: "Cancelled", value: 2 },
  ];

  return (
    <div>
      <UserInfoCard />
      <PieChartCard data={pieData} />
      <StatisticCard showChart />
    </div>
  );
};
