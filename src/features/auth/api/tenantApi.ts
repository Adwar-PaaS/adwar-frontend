import type { TenantFormValues } from "../../tenants/tenants.types";
import instance from "./axiosInstance";

export const createTenant = (data: TenantFormValues) =>
  instance.post("/tenants", data);

export const getTenants = () => instance.get("/tenants");
