import type {
  CreateTenantPayload,
  createTenantUserPayload,
} from "../../tenants/tenants.types";
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

// SUPERADMIN: get one tenant by id 
export const getTenantById = (id: string) => instance.get(`/tenants/${id}`);

// SUPERADMIN: update any tenants
export const updateTenant = (
  id: string,
  data: CreateTenantPayload | FormData
) =>
  instance.put(`/tenants/${id}`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

// SUPERADMIN: create users in system while logged in as superadmin
export const createTenantUser = (data: createTenantUserPayload) =>
  instance.post("/users", data);

// SUPERADMIN: get all users in system while logged in as superadmin
export const getUsersByTenantId = (tenantId: string) => {
  return instance.get(`/users?tenantId=${tenantId}`);
};

// ADMIN: create users in tenant admin dashboard while logged in as admin
// export const createTenantAdminUser = (
//   tenantId: string,
//   data: Omit<createTenantUserPayload, "tenantId">
// ) => instance.post(`/tenants/${tenantId}/users`, data);

// ADMIN: fetch users in tenant admin dashboard while logged in as admin
export const getTenantUsers = (tenantId: string) =>
  instance.get(`/tenants/${tenantId}/users`);
