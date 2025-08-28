import type {
  CreateTenantPayload,
  createTenantUserPayload,
  AssignPermissionsPayload,
  Order,
} from "../../tenants/tenants.types";
// import type { createWarehousePayload } from "../../tenants/warehouses.types";
import instance from "./axiosInstance";

// FormData is needed for file uploads to match backend's FileInterceptor

// SUPERADMIN: Create tenants
export const createTenant = (data: CreateTenantPayload | FormData) =>
  instance.post("/tenants", data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

// SUPERADMIN: Get all tenants
export const getTenants = () => instance.get("/tenants");

// SUPERADMIN: Update any tenants
export const updateTenant = (
  id: string,
  data: CreateTenantPayload | FormData
) =>
  instance.put(`/tenants/${id}`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

// SUPERADMIN: Get one tenant by id
export const getTenantById = (id: string) => instance.get(`/tenants/${id}`);

// SUPERADMIN: Get all users in system while logged in as superadmin
export const getUsersByTenantId = (tenantId: string) => {
  return instance.get(`/tenants/${tenantId}/users`);
};

// SUPERADMIN: Get all roles
export const getRoles = () => instance.get("/roles");

// ADMIN: Create users in system while logged in as tenant admin
export const createTenantUser = (data: createTenantUserPayload) =>
  instance.post("/users/tenant", data);

// ADMIN: Get users in tenant admin dashboard while logged in as admin
export const getTenantUsers = (tenantId: string) =>
  instance.get(`/tenants/${tenantId}/users`);

// ADMIN: Get tenant id in tenant admin dashboard while logged in as admin
export const getCurrentUser = async () => {
  return instance.get("/auth/me");
};

export const updateTenantUser = (id: string, data: any) =>
  instance.put(`/users/${id}`, data);

// ADMIN: Update user status
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

// Admin: Assign Permissions to Roles
export const assignRolePermissions = async ({
  name,
  permissions,
  tenantId,
}: AssignPermissionsPayload) => {
  return instance.post(`/roles`, { tenantId, permissions, name });
};

// Admin: Get Warehouses
export const getWarehouses = async () => {
  return instance.get("/warehouses");
};

// Admin: Create Warehouses
export const createWarehouse = async (data: any) => {
  return instance.post("/warehouses", data);
};

// Admin: Update Warehouses
export const updateWarehouse = async (warehouseId: string, data: any) => {
  return instance.put(`/warehouses/${warehouseId}`, data);
};

// Admin: Get all warehouses for a tenant
export const fetchTenantWarehouses = async (tenantId: string) => {
  return instance.get(`/tenants/${tenantId}/warehouses`);
};

// Admin: Get all orders
export const fetchOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const res = await instance.get("/orders", { params });
  return res.data;
};

// Admin: Get order details 
export const fetchOrderById = async (orderId: string) => {
  const res = await instance.get(`/orders/${orderId}`);
  return res.data.data.order;
};

// Admin: Create a new order
export const createOrder = async (orderData: {
  sku: string;
  quantity: number;
  warehouseId: string;
  deliveryLocation: string;
  merchantLocation: string;
  description: string;
  customerName: string;
  customerPhone: string;
}) => {
  const res = await instance.post("/orders", orderData);
  return res.data;
};

// Admin: Update an order
export const updateOrder = async (orderId: string, payload: any) => {
  return instance.put(`/orders/${orderId}`, payload);
};

export const updateOrderStatus = async ({
  orderId,
  status,
  failedReason,
}: {
  orderId: string;
  status: string;
  failedReason?: string;
}) => {
  const body: any = { status };

  if (status === "FAILED" && failedReason) {
    body.failedReason = failedReason;
  }

  const response = await instance.put(`/orders/${orderId}`, body);
  return response.data;
};