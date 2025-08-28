import { useEffect, useState } from "react";
import { Modal, Select, Form, Button, Spin, message } from "antd";
import { fetchWarehouseDrivers, updateOrder } from "../../auth/api/tenantApi";

interface AssignDriverModalProps {
  open: boolean;
  onClose: () => void;
  warehouseId: string;
  orderId: string;
  currentStatus: string;
  onSuccess: () => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  open,
  onClose,
  warehouseId,
  orderId,
  currentStatus,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchWarehouseDrivers(warehouseId)
      .then((res) => {
        setDrivers(res.data?.data?.drivers || []);
      })
      .catch(() => {
        message.error("Failed to load drivers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, warehouseId]);

  const handleSubmit = async () => {
    if (!selectedDriver) {
      message.warning("Please select a driver");
      return;
    }

    try {
      setLoading(true);
      await updateOrder(orderId, {
        status: currentStatus,
        driverId: selectedDriver,
      });

      message.success("Driver assigned successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Failed to assign driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Assign Driver"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Spin />
        </div>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Select Driver" required>
            <Select
              placeholder="Choose driver"
              value={selectedDriver}
              onChange={(value) => setSelectedDriver(value)}
            >
              {drivers.map((d) => (
                <Select.Option key={d.user?.id} value={d.user?.id}>
                   {d.user?.fullName || d.user?.email}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Assign
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};
