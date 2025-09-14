import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBranchById } from "../../auth/api/customerApi";
import { Card, Descriptions, Typography } from "antd";
import styles from "../../../styles/BranchDetailsPage.module.css";

export const BranchDetailsPage = () => {
  const { branchId } = useParams<{ branchId: string }>();

  const { data, isError } = useQuery({
    queryKey: ["branchDetails", branchId],
    queryFn: () => fetchBranchById(branchId!),
    enabled: !!branchId,
  });

  const branch = data?.data?.data.branch;

  if (isError || !branch)
    return <Typography.Text>Failed to load branch details</Typography.Text>;

  return (
    <div className={styles.container}>
      <Card title={`Branch Details - ${branch.name}`}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Name">{branch.name}</Descriptions.Item>
          <Descriptions.Item label="Status">{branch.status}</Descriptions.Item>
          <Descriptions.Item label="Type">{branch.type}</Descriptions.Item>
          <Descriptions.Item label="Category">
            {branch.category}
          </Descriptions.Item>

          <Descriptions.Item label="Address Label">
            {branch.address?.label}
          </Descriptions.Item>
          <Descriptions.Item label="Address 1">
            {branch.address?.address1}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {branch.address?.city}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {branch.address?.country}
          </Descriptions.Item>
          <Descriptions.Item label="Postal Code">
            {branch.address?.postalCode}
          </Descriptions.Item>
          <Descriptions.Item label="Latitude">
            {branch.address?.latitude}
          </Descriptions.Item>
          <Descriptions.Item label="Longitude">
            {branch.address?.longitude}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {new Date(branch.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(branch.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
