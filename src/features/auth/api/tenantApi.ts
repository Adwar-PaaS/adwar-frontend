import type { CreateTenantPayload } from "../../tenants/tenants.types";
import instance from "./axiosInstance";

// FormData is needed for file uploads to match backend's FileInterceptor
export const createTenant = (data: CreateTenantPayload | FormData) =>
  instance.post("/tenants", data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });

export const getTenants = () => instance.get("/tenants");

export const getTenantById = (id: string) => instance.get(`/tenants/${id}`);

export const updateTenant = (
  id: string,
  data: CreateTenantPayload | FormData
) =>
  instance.put(`/tenants/${id}`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
