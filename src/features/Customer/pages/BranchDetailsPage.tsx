import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBranchById } from "../../auth/api/customerApi";
import { Typography, Tag, Row, Col } from "antd";

export const BranchDetailsPage = () => {
  const { branchId } = useParams<{ branchId: string }>();

  const { data } = useQuery({
    queryKey: ["branchDetails", branchId],
    queryFn: () => fetchBranchById(branchId!),
    enabled: !!branchId,
  });

  const branch = data?.data?.data;


  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={3}>Branch Details</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={12}><b>Name:</b> {branch.name}</Col>
        <Col span={12}><b>Location:</b> {branch.location}</Col>
        <Col span={12}><b>Phone:</b> {branch.phone || "-"}</Col>
        <Col span={12}>
          <b>Status:</b> <Tag color={branch.status === "ACTIVE" ? "green" : "red"}>{branch.status}</Tag>
        </Col>
        <Col span={12}><b>Created At:</b> {new Date(branch.createdAt).toLocaleString()}</Col>
        <Col span={12}><b>Updated At:</b> {new Date(branch.updatedAt).toLocaleString()}</Col>
      </Row>
    </div>
  );
};
