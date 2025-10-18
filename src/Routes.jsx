import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ConsultasHoy from "./pages/consultas-hoy/index.jsx";
import InventarioPage from "./pages/inventario/index.jsx";
import ReportesPage from "./pages/reportes/index.jsx";
import ConfiguracionPage from "./pages/configuracion/index.jsx";

/* ----------  AUTH  ---------- */
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

/* ----------  LAYOUT COMPARTIDO  ---------- */
import DashboardLayout from "./layouts/DashboardLayout"; // <-- agregado

/* ----------  TU SISTEMA  ---------- */
import DashboardEnfermeria from "./pages/dashboard-enfermeria/index.jsx";
import NotFound from "./pages/NotFound.jsx";
import NuevaConsulta from "./pages/nueva-consulta/index.jsx";
import ExpedientesPage from "./pages/expedientes/ExpedientesPage.jsx";

const Routes = () => (
  <BrowserRouter>
    <AuthProvider>
      <ScrollToTop />
      <RouterRoutes>
        {/* LOGIN */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* ÁREA INTERNA CON PANEL LATERAL FIJO */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard-enfermeria" element={<DashboardEnfermeria />} />
          <Route path="/nueva-consulta" element={<NuevaConsulta />} />
          <Route path="/expedientes" element={<ExpedientesPage />} />
          <Route path="/consultas-hoy" element={<ConsultasHoy />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </AuthProvider>
  </BrowserRouter>
);

export default Routes;