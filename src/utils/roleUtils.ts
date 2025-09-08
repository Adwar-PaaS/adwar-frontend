import type { User } from "../store/slices/authSlice";

export const getRoleBasedRoute = (user: User): string => {
  const tenantSlug = user.tenant?.slug;
  switch (user.role.name) {
    case "SUPER_ADMIN":
      return "/superadmin/dashboard";
    case "ADMIN":
      return `/tenant/${tenantSlug}/admin/dashboard`;
    case "OPERATION":
      return `/tenant/${tenantSlug}/operation/dashboard`;
    case "DRIVER":
      return `/tenant/${tenantSlug}/driver/dashboard`;
    case "PICKER":
      return `/tenant/${tenantSlug}/picker/dashboard`;
    case "CUSTOMER":
      return `/tenant/${tenantSlug}/customer/dashboard`;
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
  tenantSlug: string,
  requiredRoles?: User["role"]["name"][]
): boolean => {
  if (!user) return false;

  // SUPER_ADMIN cannot access tenant resources
  if (user.role.name === "SUPER_ADMIN") return false;

  // Must belong to tenant (using slug)
  if (user.tenant?.slug !== tenantSlug) return false;

  // Must have required role if specified
  if (requiredRoles && !requiredRoles.includes(user.role.name)) return false;

  return true;
};

export const canAccessTenantById = (
  user: User | null,
  tenantId: string,
  requiredRoles?: User["role"]["name"][]
): boolean => {
  if (!user) return false;

  // SUPER_ADMIN cannot access tenant resources
  if (user.role.name === "SUPER_ADMIN") return false;

  // Must belong to tenant (using ID)
  if (user.tenant?.id !== tenantId) return false;

  // Must have required role if specified
  if (requiredRoles && !requiredRoles.includes(user.role.name)) return false;

  return true;
};

export const isSuperAdmin = (user: User | null): boolean =>
  user?.role.name === "SUPER_ADMIN";

export const isAdminOrHigher = (user: User | null, tenantSlug?: string): boolean => {
  if (!user) return false;
  if (user.role.name === "SUPER_ADMIN") return false;

  const allowed = ["ADMIN", "OPERATION", "DRIVER", "PICKER"];
  if (!allowed.includes(user.role.name)) return false;

  if (tenantSlug) return user.tenant?.slug === tenantSlug;
  return true;
};

export const belongsToTenant = (user: User | null, tenantSlug: string): boolean => {
  if (!user) return false;
  if (user.role.name === "SUPER_ADMIN") return false;
  return user.tenant?.slug === tenantSlug;
};

export const belongsToTenantById = (user: User | null, tenantId: string): boolean => {
  if (!user) return false;
  if (user.role.name === "SUPER_ADMIN") return false;
  return user.tenant?.id === tenantId;
};

export const isTenantUser = (user: User | null): boolean =>
  !!user && user.role.name !== "SUPER_ADMIN";

export const getTenantRoles = (): Array<
  "ADMIN" | "OPERATION" | "DRIVER" | "PICKER" | "CUSTOMER"
> => {
  return ["ADMIN", "OPERATION", "DRIVER", "PICKER", "CUSTOMER"];
};
