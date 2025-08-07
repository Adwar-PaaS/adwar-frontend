export interface TenantFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "Activate" | "Deactivate";
  address: string;
  logoUrl: string | null;
}

export interface CreateTenantPayload {
  name: string;
  email: string;
  phone: string;
  status: "Activate" | "Deactivate";
  address: string;
  logo?: string | null;
}
