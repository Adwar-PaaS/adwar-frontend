export interface TenantFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  address: string;
  logoUrl: string | null;
  createdAt?: string;
  creator?: {
    fullName: string;
  };
}

export interface CreateTenantPayload {
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  address: string;
  logoUrl?: string | null;
}

export interface CreateSuperAdminUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  tenantId: string;
  roleName: string;
}

export interface createTenantUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  tenantId: string;
  roleId: string;
}

export interface AssignPermissionsPayload {
  name: string;
  tenantId: string;
  permissions: Array<{ entityType: string; actionTypes: string[] }>;
}

export interface Order {
  id: string;
  sku: string;
  quantity: number;
  failedReason: string | null;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  warehouseId: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
