import { Modal, Form, Input, message, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import { createBranch, updateBranch } from "../../auth/api/customerApi";

interface BranchModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  branch?: {
    id?: string;
    name: string;
    location: string;
    status?: string;
  };
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
  const customerId = currentUserData?.data?.data?.user?.id;

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      branch?.id
        ? updateBranch(branch.id, payload)
        : createBranch({ ...payload, customerId }),
    onSuccess: () => {
      message.success(`Branch ${branch ? "updated" : "created"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["customerBranches", customerId] });
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
      if (!branch?.id && !customerId) return message.error("Customer ID not found!");
      mutation.mutate(values);
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
        <Button key="submit" type="primary" onClick={handleOk} loading={mutation.isPending}>
          {branch ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: branch?.name || "",
          location: branch?.location || "",
        }}
      >
        <Form.Item
          label="Branch Name"
          name="name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter branch location" }]}
        >
          <Input placeholder="Enter branch location" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
