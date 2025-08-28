import { useEffect, useState } from "react";
import { Modal, Select, Form, Button, Spin, message } from "antd";
import { fetchTenantWarehouses, updateOrder } from "../../auth/api/tenantApi";

interface AssignWarehouseModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  orderId: string;
  currentStatus: string;
  onSuccess: () => void; 
}

export const AssignWarehouseModal: React.FC<AssignWarehouseModalProps> = ({
  open,
  onClose,
  tenantId,
  orderId,
  currentStatus,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchTenantWarehouses(tenantId)
    .then((res) => {
        setWarehouses(res.data?.data?.warehouses || []);
      })
      .catch(() => {
        message.error("Failed to load warehouses");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, tenantId]);

  const handleSubmit = async () => {
    if (!selectedWarehouse) {
      message.warning("Please select a warehouse");
      return;
    }

    try {
      setLoading(true);
      await updateOrder(orderId, {
        status: currentStatus,
        warehouseId: selectedWarehouse,
      });

      message.success("Warehouse assigned successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Failed to assign warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Assign Warehouse"
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Spin />
        </div>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Select Warehouse" required>
            <Select
              placeholder="Choose warehouse"
              value={selectedWarehouse}
              onChange={(value) => setSelectedWarehouse(value)}
            >
              {warehouses.map((w) => (
                <Select.Option key={w.id} value={w.id}>
                  {w.name}
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
