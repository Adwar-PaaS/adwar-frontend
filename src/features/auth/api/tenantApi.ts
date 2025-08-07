import type { CreateTenantPayload } from "../../tenants/tenants.types";
import instance from "./axiosInstance";

export const createTenant = (data: CreateTenantPayload) =>
  instance.post("/tenants", data);

export const getTenants = () => instance.get("/tenants");
