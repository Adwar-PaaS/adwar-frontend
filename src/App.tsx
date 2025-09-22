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
import { OrderListPage } from "./features/tenants/pages/OrdersListPage";
import { OrderDetailsPage } from "./features/tenants/pages/OrderDetailsPage";
import { CustomerPanel } from "./components/layout/CustomerPanel";
import { CustomerOrdersList } from "./features/Customer/pages/CustomerOrdersList";
import { ShipmentPickUp } from "./features/Customer/pages/ShipmentPickUp";
import { BranchDetailsPage } from "./features/Customer/pages/BranchDetailsPage";
import { OperationsPanel } from "./components/layout/OperationsPanel";
import { PickupsListPage } from "./features/Operation/pages/PickupsListPage";
import { PickupDetailsPage } from "./features/Operation/pages/PickupDetailsPage";
import { ApprovedPickupsListPage } from "./features/Operation/pages/ApprovedPickupsListPage";
import { TenantBranchesList } from "./features/tenants/pages/TenantBranchesList";
import { CustomerDashboard } from "./features/Customer/pages/CustomerDashboard";
import TenantDashboard from "./features/tenants/pages/TenantDashboard";

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
              <Route
                path="dashboard"
                element={<TenantDashboard/>}
              />
              <Route path="users" element={<TenantUsersPage />} />
              <Route path="orders" element={<OrderListPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="branches" element={<TenantBranchesList />} />
              <Route
                path="branches/:branchId"
                element={<BranchDetailsPage />}
              />

              <Route path="roles" element={<TenantRolesPage />} />
            </Route>
          </Route>

          {/* Tenant Operations Routes */}
          <Route
            path="operation/*"
            element={
              <ProtectedRoute
                requiredRoles={["OPERATION"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route element={<OperationsPanel />}>
              <Route
                path="dashboard"
                element={<div>Tenant Operations Dashboard</div>}
              />
              <Route path="pickups" element={<PickupsListPage />} />
              <Route path="pickups/:pickupId" element={<PickupDetailsPage />} />

              {/* Enable Approved Pickups page */}
              <Route
                path="approved-pickups"
                element={<ApprovedPickupsListPage />}
              />
            </Route>
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

          {/* Tenant Customer Routes */}
          <Route
            path="customer/*"
            element={
              <ProtectedRoute
                requiredRoles={["CUSTOMER"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route path="dashboard" element={<CustomerPanel />}>
              <Route index element={<CustomerDashboard/>} />
              <Route path="orders" element={<CustomerOrdersList />} />
              <Route path="pickups" element={<ShipmentPickUp />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
