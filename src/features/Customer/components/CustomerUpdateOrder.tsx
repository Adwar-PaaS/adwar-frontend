import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../../auth/api/tenantApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED_FOR_PICKUP"
  | "PICKED_UP"
  | "RECEIVED_IN_WAREHOUSE"
  | "STORED_ON_SHELVES"
  | "READY_FOR_DISPATCH"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "RETURNED_TO_OPERATION"
  | "READY_TO_RETURN_TO_ORIGIN"
  | "RETURNED_TO_ORIGIN";

export type FailedReason =
  | "CUSTOMER_NOT_AVAILABLE"
  | "WRONG_ADDRESS"
  | "NO_ANSWER"
  | "DAMAGED_PACKAGE"
  | "OUT_OF_COVERAGE_AREA"
  | "MOBILE_SWITCHED_OFF"
  | "CUSTOMER_REFUSED"
  | "INCOMPLETE_ADDRESS"
  | "SECURITY_ISSUE"
  | "WEATHER_CONDITIONS"
  | "VEHICLE_BREAKDOWN"
  | "TRAFFIC_CONGESTION"
  | "OTHER";

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
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

const FAILED_REASON_OPTIONS: FailedReason[] = [
  "CUSTOMER_NOT_AVAILABLE",
  "WRONG_ADDRESS",
  "NO_ANSWER",
  "DAMAGED_PACKAGE",
  "OUT_OF_COVERAGE_AREA",
  "MOBILE_SWITCHED_OFF",
  "CUSTOMER_REFUSED",
  "INCOMPLETE_ADDRESS",
  "SECURITY_ISSUE",
  "WEATHER_CONDITIONS",
  "VEHICLE_BREAKDOWN",
  "TRAFFIC_CONGESTION",
  "OTHER",
];

const OrderSchema = Yup.object().shape({
  orderNumber: Yup.string().required("Order number is required"),
  specialInstructions: Yup.string().required("Special instructions required"),
  priority: Yup.string().oneOf(["LOW", "MEDIUM", "HIGH"]).required(),
  estimatedDelivery: Yup.string().required("Estimated delivery is required"),
  status: Yup.string()
    .oneOf(ORDER_STATUS_OPTIONS)
    .required("Status is required"),
  failedReason: Yup.string().when("status", {
    is: "FAILED",
    then: (schema) =>
      schema.oneOf(FAILED_REASON_OPTIONS).required("Failed reason is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  items: Yup.array()
    .of(
      Yup.object().shape({
        sku: Yup.string().notRequired(),
        quantity: Yup.number().positive(),
        unitPrice: Yup.number().positive(),
      })
    )
    .notRequired(),
});

interface OrderItem {
  sku?: string;
  quantity: number;
  unitPrice: number;
}

interface OrderFormValues {
  orderNumber: string;
  specialInstructions: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedDelivery: string;
  status: OrderStatus;
  failedReason?: FailedReason;
  items?: OrderItem[];
}

interface CustomerUpdateOrderProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  order: { id: string } & OrderFormValues;
}

export const CustomerUpdateOrder: React.FC<CustomerUpdateOrderProps> = ({
  open,
  onClose,
  onSubmit,
  order,
}) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string } & OrderFormValues) => {
      const updatePayload: any = {
        orderNumber: payload.orderNumber,
        specialInstructions: payload.specialInstructions,
        priority: payload.priority,
        estimatedDelivery: payload.estimatedDelivery,
        status: payload.status,
      };

      if (payload.status === "FAILED") {
        updatePayload.failedReason = payload.failedReason;
      }

      if (payload.items && payload.items.length > 0) {
        updatePayload.items = payload.items.map((item) => ({
          ...(item.sku ? { sku: item.sku } : {}),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));
      }

      return updateOrder(payload.id, updatePayload);
    },
    onSuccess: () => {
      toast.success("Order updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
      onSubmit?.();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update order");
    },
  });

  return (
    <Modal
      open={open}
      title="Update Order"
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Formik
        initialValues={order}
        validationSchema={OrderSchema}
        onSubmit={(values) => {
          updateMutation.mutate(values);
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Order Number" validateStatus={errors.orderNumber ? "error" : ""} help={errors.orderNumber}>
              <Input name="orderNumber" value={values.orderNumber} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Special Instructions" validateStatus={errors.specialInstructions ? "error" : ""} help={errors.specialInstructions}>
              <Input.TextArea name="specialInstructions" value={values.specialInstructions} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Priority" validateStatus={errors.priority ? "error" : ""} help={errors.priority}>
              <Select value={values.priority} onChange={(val) => {
                // Use Formik's setFieldValue to update the value
                // @ts-ignore
                values.priority = val;
                handleChange({ target: { name: "priority", value: val } });
              }}>
                {["LOW", "MEDIUM", "HIGH"].map((p) => (
                  <Select.Option key={p} value={p}>{p}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Estimated Delivery" validateStatus={errors.estimatedDelivery ? "error" : ""} help={errors.estimatedDelivery}>
              <DatePicker
                showTime
                value={values.estimatedDelivery ? dayjs(values.estimatedDelivery) : null}
                onChange={(date) => handleChange({ target: { name: "estimatedDelivery", value: date?.toISOString() } })}
              />
            </Form.Item>

            <Form.Item label="Status" validateStatus={errors.status ? "error" : ""} help={errors.status}>
              <Select
                value={values.status}
                onChange={(val) => {
                  // Use Formik's setFieldValue to update the value
                  // @ts-ignore
                  values.status = val;
                  handleChange({ target: { name: "status", value: val } });
                }}
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <Select.Option key={status} value={status}>{status}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            {values.status === "FAILED" && (
              <Form.Item label="Failed Reason" validateStatus={errors.failedReason ? "error" : ""} help={errors.failedReason}>
                <Select value={values.failedReason} onChange={(val) => {
                  // Use Formik's setFieldValue to update the value
                  // @ts-ignore
                  values.failedReason = val;
                  handleChange({ target: { name: "failedReason", value: val } });
                }}>
                  {FAILED_REASON_OPTIONS.map((reason) => (
                    <Select.Option key={reason} value={reason}>{reason.replace(/_/g, " ")}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <FieldArray name="items">
              {({  }) => (
                <>
                  {values.items && values.items.length > 0 && values.items.map((item, index) => (
                    <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <Input placeholder="SKU" name={`items.${index}.sku`} value={item.sku} onChange={handleChange} />
                      <InputNumber placeholder="Quantity" name={`items.${index}.quantity`} value={item.quantity} onChange={(val) => handleChange({ target: { name: `items.${index}.quantity`, value: val } })} />
                      <InputNumber placeholder="Unit Price" name={`items.${index}.unitPrice`} value={item.unitPrice} onChange={(val) => handleChange({ target: { name: `items.${index}.unitPrice`, value: val } })} />
                    </div>
                  ))}
                </>
              )}
            </FieldArray>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Update Order
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
