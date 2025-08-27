import { Modal, Form, Input, Select, Button, InputNumber } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";

interface OrderFormValues {
  customerName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  total: number;
}

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OrderFormValues) => void;
  isEdit?: boolean;
  initialValues?: OrderFormValues;
}

const OrderSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer name is required"),
  status: Yup.string().required("Status is required"),
  total: Yup.number()
    .required("Total is required")
    .positive("Must be a positive number"),
});

export const OrderModal = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  initialValues,
}: OrderModalProps) => {
  const defaultValues: OrderFormValues = initialValues || {
    customerName: "",
    status: "PENDING",
    total: 0,
  };

  return (
    <Modal
      title={isEdit ? "Edit Order" : "Create New Order"}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={OrderSchema}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
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
            {/* Customer Name */}
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

            {/* Status */}
            <Form.Item
              label="Order Status"
              validateStatus={touched.status && errors.status ? "error" : ""}
              help={touched.status && errors.status}
            >
              <Select
                value={values.status}
                onChange={(val) => setFieldValue("status", val)}
              >
                <Select.Option value="PENDING">Pending</Select.Option>
                <Select.Option value="PROCESSING">Processing</Select.Option>
                <Select.Option value="COMPLETED">Completed</Select.Option>
                <Select.Option value="CANCELLED">Cancelled</Select.Option>
              </Select>
            </Form.Item>

            {/* Total */}
            <Form.Item
              label="Order Total"
              validateStatus={touched.total && errors.total ? "error" : ""}
              help={touched.total && errors.total}
            >
              <InputNumber
                name="total"
                value={values.total}
                onChange={(val) => setFieldValue("total", val)}
                placeholder="Enter total amount"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              {isEdit ? "Update Order" : "Create Order"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
