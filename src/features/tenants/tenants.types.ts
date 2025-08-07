export interface TenantFormValues {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  address: string;
  logoUrl: string;
}
