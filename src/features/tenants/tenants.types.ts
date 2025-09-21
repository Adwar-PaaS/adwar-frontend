export interface TenantFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  address: {
    address1: string;
    city: string;
    country: string;
  };
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
  address: {
    address1: string;
    city: string;
    country: string;
  };
  logoUrl?: string | null;
}

export interface CreateSuperAdminUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  tenantId: string;
  roleName: string;
}

export interface AddressPayload {
  label: string;
  address1: string;
  address2?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  type: string;
  isPrimary: boolean;
  isDefault: boolean;
}

export interface createTenantUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  tenantId: string;
  roleId: string;
  addresses: AddressPayload[];
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
