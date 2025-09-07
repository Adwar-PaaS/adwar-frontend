import React, { useEffect, useState } from "react";
import { TenantSelectionForm } from "../components/TenantSelectionForm";
import { useNavigate } from "react-router-dom";
import {
  fetchAllTenants,
  assignTenant,
} from "../../../features/auth/api/tenantApi";
import { message, Typography } from "antd";

import styles from "../../../styles/Login.module.css";
import { useAppSelector } from "../../../store/hooks";

interface Tenant {
  id: string;
  name: string;
}

export const TenantSelectionPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
const userId = user?.id;

  useEffect(() => {
    const fetchTenantsData = async () => {
      try {
        const data = await fetchAllTenants();
        setTenants(data?.data?.tenants || []);
      } catch (error) {
        console.error("Failed to load tenants:", error);
        message.error("Failed to load tenants");
      }
    };
    fetchTenantsData();
  }, []);

  const handleTenantSubmit = async (tenantId: string) => {
 if (!userId) {
    return message.error("User ID is missing! Cannot assign tenant.");
  }

    try {
      setLoading(true);
      await assignTenant({ tenantId, userId });
      message.success("Tenant assigned successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error assigning tenant:", error);
      message.error("Failed to assign tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <img
          src="/login-illustration.jpeg"
          alt="Tenant Selection Visual"
          className={styles.loginImage}
        />
      </div>

      <div className={styles.formSection}>
        <Typography.Title level={3}>Select Your Tenant</Typography.Title>
        <TenantSelectionForm
          tenants={tenants}
          onSubmit={handleTenantSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default TenantSelectionPage;
