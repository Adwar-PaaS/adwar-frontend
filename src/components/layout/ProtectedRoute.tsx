import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { Spin } from "antd";
import type { User } from "../../store/slices/authSlice";
import { canUser } from "../../store/selectors/permissions";
import { getRoleBasedRoute, canAccessTenant, hasRole } from "../../utils/roleUtils";

interface ProtectedRouteProps {
  requiredRoles?: User["role"]["name"][];
  requireTenantAccess?: boolean;
  entity?: string;
  action?: string;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  requiredRoles,
  requireTenantAccess = false,
  entity,
  action,
  redirectTo,
}: ProtectedRouteProps) => {
  // Grab the full auth state from Redux
  const authState = useAppSelector((state) => state.auth);
  const { initialized, user, isLoading } = authState;
  const { tenantSlug } = useParams();

  // Adapt Redux state to match canUser expected format
  const adaptedState = {
    auth: {
      ...authState,
      loading: isLoading,
    },
  };

  // Show loader until auth is initialized
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

  // Not authenticated

  const fallbackRoute = user ? getRoleBasedRoute(user) : "/login";

  // Tenant-specific access
  if (requireTenantAccess && tenantSlug) {
    if (!canAccessTenant(user, tenantSlug, requiredRoles)) {
      return <Navigate to={redirectTo || fallbackRoute} replace />;
    }
  }

  // Role-based access (non-tenant context)
  if (requiredRoles && !hasRole(user, requiredRoles)) {
    return <Navigate to={redirectTo || fallbackRoute} replace />;
  }

  // Dynamic entity/action permission check using full auth state
  if (entity && action) {
    const hasPermission = canUser(entity, action, tenantSlug)(adaptedState);
    if (!hasPermission) {
      return <Navigate to={redirectTo || fallbackRoute} replace />;
    }
  }
  return <Outlet />;
};
