import { Modal, Select, Button, Form } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateOrderStatus } from "../../auth/api/tenantApi";
import { toast } from "react-toastify";

const statuses = [
  "PENDING",
  "APPROVED",
  "ASSIGNED_FOR_PICKUP",
  "PICKED_UP",
  "RECEIVED_IN_WAREHOUSE",
  "STORED_ON_SHELVES",
  "READY_FOR_DISPATCH",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "RESCHEDULED",
  "CANCELLED",
  "RETURNED_TO_OPERATION",
  "READY_TO_RETURN_TO_ORIGIN",
  "RETURNED_TO_ORIGIN",
];

const failedReasons = [
  "NO_ANSWER",
  "OUT_OF_COVERAGE_AREA",
  "MOBILE_SWITCHED_OFF",
  "CONSIGNEE_NOT_AVAILABLE_IN_LOCATION",
];

export const UpdateStatusModal = ({
  open,
  onClose,
  orderId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  onSuccess: () => void;
}) => {
  const [status, setStatus] = useState<string>("");
  const [failedReason, setFailedReason] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Order status updated!");
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleSubmit = () => {
    if (!orderId || !status) return;
    mutate({ orderId, status, failedReason: status === "FAILED" ? failedReason : undefined });
  };

  return (
    <Modal title="Update Order Status" open={open} onCancel={onClose} footer={null}>
      <Form layout="vertical">
        <Form.Item label="Status">
          <Select
            value={status}
            onChange={(val) => setStatus(val)}
            placeholder="Select status"
          >
            {statuses.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {status === "FAILED" && (
          <Form.Item label="Failed Reason">
            <Select
              value={failedReason}
              onChange={(val) => setFailedReason(val)}
              placeholder="Select failed reason"
            >
              {failedReasons.map((r) => (
                <Select.Option key={r} value={r}>
                  {r}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Button type="primary" block loading={isPending} onClick={handleSubmit}>
          Update
        </Button>
      </Form>
    </Modal>
  );
};
