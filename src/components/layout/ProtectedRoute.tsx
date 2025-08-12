import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { hasRole, getRoleBasedRoute, canAccessTenant } from "../../utils/roleUtils";
import type { User } from "../../store/slices/authSlice";
import { Spin } from "antd";

interface ProtectedRouteProps {
  requiredRoles?: User['role'][];
  requireTenantAccess?: boolean; // Whether this route requires tenant-specific access
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  requiredRoles, 
  requireTenantAccess = false, 
  redirectTo 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const tenantId = params.tenantId; // Extract tenantId from URL params if present

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check tenant-specific access if required
  if (requireTenantAccess && tenantId) {
    if (!canAccessTenant(user, tenantId, requiredRoles)) {
      // Redirect to user's appropriate dashboard
      const fallbackRoute = user ? getRoleBasedRoute(user) : '/login';
      return <Navigate to={redirectTo || fallbackRoute} replace />;
    }
  } 
  // Check role-based access if requiredRoles is specified (without tenant context)
  else if (requiredRoles && !hasRole(user, requiredRoles)) {
    // Redirect to user's appropriate dashboard or specified redirect
    const fallbackRoute = user ? getRoleBasedRoute(user) : '/login';
    return <Navigate to={redirectTo || fallbackRoute} replace />;
  }

  return <Outlet />;
};