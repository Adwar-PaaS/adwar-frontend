import { Badge, Dropdown, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { usePickupNotifications } from "../../auth/hooks/usePickupNotifications";
import { useNavigate, useParams } from "react-router-dom";

export const NotificationsBell = () => {
  const { notifications, clearNotifications } = usePickupNotifications();
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  const menu = (
    <div style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/tenant/${tenantSlug}/operation/pickups/${item.pickupId}`)}
          >
            <div>
              <b>Pickup #{item.pickupId}</b>  
              <br />
              <small>Requested By: {item.requestedBy}</small>
            </div>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "center", padding: "8px" }}>
        <Button size="small" onClick={clearNotifications}>
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Badge count={notifications.length} offset={[0, 10]}>
        <BellOutlined style={{ fontSize: 22, cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};
