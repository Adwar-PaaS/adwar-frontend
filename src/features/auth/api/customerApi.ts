import instance from "./axiosInstance";
import type {
  AssignTenantPayload,
  FetchTenantsResponse,
  RegisterResponse,
  RegisterUserPayload,
} from "../../tenants/users.types";

// Customer: Register user
export const registerUser = async (data: RegisterUserPayload) => {
  const response = await instance.post<RegisterResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

// Customer: Fetch all tenants for user to select from during registration
export const fetchAllTenants = async (): Promise<FetchTenantsResponse> => {
  const response = await instance.get<FetchTenantsResponse>("/tenants");
  return response.data;
};

// Customer: Assign tenant during registration
export const assignTenant = async (payload: AssignTenantPayload) => {
  return instance.post("/auth/attach-to-tenant", payload, {
    headers: { "Content-Type": "application/json" },
  });
};

// Customer: Fetch orders from customer dashboard
export const fetchOrdersByCustomer = async (customerId: string) => {
  return instance.get(`/orders/customer/${customerId}`);
};

// Customer: Create pickup request for selected orders
export const createPickup = async (orderIds: string[]) => {
  return instance.post("/pickups", {
    orderIds,
  });
};

// Customer : Get pickups for a customer
export const fetchCustomerPickups = async (customerId: string) => {
  return await instance.get(`/pickups/${customerId}/customer-pickups`);
};

// Customer : Get orders for a pickup
export const fetchPickupOrders = async (pickupId: string) => {
  return await instance.get(`/pickups/${pickupId}/pickup-orders`);
};

// Customer : Create a pickup request
export const createPickupRequest = async (
  pickupId: string,
) => {
  return await instance.post(`/pickups/${pickupId}/requests`, {
    pickupId,
  });
};


// Fetch branches for a specific customer
export const fetchBranchesByCustomer = async (customerId: string) => {
  const response = await instance.get(`/branches/customer/${customerId}`);
  return response;
};

// Create a new branch for a customer
export const createBranch = async (payload: {
  name: string;
  location: string;
  customerId: string;
}) => {
  return await instance.post("/branches", payload);
};

/// Update branch
export const updateBranch = async (branchId: string, payload: {
  name: string;
  location: string;
  status?: string;
}) => {
  const response = await instance.put(`/branches/${branchId}`, payload);
  return response.data;
};

// Fetch a specific branch by ID
export const fetchBranchById = async (branchId: string) => {
return instance.get(`/branches/${branchId}`);
};

// Delete a branch by ID
export const deleteBranch = async (branchId: string) => {
  return instance.delete(`/branches/${branchId}`);
};