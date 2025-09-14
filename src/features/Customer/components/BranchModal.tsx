import { Modal, Form, Input, message, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import {
  createBranch,
  updateBranch,
} from "../../auth/api/customerApi";
import type { CreateBranchPayload, UpdateBranchPayload } from "../../tenants/users.types";

interface BranchModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  branch?: UpdateBranchPayload & { id?: string };
}

export const BranchModal: React.FC<BranchModalProps> = ({
  open,
  onClose,
  onSubmit,
  branch,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();

  const tenantId = currentUserData?.data?.data?.user?.tenant?.id;
  const customerId = currentUserData?.data?.data?.user?.id;


  const mutation = useMutation({
    mutationFn: (payload: CreateBranchPayload | UpdateBranchPayload) =>
      branch?.id
        ? updateBranch(branch.id, payload as UpdateBranchPayload)
        : createBranch({
            ...(payload as CreateBranchPayload),
            tenantId: tenantId!,
            customerId,
          }),
    onSuccess: () => {
      message.success(`Branch ${branch ? "updated" : "created"} successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["customerBranches", customerId],
      });
      onSubmit();
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to save branch.");
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const parsedValues = {
        ...values,
        address: {
          ...values.address,
          latitude: Number(values.address.latitude),
          longitude: Number(values.address.longitude),
        },
      };

      if (!branch?.id && !tenantId)
        return message.error("Tenant ID not found!");

      mutation.mutate(parsedValues);
    } catch (error) {
      console.log("Form validation failed", error);
    }
  };

  return (
    <Modal
      title={branch ? "Edit Branch" : "Add Branch"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={[
        <Button key="cancel" onClick={() => onClose()}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={mutation.isPending}
        >
          {branch ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: branch?.name || "",
          status: branch?.status || "ACTIVE",
          type: branch?.type || "MAIN",
          category: branch?.category || "WAREHOUSE",
          address: {
            label: branch?.address?.label || "",
            address1: branch?.address?.address1 || "",
            city: branch?.address?.city || "",
            country: branch?.address?.country || "EG",
            postalCode: branch?.address?.postalCode || "",
            latitude: branch?.address?.latitude || 0,
            longitude: branch?.address?.longitude || 0,
          },
        }}
      >
        <Form.Item
          label="Branch Name"
          name="name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Input placeholder="e.g., ACTIVE" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Input placeholder="e.g., MAIN" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input placeholder="e.g., WAREHOUSE" />
        </Form.Item>

        <Form.Item label="Address Label" name={["address", "label"]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address Line 1" name={["address", "address1"]}>
          <Input />
        </Form.Item>

        <Form.Item label="City" name={["address", "city"]}>
          <Input />
        </Form.Item>

        <Form.Item label="Country" name={["address", "country"]}>
          <Input />
        </Form.Item>

        <Form.Item label="Postal Code" name={["address", "postalCode"]}>
          <Input />
        </Form.Item>

        <Form.Item label="Latitude" name={["address", "latitude"]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Longitude" name={["address", "longitude"]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
