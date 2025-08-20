import type { User } from '../store/slices/authSlice';

export const getRoleBasedRoute = (user: User): string => {
  const roleName = user.role.name;
  const tenantId = user.userTenants?.[0]?.tenantId;
  
  switch (roleName) {
    case 'SUPER_ADMIN':
      return '/superadmin/dashboard';
    case 'ADMIN':
      return `/tenant/${tenantId}/admin/dashboard`;
    case 'OPERATIONS':
      return `/tenant/${tenantId}/operations/dashboard`;
    case 'DRIVER':
      return `/tenant/${tenantId}/driver/dashboard`;
    case 'PICKER':
      return `/tenant/${tenantId}/picker/dashboard`;
    default:
      return '/login'; // fallback
  }
};

// Check if user has required role for a specific route
// For tenant-specific roles, also checks if user belongs to the specified tenant
export const hasRole = (
  user: User | null, 
  requiredRoles: string[], 
  requiredTenantId?: string
): boolean => {
  if (!user) return false;
  
  const userRole = user.role.name;
  const userTenantId = user.userTenants?.[0]?.tenantId;
  
  // Check if user has one of the required roles
  const hasRequiredRole = requiredRoles.includes(userRole);
  if (!hasRequiredRole) return false;
  
  // SUPER_ADMIN only has access to superadmin routes (not tenant routes)
  if (userRole === 'SUPER_ADMIN') {
    // SUPER_ADMIN should only access routes that don't require a tenant
    return !requiredTenantId;
  }
  
  // For tenant-specific roles, check tenant membership
  if (requiredTenantId) {
    return userTenantId === requiredTenantId;
  }
  
  // If no specific tenant required, user just needs the role
  return true;
};

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role.name === 'SUPER_ADMIN';
};

/**
 * Check if user is admin or higher (within tenant context)
 * SUPER_ADMIN is excluded as they don't access tenant dashboards
 */
export const isAdminOrHigher = (user: User | null, tenantId?: string): boolean => {
  if (!user) return false;
  
  const userRole = user.role.name;
  const userTenantId = user.userTenants?.[0]?.tenantId;
  
  // SUPER_ADMIN doesn't access tenant dashboards
  if (userRole === 'SUPER_ADMIN') return false;
  
  const isAdminRole = ['ADMIN', 'OPERATIONS', 'DRIVER', 'PICKER'].includes(userRole);
  if (!isAdminRole) return false;
  
  // For tenant-specific admin roles, check tenant membership if specified
  if (tenantId) {
    return userTenantId === tenantId;
  }
  
  return true;
};

/**
 * Check if user belongs to a specific tenant
 * SUPER_ADMIN doesn't belong to any tenant (they access superadmin dashboard only)
 */
export const belongsToTenant = (user: User | null, tenantId: string): boolean => {
  if (!user) return false;
  const userRole = user.role.name;
  const userTenantId = user.userTenants?.[0]?.tenantId;
  
  // SUPER_ADMIN doesn't belong to any tenant
  if (userRole === 'SUPER_ADMIN') return false;
  return userTenantId === tenantId;
};

/**
 * Check if user can access tenant-specific resources
 * SUPER_ADMIN cannot access tenant resources (they only access superadmin dashboard)
 */
export const canAccessTenant = (
  user: User | null, 
  tenantId: string, 
  requiredRoles?: string[]
): boolean => {
  if (!user) return false;
  
  const userRole = user.role.name;
  const userTenantId = user.userTenants?.[0]?.tenantId;
  
  // SUPER_ADMIN cannot access tenant resources
  if (userRole === 'SUPER_ADMIN') return false;
  
  // Check if user belongs to the tenant
  if (userTenantId !== tenantId) return false;
  
  // Check role requirements if specified
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return false;
  }
  
  return true;
};

/**
 * Check if user is a tenant-specific user (not SUPER_ADMIN)
 */
export const isTenantUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.role.name !== 'SUPER_ADMIN';
};

/**
 * Get tenant-specific roles (excluding SUPER_ADMIN)
 */
export const getTenantRoles = (): string[] => {
  return ['ADMIN', 'OPERATIONS', 'DRIVER', 'PICKER', 'USER'];
};
