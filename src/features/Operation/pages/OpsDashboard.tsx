import { Row, Col } from "antd";
import { PickupsStatusChart } from "../components/PickupsStatusChart";
import { ApprovedVsPendingChart } from "../components/ApprovedVsPendingChart";

export const OpsDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <PickupsStatusChart />
        </Col>
        <Col xs={24} md={12}>
          <ApprovedVsPendingChart />
        </Col>
      </Row>
    </div>
  );
};
