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
import { createOrder } from "../../auth/api/tenantApi";
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
        sku: Yup.string().required("SKU required"),
        name: Yup.string().required("Name required"),
        description: Yup.string().required("Description required"),
        weight: Yup.number().positive().required("Weight required"),
        quantity: Yup.number().positive().required("Quantity required"),
        unitPrice: Yup.number().positive().required("Unit price required"),
      })
    )
    .min(1, "At least one item is required"),
});

interface OrderItem {
  sku: string;
  name: string;
  description: string;
  weight: number;
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
  items: OrderItem[];
}

interface CustomerCreateOrderProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const CustomerCreateOrder = ({
  open,
  onClose,
  onSubmit,
}: CustomerCreateOrderProps) => {
  const queryClient = useQueryClient();

  const defaultValues: OrderFormValues = {
    orderNumber: "ORD-",
    specialInstructions: "",
    priority: "MEDIUM",
    estimatedDelivery: "",
    status: "PENDING",
    failedReason: undefined,
    items: [
      {
        sku: "PROD-",
        name: "",
        description: "",
        weight: 0,
        quantity: 1,
        unitPrice: 0,
      },
    ],
  };

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order created successfully!");
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
      if (onSubmit) onSubmit();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create order");
    },
  });

  const loading = createMutation.isPending;

  return (
    <Modal
      title="Create New Order"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
    >
      <Formik
        enableReinitialize
        initialValues={defaultValues}
        validationSchema={OrderSchema}
        onSubmit={(values) => {
          const payload = {
            ...values,
            failedReason:
              values.status === "FAILED" ? values.failedReason : undefined,
          };
          createMutation.mutate(payload);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          touched,
          errors,
          setFieldValue,
        }) => (
          <Form
            layout="vertical"
            onSubmitCapture={handleSubmit}
            autoComplete="off"
          >
            {/* Order Number */}
            <Form.Item
              label="Order Number"
              help={touched.orderNumber && errors.orderNumber}
            >
              <Input
                name="orderNumber"
                value={values.orderNumber}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Special Instructions */}
            <Form.Item
              label="Special Instructions"
              help={touched.specialInstructions && errors.specialInstructions}
            >
              <Input.TextArea
                name="specialInstructions"
                value={values.specialInstructions}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Priority */}
            <Form.Item label="Priority" help={touched.priority && errors.priority}>
              <Select
                value={values.priority}
                onChange={(val) => setFieldValue("priority", val)}
              >
                <Select.Option value="LOW">Low</Select.Option>
                <Select.Option value="MEDIUM">Medium</Select.Option>
                <Select.Option value="HIGH">High</Select.Option>
              </Select>
            </Form.Item>

            {/* Estimated Delivery */}
            <Form.Item
              label="Estimated Delivery"
              help={touched.estimatedDelivery && errors.estimatedDelivery}
            >
              <DatePicker
                showTime
                value={
                  values.estimatedDelivery ? dayjs(values.estimatedDelivery) : null
                }
                onChange={(val) =>
                  setFieldValue("estimatedDelivery", val?.toISOString() || "")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Items */}
            <FieldArray name="items">
              {({ push, remove }) => (
                <>
                  {values.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #ddd",
                        padding: 12,
                        marginBottom: 12,
                      }}
                    >
                      <Form.Item label="SKU">
                        <Input
                          name={`items[${idx}].sku`}
                          value={item.sku}
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item label="Name">
                        <Input
                          name={`items[${idx}].name`}
                          value={item.name}
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item label="Description">
                        <Input
                          name={`items[${idx}].description`}
                          value={item.description}
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item label="Weight">
                        <InputNumber
                          min={0}
                          value={item.weight}
                          onChange={(val) =>
                            setFieldValue(`items[${idx}].weight`, val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Quantity">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(val) =>
                            setFieldValue(`items[${idx}].quantity`, val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Unit Price">
                        <InputNumber
                          min={0}
                          value={item.unitPrice}
                          onChange={(val) =>
                            setFieldValue(`items[${idx}].unitPrice`, val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      {values.items.length > 1 && (
                        <Button danger onClick={() => remove(idx)} block>
                          Remove Item
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() =>
                      push({
                        sku: "PROD-",
                        name: "",
                        description: "",
                        weight: 0,
                        quantity: 1,
                        unitPrice: 0,
                      })
                    }
                    block
                  >
                    + Add Item
                  </Button>
                </>
              )}
            </FieldArray>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Create Order
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
