import { Routes, Route, Navigate } from "react-router-dom";
import { TenantList } from "./features/tenants/pages/TenantList";
import { Login } from "./features/auth/pages/Login";
import { initializeAuth, setUser } from './features/auth/authSlice';
import { SuperAdminPanel } from "./components/layout/SuperAdminPanel";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import "./App.css";
import AuthStabilizer from "./components/AuthStabilizer";

function App() {
   const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={(
          <>
            <AuthStabilizer />
            <SuperAdminPanel />
          </>
        )}>
          <Route path="/superadmin/tenants" element={<TenantList />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
