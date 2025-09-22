import OrdersByBranchChart from "../components/OrdersByBranchChart";
import OrdersByStatusChart from "../components/OrdersByStatusChart";

const TenantDashboard = () => {
  return (
    <div className="p-6 grid gap-6">
      <OrdersByBranchChart />
      <OrdersByStatusChart />
    </div>
  );
};

export default TenantDashboard;
