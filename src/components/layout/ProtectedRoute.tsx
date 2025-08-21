import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  hasRole,
  getRoleBasedRoute,
  canAccessTenant,
} from "../../utils/roleUtils";
import { Spin } from "antd";
import type { User } from "../../store/slices/authSlice";

interface ProtectedRouteProps {
requiredRoles?: User["role"]["name"][];
  requireTenantAccess?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  requiredRoles,
  requireTenantAccess = false,
  redirectTo,
}: ProtectedRouteProps) => {
  const { isAuthenticated, initialized, user } = useAppSelector(
    (state) => state.auth
  );
  const { tenantId } = useParams();
  if (!initialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check tenant-specific access
  if (requireTenantAccess && tenantId) {
    if (!canAccessTenant(user, tenantId, requiredRoles)) {
      const fallbackRoute = user ? getRoleBasedRoute(user) : "/login";
      return <Navigate to={redirectTo || fallbackRoute} replace />;
    }
  }
  // Check role-based access (non-tenant context)
  else if (requiredRoles && !hasRole(user, requiredRoles)) {
    const fallbackRoute = user ? getRoleBasedRoute(user) : "/login";
    return <Navigate to={redirectTo || fallbackRoute} replace />;
  }

  return <Outlet />;
};
