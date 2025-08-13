export interface TenantFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "Activate" | "Deactivate";
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
  status: "Activate" | "Deactivate";
  address: string;
  logoUrl?: string | null;
}

export interface createTenantUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
  tenantId: string;
}
