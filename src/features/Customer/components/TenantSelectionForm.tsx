import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Select, Button, Spin } from "antd";

interface TenantSelectionFormProps {
  tenants: { id: string; name: string }[];
  onSubmit: (tenantId: string) => void;
  isLoading: boolean;
}

const TenantSchema = Yup.object().shape({
  tenantId: Yup.string().required("Please select a tenant"),
});

export const TenantSelectionForm: React.FC<TenantSelectionFormProps> = ({
  tenants,
  onSubmit,
  isLoading,
}) => {
  return (
    <Formik
      initialValues={{ tenantId: "" }}
      validationSchema={TenantSchema}
      onSubmit={(values) => {
        onSubmit(values.tenantId);
      }}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, submitForm }) => (
        <Form
          layout="vertical"
          autoComplete="off"
          onFinish={() => submitForm()}
        >
          <Form.Item
            validateStatus={touched.tenantId && errors.tenantId ? "error" : ""}
            help={touched.tenantId && errors.tenantId}
          >
            {isLoading ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select a tenant"
                value={values.tenantId}
                onChange={(val) => setFieldValue("tenantId", val)}
              >
                {tenants.map((tenant) => (
                  <Select.Option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};
