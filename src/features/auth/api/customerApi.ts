import instance from "./axiosInstance";
import type {
  CreateBranchPayload,
  UpdateBranchPayload,
} from "../../tenants/users.types";

// Customer: Fetch orders from customer dashboard
export const fetchOrdersByCustomer = async (customerId: string) => {
  return instance.get(`/customers/${customerId}/orders`);
};

// Customer: Create pickup request for selected orders
export const createPickup = async (orderIds: string[]) => {
  return instance.post("/pickups", {
    orderIds,
  });
};

// Customer : Get pickups for a customer
export const fetchCustomerPickups = async (customerId: string) => {
  return await instance.get(`/customers/${customerId}/pickups`);
};



// Fetch branches for a specific customer
export const fetchBranchesByCustomer = async (customerId: string) => {
  const response = await instance.get(`/branches/customer/${customerId}`);
  return response;
};

// Create a new branch for a customer
export const createBranch = async (payload: CreateBranchPayload) => {
  const response = await instance.post("/branches", payload);
  return response.data;
};

/// Update branch
export const updateBranch = async (
  branchId: string,
  payload: UpdateBranchPayload
) => {
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
