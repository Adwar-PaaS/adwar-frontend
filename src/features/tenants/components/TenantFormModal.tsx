import { Modal, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { TenantSchema } from "../../auth/validation";
import type { TenantFormValues } from "../tenants.types";
import styles from "./TenantFormModal.module.css";

interface TenantModalProps {
  open: boolean;
  onClose: () => void;
  // Added file parameter to onSubmit to pass the actual File object
  // instead of just base64 string for proper multipart/form-data upload
  onSubmit: (values: TenantFormValues, file?: File | null) => void;
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
  // State to store the actual File object for upload
  // This is needed because backend expects multipart/form-data with actual file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const defaultValues: TenantFormValues = initialValues || {
    name: "",
    email: "",
    phone: "",
    status: "Activate",
    address: "",
    // Set to null instead of empty string to match type definition
    logoUrl: null,
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
      destroyOnClose
      centered={true}
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={TenantSchema}
        onSubmit={(values) => {
          // Pass both form values and the actual File object
          // The backend needs the File object for multipart upload, not base64
          onSubmit(values, selectedFile);
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
                <Select.Option value="Activate">Activate</Select.Option>
                <Select.Option value="Deactivate">Deactivate</Select.Option>
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
                  // Store the actual File object for later upload
                  // This is required for backend's FileInterceptor('logo')
                  setSelectedFile(file);
                  
                  // Keep base64 conversion for preview display only
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
                <div style={{ marginTop: 10 }}>
                  <img
                    src={values.logoUrl}
                    alt="Tenant Logo"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "contain",
                      marginBottom: 8,
                    }}
                  />
                  <Button
                    danger
                    size="small"
                    onClick={() => {
                      setFieldValue("logoUrl", null);
                      // ADDED: Clear the selected file when removing logo
                      setSelectedFile(null);
                    }}
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitButton}
            >
              {isEdit ? "Update" : "Add"} Tenant
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
