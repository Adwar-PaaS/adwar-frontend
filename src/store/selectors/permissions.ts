import type { RootState } from "../../app/store";
import type { Permission } from "../slices/authSlice";

export const canUser =
  (entity: string, action: string, tenantSlug?: string) =>
  (state: RootState): boolean => {
    const user = state.auth.user;
    if (!user) return false;

    // Get role baseline permissions
    const rolePermissions: Permission[] = user.role?.permissions || [];

    // Optional tenant-specific permissions if your user has them
    const tenantPermissions: Permission[] =
      tenantSlug && user.tenant?.slug === tenantSlug
        ? user.role?.permissions || [] // adjust if you store tenant-specific perms separately
        : [];

    // User-specific overrides
    const userOverrides: Permission[] = user.userPermissions || [];

    // Merge permissions: role baseline + tenant-specific + user overrides
    const merged = [...rolePermissions, ...tenantPermissions, ...userOverrides];

    if (merged.length === 0) return true; // if empty, allow full access

    // Find permission for entity
    const permission = merged.find(
      (p) => p.entity.toLowerCase() === entity.toLowerCase()
    );
    if (!permission) return false;

    const hasAll = permission.actions.includes("ALL");
    const hasAction = permission.actions.some(
      (a) => a.toLowerCase() === action.toLowerCase()
    );

    return hasAll || hasAction;
  };
