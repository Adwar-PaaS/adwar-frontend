import { Modal, Select, Button, Form } from "antd";
import { useState, useEffect } from "react";

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  options: string[];
  selectedValue?: string;
}

export const AssignModal = ({
  open,
  onClose,
  onSave,
  title,
  options,
  selectedValue,
}: AssignModalProps) => {
  const [value, setValue] = useState<string | undefined>(selectedValue);

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        onFinish={() => {
          if (value) onSave(value);
        }}
      >
        <Form.Item label={title} required>
          <Select
            value={value}
            onChange={(val) => setValue(val)}
            placeholder={`Select ${title}`}
          >
            {options.map((opt) => (
              <Select.Option key={opt} value={opt}>
                {opt}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Save
        </Button>
      </Form>
    </Modal>
  );
};
