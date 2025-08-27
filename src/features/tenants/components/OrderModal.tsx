import { Modal, Form, Input, Select, Button, InputNumber, Spin } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTenantWarehouses, createOrder } from "../../auth/api/tenantApi";
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
  onSubmit?: (values: OrderFormValues) => void;
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

export const OrderModal = ({ open, onClose, tenantId, onSubmit }: OrderModalProps) => {
  const defaultValues: OrderFormValues = {
    sku: "",
    quantity: 1,
    warehouseId: "",
    deliveryLocation: "",
    merchantLocation: "",
    description: "",
    customerName: "",
    customerPhone: "",
  };

  const { data: warehouseData, isLoading: warehouseLoading } = useQuery({
    queryKey: ["tenantWarehouses", tenantId],
    queryFn: () => fetchTenantWarehouses(tenantId),
    enabled: !!tenantId,
  });

  const warehouses: Warehouse[] = warehouseData?.data?.data?.warehouses || [];

  const { mutate: createOrderMutation, isPending: creating } = useMutation({
    mutationFn: createOrder,
    onSuccess: (_, values) => {
      toast.success("Order created successfully!");
      if (onSubmit) onSubmit(values as OrderFormValues); 
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create order");
    },
  });

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
        initialValues={defaultValues}
        validationSchema={OrderSchema}
        onSubmit={(values) => {
          createOrderMutation(values);
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
          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="SKU"
              validateStatus={touched.sku && errors.sku ? "error" : ""}
              help={touched.sku && errors.sku}
            >
              <Input
                name="sku"
                value={values.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
              />
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
                placeholder="Enter quantity"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Warehouse"
              validateStatus={
                touched.warehouseId && errors.warehouseId ? "error" : ""
              }
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

            <Form.Item
              label="Delivery Location"
              validateStatus={
                touched.deliveryLocation && errors.deliveryLocation
                  ? "error"
                  : ""
              }
              help={touched.deliveryLocation && errors.deliveryLocation}
            >
              <Input
                name="deliveryLocation"
                value={values.deliveryLocation}
                onChange={handleChange}
                placeholder="Enter delivery location"
              />
            </Form.Item>

            <Form.Item
              label="Merchant Location"
              validateStatus={
                touched.merchantLocation && errors.merchantLocation
                  ? "error"
                  : ""
              }
              help={touched.merchantLocation && errors.merchantLocation}
            >
              <Input
                name="merchantLocation"
                value={values.merchantLocation}
                onChange={handleChange}
                placeholder="Enter merchant location"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              validateStatus={
                touched.description && errors.description ? "error" : ""
              }
              help={touched.description && errors.description}
            >
              <Input.TextArea
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Item>

            <Form.Item
              label="Customer Name"
              validateStatus={
                touched.customerName && errors.customerName ? "error" : ""
              }
              help={touched.customerName && errors.customerName}
            >
              <Input
                name="customerName"
                value={values.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </Form.Item>

            <Form.Item
              label="Customer Phone"
              validateStatus={
                touched.customerPhone && errors.customerPhone ? "error" : ""
              }
              help={touched.customerPhone && errors.customerPhone}
            >
              <Input
                name="customerPhone"
                value={values.customerPhone}
                onChange={handleChange}
                placeholder="Enter customer phone"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={creating}>
              {creating ? "Creating..." : "Create Order"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
