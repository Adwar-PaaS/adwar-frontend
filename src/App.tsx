import { Routes, Route, Navigate } from "react-router-dom";
import { SuperAdminPanel } from "./components/layout/SuperAdminPanel";
import { TenantList } from "./features/tenants/pages/TenantList";
import { TenantDetails } from "./features/tenants/pages/TenantDetails";
import { TenantAdminPanel } from "./components/layout/TenantAdminPanel";
import { TenantUsersPage } from "./features/tenants/pages/TenantUsersPage";
import { Login } from "./features/auth/pages/Login";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import "./App.css";
import { TenantRolesPage } from "./features/tenants/pages/TenantRolesPage";
import { WarehouseList } from "./features/tenants/pages/WarehouseList";
import { OrderListPage } from "./features/tenants/pages/OrdersListPage";
import { OrderDetailsPage } from "./features/tenants/pages/OrderDetailsPage";
import { WarehouseDetailsPage } from "./features/tenants/pages/WarehouseDetailsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* SUPERADMIN Routes */}
        <Route element={<ProtectedRoute requiredRoles={["SUPER_ADMIN"]} />}>
          <Route element={<SuperAdminPanel />}>
            <Route path="/superadmin/dashboard" element={<TenantList />} />
            <Route path="/tenants/:id" element={<TenantDetails />} />
          </Route>
        </Route>

        {/* Tenant-specific Routes */}
        <Route
          path="/tenant/:tenantSlug/*"
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
              <Route path="orders" element={<OrderListPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="warehouses" element={<WarehouseList />} />
              <Route path="warehouses/:warehouseId" element={<WarehouseDetailsPage />} />
              <Route path="roles" element={<TenantRolesPage />} />
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
            <Route path="dashboard" element={<div>Tenant Operations Dashboard</div>} />
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
            <Route path="dashboard" element={<div>Tenant Driver Dashboard</div>} />
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
            <Route path="dashboard" element={<div>Tenant Picker Dashboard</div>} />
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
            <Route path="dashboard" element={<div>Tenant User Dashboard</div>} />
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
