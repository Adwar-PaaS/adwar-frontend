import { Modal, Form, Input, Button, InputNumber, DatePicker, Select } from "antd";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { createOrder, updateOrder } from "../../auth/api/tenantApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

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
  items: OrderItem[];
}

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  order?: { id: string } & OrderFormValues;
}

const OrderSchema = Yup.object().shape({
  orderNumber: Yup.string().required("Order number is required"),
  specialInstructions: Yup.string().required("Special instructions required"),
  priority: Yup.string().oneOf(["LOW", "MEDIUM", "HIGH"]).required(),
  estimatedDelivery: Yup.string().required("Estimated delivery is required"),
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

export const OrderModal = ({ open, onClose, onSubmit, order }: OrderModalProps) => {
  const defaultValues: OrderFormValues = {
    orderNumber: order?.orderNumber || "ORD-",
    specialInstructions: order?.specialInstructions || "",
    priority: order?.priority || "MEDIUM",
    estimatedDelivery: order?.estimatedDelivery || "",
    items: order?.items || [
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
      if (onSubmit) onSubmit();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create order");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderFormValues }) =>
      updateOrder(id, data),
    onSuccess: () => {
      toast.success("Order updated successfully!");
      if (onSubmit) onSubmit();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update order");
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={order ? "Edit Order" : "Create New Order"}
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
          if (order) {
            updateMutation.mutate({ id: order.id, data: values });
          } else {
            createMutation.mutate(values);
          }
        }}
      >
        {({ values, handleChange, handleSubmit, touched, errors, setFieldValue }) => (
          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item label="Order Number" help={touched.orderNumber && errors.orderNumber}>
              <Input name="orderNumber" value={values.orderNumber} onChange={handleChange} />
            </Form.Item>

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

            <Form.Item
              label="Estimated Delivery"
              help={touched.estimatedDelivery && errors.estimatedDelivery}
            >
              <DatePicker
                showTime
                value={values.estimatedDelivery ? dayjs(values.estimatedDelivery) : null}
                onChange={(val) => setFieldValue("estimatedDelivery", val?.toISOString() || "")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <FieldArray name="items">
              {({ push, remove }) => (
                <>
                  {values.items.map((item, idx) => (
                    <div key={idx} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
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
                          onChange={(val) => setFieldValue(`items[${idx}].weight`, val)}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Quantity">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(val) => setFieldValue(`items[${idx}].quantity`, val)}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Unit Price">
                        <InputNumber
                          min={0}
                          value={item.unitPrice}
                          onChange={(val) => setFieldValue(`items[${idx}].unitPrice`, val)}
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

                  <Button type="dashed" onClick={() => push({ sku: "", name: "", description: "", weight: 0, quantity: 1, unitPrice: 0 })} block>
                    + Add Item
                  </Button>
                </>
              )}
            </FieldArray>

            <Button type="primary" htmlType="submit" block loading={loading}>
              {order ? "Update Order" : "Create Order"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
