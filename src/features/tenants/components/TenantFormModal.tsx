import { Modal, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { TenantSchema } from "../../auth/validation";
import type { TenantFormValues } from "../tenants.types";
import styles from "./TenantFormModal.module.css";

interface TenantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TenantFormValues) => void;
  initialValues?: TenantFormValues;
  isEdit?: boolean;
}

export const TenantFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: TenantModalProps) => {
  const defaultValues: TenantFormValues = initialValues || {
    name: "",
    email: "",
    phone: "",
    status: "active",
    address: "",
    logoUrl: "",
    createdAt: "",
    createdBy: "",
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Modal
      title={isEdit ? "Edit Tenant" : "Add Tenant"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
      centered={true}
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={TenantSchema}
        onSubmit={(values) => {
          onSubmit(values);
          toast.success(isEdit ? "Tenant updated" : "Tenant added");
          onClose();
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <Input name="name" value={values.name} onChange={handleChange} />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && errors.email}
            >
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              validateStatus={touched.phone && errors.phone ? "error" : ""}
              help={touched.phone && errors.phone}
            >
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Status"
              validateStatus={touched.status && errors.status ? "error" : ""}
              help={touched.status && errors.status}
            >
              <Select
                value={values.status}
                onChange={(val) => setFieldValue("status", val)}
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Address">
              <Input
                name="address"
                value={values.address}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Logo">
              <Upload
                beforeUpload={async (file) => {
                  const base64 = await getBase64(file);
                  setFieldValue("logoUrl", base64);
                  message.success("Image uploaded");
                  return false; // Prevent automatic upload
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>

              {values.logoUrl && (
                <img
                  src={values.logoUrl}
                  alt="Tenant Logo"
                  style={{ marginTop: 10, width: 80, height: 80, objectFit: "contain" }}
                />
              )}
            </Form.Item>

            <Form.Item label="Created At">
              <Input
                name="createdAt"
                value={values.createdAt}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Created By">
              <Input
                name="createdBy"
                value={values.createdBy}
                onChange={handleChange}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={styles.submitButton}>
              {isEdit ? "Update" : "Add"} Tenant
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
