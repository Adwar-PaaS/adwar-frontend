import type { CreateTenantPayload } from "../../tenants/tenants.types";
import instance from "./axiosInstance";

// FormData is needed for file uploads to match backend's FileInterceptor
export const createTenant = (data: CreateTenantPayload | FormData) =>
  instance.post("/tenants", data, {
    // Conditional headers - let browser set Content-Type for FormData
    // FormData automatically sets correct boundary for multipart/form-data
    headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  });

export const getTenants = () => instance.get("/tenants");
