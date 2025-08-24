import { Modal, Form, Input, InputNumber, Button } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";


interface WarehouseFormValues {
  name: string;
  location: string;
  capacity: number;
  tenantId?: string;
}

interface WarehouseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: WarehouseFormValues) => void;
  tenantId: string;
  initialValues?: WarehouseFormValues;
  isEdit?: boolean;
}

const WarehouseSchema = Yup.object().shape({
  name: Yup.string().required("Warehouse name is required"),
  location: Yup.string().required("Location is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .positive("Capacity must be positive"),
});

export const WarehouseFormModal = ({
  open,
  onClose,
  onSubmit,
  tenantId,
  initialValues,
  isEdit = false,
}: WarehouseFormModalProps) => {
  const defaultValues: WarehouseFormValues = initialValues || {
    name: "",
    location: "",
    capacity: 0,
  };

  return (
    <Modal
      title={isEdit ? "Edit Warehouse" : "Add Warehouse"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={WarehouseSchema}
         onSubmit={(values) => {
          const payload = { ...values, tenantId };
          onSubmit(payload);
          toast.success(isEdit ? "Warehouse updated" : "Warehouse created");
          onClose();
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="Warehouse Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter warehouse name"
              />
            </Form.Item>

            <Form.Item
              label="Location"
              validateStatus={touched.location && errors.location ? "error" : ""}
              help={touched.location && errors.location}
            >
              <Input
                name="location"
                value={values.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </Form.Item>

            <Form.Item
              label="Capacity"
              validateStatus={touched.capacity && errors.capacity ? "error" : ""}
              help={touched.capacity && errors.capacity}
            >
              <InputNumber
                min={0}
                name="capacity"
                value={values.capacity}
                onChange={(val) => setFieldValue("capacity", val)}
                placeholder="Enter capacity"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
            >
              {isEdit ? "Update Warehouse" : "Create Warehouse"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
