import type {
  CreateTenantPayload,
  createTenantUserPayload,
} from "../../tenants/tenants.types";
import type { createWarehousePayload } from "../../tenants/warehouses.types";
import instance from "./axiosInstance";

// FormData is needed for file uploads to match backend's FileInterceptor

// SUPERADMIN: Create tenants
export const createTenant = (data: CreateTenantPayload | FormData) =>
  instance.post("/tenants", data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

// SUPERADMIN: get all tenants
export const getTenants = () => instance.get("/tenants");

// SUPERADMIN: update any tenants
export const updateTenant = (
  id: string,
  data: CreateTenantPayload | FormData
) =>
  instance.put(`/tenants/${id}`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

// SUPERADMIN: get one tenant by id
export const getTenantById = (id: string) => instance.get(`/tenants/${id}`);

// SUPERADMIN: get all users in system while logged in as superadmin
export const getUsersByTenantId = (tenantId: string) => {
  return instance.get(`/tenants/${tenantId}/users`);
};

// SUPERADMIN: get all roles
export const getRoles = () => instance.get("/roles");

// ADMIN: create users in system while logged in as tenant admin
export const createTenantUser = (data: createTenantUserPayload) =>
  instance.post("/users/tenant", data);

// ADMIN: fetch users in tenant admin dashboard while logged in as admin
export const getTenantUsers = (tenantId: string) =>
  instance.get(`/tenants/${tenantId}/users`);

// ADMIN: fetch tenant id in tenant admin dashboard while logged in as admin
export const getCurrentUser = async () => {
  return instance.get("/auth/me");
};

export const updateTenantUser = (id: string, data: any) =>
  instance.put(`/users/${id}`, data);

// ADMIN: update user status
export const toggleUserStatus = (id: string, status: string) => {
  return instance.patch(`/users/${id}/status`, { status });
};


// Admin: Get all roles
export const fetchRoles = async () => {
  return instance.get("/roles");
};

// Admin: Get permissions for all roles
export const fetchPermissions = async () => {
  return instance.get("/users/role/permissions");
};

// Admin: Get Warehouses
export const getWarehouses = async () => {
  return instance.get("/warehouses");
};

// Admin: Create Warehouses
export const createWarehouse = (data: createWarehousePayload | FormData) =>
  instance.post("/warehouses", data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

