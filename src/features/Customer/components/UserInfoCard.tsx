import { Card, Typography, Spin } from "antd";
import { useCurrentUser } from "../../../components/auth/useCurrentUser";
import styles from "./UserInfoCard.module.css";

export const UserInfoCard = () => {
  const { data: currentUserData, isLoading } = useCurrentUser();
  const user = currentUserData?.data?.data?.user;

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <Spin />
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className={styles.card}>
      <Typography.Title level={3} className={styles.name}>
        {user.fullName}
      </Typography.Title>

      <div className={styles.row}>
        <span className={styles.label}>Email:</span>
        <span className={styles.value}>{user.email}</span>
      </div>

      {user.role?.name && (
        <div className={styles.row}>
          <span className={styles.label}>Role:</span>
          <span className={styles.value}>{user.role.name}</span>
        </div>
      )}

      {user.tenant?.slug && (
        <div className={styles.row}>
          <span className={styles.label}>Tenant:</span>
          <span className={styles.value}>{user.tenant.slug}</span>
        </div>
      )}
    </Card>
  );
};
