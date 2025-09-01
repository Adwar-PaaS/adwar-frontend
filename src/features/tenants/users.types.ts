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