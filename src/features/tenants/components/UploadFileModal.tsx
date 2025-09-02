import { useState } from "react";
import { Modal, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Text } = Typography;

interface UploadFileModalProps {
  open: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void; 
}

export const UploadFileModal = ({ open, onClose, onUpload }: UploadFileModalProps) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handleOk = () => {
    if (onUpload && fileList.length > 0) {
      onUpload(fileList[0].originFileObj); // pass file to parent
    }
    onClose();
  };

  return (
    <Modal
      title="Upload File"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Upload"
      centered
    >
      <Dragger
        multiple={false}
        beforeUpload={() => false} // prevent auto upload
        fileList={fileList}
        onChange={handleChange}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <Text type="secondary">Only one file allowed</Text>
      </Dragger>
    </Modal>
  );
};
