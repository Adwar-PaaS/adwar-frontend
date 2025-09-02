import { Modal, Form, Input, Select, Button, InputNumber, Spin } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTenantWarehouses, createOrder, updateOrder } from "../../auth/api/tenantApi";
import { toast } from "react-toastify";

interface Warehouse {
  id: string;
  name: string;
  location?: string;
}

interface OrderFormValues {
  sku: string;
  quantity: number;
  warehouseId: string;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
}

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  onSubmit?: () => void;
  order?: { id: string } & OrderFormValues;
}

const OrderSchema = Yup.object().shape({
  sku: Yup.string().required("SKU is required"),
  quantity: Yup.number().required("Quantity is required").positive(),
  warehouseId: Yup.string().required("Warehouse is required"),
  deliveryLocation: Yup.string().required("Delivery location is required"),
  merchantLocation: Yup.string().required("Merchant location is required"),
  description: Yup.string().required("Description is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export const OrderModal = ({ open, onClose, tenantId, onSubmit, order }: OrderModalProps) => {
  const defaultValues: OrderFormValues = {
    sku: order?.sku || "",
    quantity: order?.quantity || 1,
    warehouseId: order?.warehouseId || "",
    deliveryLocation: order?.deliveryLocation || "",
    merchantLocation: order?.merchantLocation || "",
    description: order?.description || "",
    customerName: order?.customerName || "",
    customerPhone: order?.customerPhone || "",
  };

  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ["tenantWarehouses", tenantId],
    queryFn: () => fetchTenantWarehouses(tenantId),
    enabled: !!tenantId,
  });

  const warehouses: Warehouse[] = warehouseData?.data?.data?.warehouses || [];

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
      destroyOnHidden
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
            <Form.Item
              label="SKU"
              validateStatus={touched.sku && errors.sku ? "error" : ""}
              help={touched.sku && errors.sku}
            >
              <Input name="sku" value={values.sku} onChange={handleChange} />
            </Form.Item>

            <Form.Item
              label="Quantity"
              validateStatus={touched.quantity && errors.quantity ? "error" : ""}
              help={touched.quantity && errors.quantity}
            >
              <InputNumber
                min={1}
                value={values.quantity}
                onChange={(val) => setFieldValue("quantity", val)}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Warehouse"
              validateStatus={touched.warehouseId && errors.warehouseId ? "error" : ""}
              help={touched.warehouseId && errors.warehouseId}
            >
              {warehouseLoading ? (
                <Spin />
              ) : (
                <Select
                  placeholder="Select warehouse"
                  value={values.warehouseId}
                  onChange={(val) => setFieldValue("warehouseId", val)}
                >
                  {warehouses.map((wh) => (
                    <Select.Option key={wh.id} value={wh.id}>
                      {wh.name} {wh.location && `- ${wh.location}`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Delivery Location">
              <Input
                name="deliveryLocation"
                value={values.deliveryLocation}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Merchant Location">
              <Input
                name="merchantLocation"
                value={values.merchantLocation}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Customer Name">
              <Input
                name="customerName"
                value={values.customerName}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Customer Phone">
              <Input
                name="customerPhone"
                value={values.customerPhone}
                onChange={handleChange}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              {order ? "Update Order" : "Create Order"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
