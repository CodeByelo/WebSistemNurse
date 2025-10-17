import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";

/* ----------  AUTH  ---------- */
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

/* ----------  TU SISTEMA  ---------- */
import DashboardEnfermeria from "./pages/dashboard-enfermeria/index.jsx";
import NotFound from "./pages/NotFound.jsx";
import NuevaConsulta from "./pages/nueva-consulta/index.jsx";


const Routes = () => (
  <BrowserRouter>
    <AuthProvider>
      <ScrollToTop />
      <RouterRoutes>
        {/* LOGIN */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* TU NUEVO DASHBOARD */}
        <Route path="/dashboard-enfermeria" element={<DashboardEnfermeria />} />
        <Route path="/nueva-consulta" element={<NuevaConsulta />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </AuthProvider>
  </BrowserRouter>
);

export default Routes;