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
import RegisterPage from "./features/auth/pages/Register";
import TenantSelectionPage from "./features/Customer/pages/TenantSelectionPage";
import { CustomerPanel } from "./components/layout/CustomerPanel";
import { CustomerOrdersList } from "./features/Customer/pages/CustomerOrdersList";
import { ShipmentPickUp } from "./features/Customer/pages/ShipmentPickUp";
import { CustomerBranchesList } from "./features/Customer/pages/CustomerBranchesList";
import { BranchDetailsPage } from "./features/Customer/pages/BranchDetailsPage";
import { OperationsPanel } from "./components/layout/OperationsPanel"; // <--- Import the new layout
import { PickupsListPage } from "./features/Operation/pages/PickupsListPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tenant-selection" element={<TenantSelectionPage />} />

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
            path="operation/*"
            element={
              <ProtectedRoute
                requiredRoles={["OPERATION"]}
                requireTenantAccess={true}
              />
            }
          >
            <Route element={<OperationsPanel />}>
              <Route path="dashboard" element={<div>Tenant Operations Dashboard</div>} />
              <Route path="pickups" element={<PickupsListPage/>} />
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
              <Route index element={<div>Welcome to Customer Dashboard</div>} />
              <Route path="orders" element={<CustomerOrdersList />} />
              <Route path="shipments" element={<ShipmentPickUp />} />
              <Route path="branches" element={<CustomerBranchesList />} />
              <Route path="branches/:branchId" element={<BranchDetailsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
}

export default App;
