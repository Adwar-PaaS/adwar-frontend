import { Routes, Route, Navigate } from "react-router-dom";
import { SuperAdminPanel } from "./components/layout/SuperAdminPanel";
import { TenantList } from "./features/tenants/pages/TenantList";
import { Login } from "./features/auth/pages/Login";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<SuperAdminPanel />}>
          <Route path="/superadmin/tenants" element={<TenantList />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
