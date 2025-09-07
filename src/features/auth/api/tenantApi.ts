import type {
  CreateTenantPayload,
  createTenantUserPayload,
  AssignPermissionsPayload,
  CreateSuperAdminUserPayload,
} from "../../tenants/tenants.types";
import type {
  AssignTenantPayload,
  FetchTenantsResponse,
  RegisterResponse,
  RegisterUserPayload,
} from "../../tenants/users.types";
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

// SUPERADMIN: Create super admin users in system while logged in as superadmin
export const createSuperAdminUser = (data: CreateSuperAdminUserPayload) =>
  instance.post("/users/super-admin/create-user", data);

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

// Admin: Get permissions for all roles
export const fetchPermissions = async () => {
  return instance.get("/roles/permissions");
};

// Admin: Assign Permissions to Roles
export const assignRolePermissions = async ({
  name,
  permissions,
  tenantId,
}: AssignPermissionsPayload) => {
  return instance.post(`/roles`, { tenantId, permissions, name });
};

// Admin: Get all created and customized roles for a tenant
export const fetchTenantRoles = async (tenantId: string) => {
  const response = await instance.get(`/tenants/${tenantId}/roles`);
  return response.data.data.roles;
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

// Admin: Get all orders for all tenants
export const fetchOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const res = await instance.get("/orders", { params });
  return res.data;
};

// Admin: Get all orders for a specific tenant
export const fetchOrdersForTenant = async ({
  tenantId,
  page,
  limit,
  status,
}: {
  tenantId: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const res = await instance.get(`/tenants/${tenantId}/orders`, {
    params: { page, limit, status },
  });
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

// Admin: Get all drivers for a warehouse
export const fetchWarehouseDrivers = async (warehouseId: string) => {
  return instance.get(`/warehouses/${warehouseId}/drivers`);
};

// Admin: Get a warehouse
export const fetchWarehouseById = (warehouseId: string) => {
  return instance.get(`/warehouses/${warehouseId}`);
};

// Admin: Get all orders for a warehouse
export const fetchWarehouseOrders = (warehouseId: string) => {
  return instance.get(`/warehouses/${warehouseId}/orders`);
};

// Admin: Get all users for a warehouse
export const fetchWarehouseUsers = async (warehouseId: string) => {
  return instance.get(`/warehouses/${warehouseId}/users`);
};

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
