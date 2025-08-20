import type { User } from "../store/slices/authSlice";

export const getRoleBasedRoute = (user: User): string => {
  switch (user.role.name) {
    case "SUPER_ADMIN":
      return "/superadmin/dashboard";
    case "ADMIN":
      return `/tenant/${user.tenantId}/admin/dashboard`;
    case "OPERATIONS":
      return `/tenant/${user.tenantId}/operations/dashboard`;
    case "DRIVER":
      return `/tenant/${user.tenantId}/driver/dashboard`;
    case "PICKER":
      return `/tenant/${user.tenantId}/picker/dashboard`;
    default:
      return "/login"; // fallback
  }
};

export const hasRole = (
  user: User | null,
  requiredRoles?: User["role"]["name"][]
): boolean => {
  if (!user || !requiredRoles) return false;
  return requiredRoles.includes(user.role.name);
};


export const canAccessTenant = (
  user: User | null,
  tenantId: string,
  requiredRoles?: User["role"]["name"][]
): boolean => {
  if (!user) return false;

  // SUPER_ADMIN cannot access tenant resources
  if (user.role.name === "SUPER_ADMIN") return false;

  // Must belong to tenant
  if (user.tenantId !== tenantId) return false;

  // Must have required role if specified
  if (requiredRoles && !requiredRoles.includes(user.role.name)) return false;

  return true;
};

export const isSuperAdmin = (user: User | null): boolean =>
  user?.role.name === "SUPER_ADMIN";

export const isAdminOrHigher = (user: User | null, tenantId?: string): boolean => {
  if (!user) return false;
  if (user.role.name === "SUPER_ADMIN") return false;

  const allowed = ["ADMIN", "OPERATIONS", "DRIVER", "PICKER"];
  if (!allowed.includes(user.role.name)) return false;

  if (tenantId) return user.tenantId === tenantId;
  return true;
};

export const belongsToTenant = (user: User | null, tenantId: string): boolean => {
  if (!user) return false;
  if (user.role.name === "SUPER_ADMIN") return false;
  return user.tenantId === tenantId;
};

export const isTenantUser = (user: User | null): boolean =>
  !!user && user.role.name !== "SUPER_ADMIN";

export const getTenantRoles = (): Array<
  "ADMIN" | "OPERATIONS" | "DRIVER" | "PICKER" | "USER"
> => {
  return ["ADMIN", "OPERATIONS", "DRIVER", "PICKER", "USER"];
};
