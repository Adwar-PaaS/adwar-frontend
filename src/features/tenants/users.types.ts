export interface RegisterUserPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  id: string; 
  email: string;
  fullName: string;
}

interface Tenant {
  id: string;
  name: string;
}

export interface FetchTenantsResponse {
  data: {
    tenants: Tenant[];
  };
}

export interface AssignTenantPayload {
  tenantId: string;
  userId: string;
}

export interface BranchAddress {
  label: string;
  address1: string;
  city: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface CreateBranchPayload {
  name: string;
  tenantId: string;
  customerId?: string;
  status: string;
  type: string;
  category: string;
  address: BranchAddress;
}

export interface UpdateBranchPayload {
  name: string;
  location?: string; 
  status: string;
  type: string;
  category: string;
  address: BranchAddress;
}
