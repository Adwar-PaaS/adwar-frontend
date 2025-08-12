import type { User } from '../store/slices/authSlice';
export const getRoleBasedRoute = (user: User): string => {
  switch (user.role) {
    case 'SUPERADMIN':
      return '/superadmin/dashboard';
    case 'ADMIN':
      return `/tenant/${user.tenantId}/admin/dashboard`;
    case 'OPERATIONS':
      return `/tenant/${user.tenantId}/operations/dashboard`;
    case 'DRIVER':
      return `/tenant/${user.tenantId}/driver/dashboard`;
    case 'PICKER':
      return `/tenant/${user.tenantId}/picker/dashboard`;
    default:
      return '/login'; // fallback
  }
};


// Check if user has required role for a specific route
// For tenant-specific roles, also checks if user belongs to the specified tenant

export const hasRole = (
  user: User | null, 
  requiredRoles: User['role'][], 
  requiredTenantId?: string
): boolean => {
  if (!user) return false;
  
  // Check if user has one of the required roles
  const hasRequiredRole = requiredRoles.includes(user.role);
  if (!hasRequiredRole) return false;
  
  // SUPERADMIN only has access to superadmin routes (not tenant routes)
  if (user.role === 'SUPERADMIN') {
    // SUPERADMIN should only access routes that don't require a tenant
    return !requiredTenantId;
  }
  
  // For tenant-specific roles, check tenant membership
  if (requiredTenantId) {
    return user.tenantId === requiredTenantId;
  }
  
  // If no specific tenant required, user just needs the role
  return true;
};


export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === 'SUPERADMIN';
};

/**
 * Check if user is admin or higher (within tenant context)
 * SUPERADMIN is excluded as they don't access tenant dashboards
 */
export const isAdminOrHigher = (user: User | null, tenantId?: string): boolean => {
  if (!user) return false;
  
  // SUPERADMIN doesn't access tenant dashboards
  if (user.role === 'SUPERADMIN') return false;
  
  const isAdminRole = ['ADMIN', 'OPERATIONS', 'DRIVER', 'PICKER'].includes(user.role);
  if (!isAdminRole) return false;
  
  // For tenant-specific admin roles, check tenant membership if specified
  if (tenantId) {
    return user.tenantId === tenantId;
  }
  
  return true;
};

/**
 * Check if user belongs to a specific tenant
 * SUPERADMIN doesn't belong to any tenant (they access superadmin dashboard only)
 */
export const belongsToTenant = (user: User | null, tenantId: string): boolean => {
  if (!user) return false;
  // SUPERADMIN doesn't belong to any tenant
  if (user.role === 'SUPERADMIN') return false;
  return user.tenantId === tenantId;
};

/**
 * Check if user can access tenant-specific resources
 * SUPERADMIN cannot access tenant resources (they only access superadmin dashboard)
 */
export const canAccessTenant = (
  user: User | null, 
  tenantId: string, 
  requiredRoles?: User['role'][]
): boolean => {
  if (!user) return false;
  
  // SUPERADMIN cannot access tenant resources
  if (user.role === 'SUPERADMIN') return false;
  
  // Check if user belongs to the tenant
  if (user.tenantId !== tenantId) return false;
  
  // Check role requirements if specified
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return false;
  }
  
  return true;
};

/**
 * Check if user is a tenant-specific user (not SUPERADMIN)
 */
export const isTenantUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.role !== 'SUPERADMIN';
};

/**
 * Get tenant-specific roles (excluding SUPERADMIN)
 */
export const getTenantRoles = (): User['role'][] => {
  return ['ADMIN', 'OPERATIONS', 'DRIVER', 'PICKER', 'USER'];
};
