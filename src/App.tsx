import { Routes, Route, Navigate } from "react-router-dom";
import { SuperAdminPanel } from "./components/layout/SuperAdminPanel";
import { TenantList } from "./features/tenants/pages/TenantList";
import { TenantDetails } from "./features/tenants/pages/TenantDetails";
import { TenantAdminPanel } from "./components/layout/TenantAdminPanel";
import { TenantUsersPage } from "./features/tenants/pages/TenantUsersPage";
import { Login } from "./features/auth/pages/Login";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* SUPERADMIN Routes - Not tenant-specific */}
        <Route element={<ProtectedRoute requiredRoles={["SUPERADMIN"]} />}>
          <Route element={<SuperAdminPanel />}>
            <Route path="/superadmin/dashboard" element={<TenantList />} />
            <Route path="/tenants/:id" element={<TenantDetails />} />
          </Route>
        </Route>

        {/* Tenant-specific Routes */}
        <Route
          path="/tenant/:tenantId/*"
          element={<ProtectedRoute requireTenantAccess={true} />}
        >
          {/* Tenant Admin Routes */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute
                requiredRoles={["ADMIN"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route element={<TenantAdminPanel />}>
    <Route path="dashboard" element={<div>Tenant Admin Dashboard</div>} />
    <Route path="users" element={<TenantUsersPage />} />
    <Route path="orders" element={<div>Orders Coming Soon</div>} />
    <Route path="warehouses" element={<div>Warehouses Coming Soon</div>} />
  </Route>
          </Route>

          {/* Tenant Operations Routes */}
          <Route
            path="operations/*"
            element={
              <ProtectedRoute
                requiredRoles={["OPERATIONS"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route
              path="dashboard"
              element={<div>Tenant Operations Dashboard</div>}
            />
          </Route>

          {/* Tenant Driver Routes */}
          <Route
            path="driver/*"
            element={
              <ProtectedRoute
                requiredRoles={["DRIVER"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route
              path="dashboard"
              element={<div>Tenant Driver Dashboard</div>}
            />
          </Route>

          {/* Tenant Picker Routes */}
          <Route
            path="picker/*"
            element={
              <ProtectedRoute
                requiredRoles={["PICKER"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route
              path="dashboard"
              element={<div>Tenant Picker Dashboard</div>}
            />
          </Route>

          {/* Tenant User Routes */}
          <Route
            path="user/*"
            element={
              <ProtectedRoute
                requiredRoles={["USER"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route
              path="dashboard"
              element={<div>Tenant User Dashboard</div>}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
