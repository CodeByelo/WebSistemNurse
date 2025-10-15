import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "pages/NotFound";

/* ----------  MENÚ ENFERMERO REAL  ---------- */
import PatientCareOverview       from "./pages/patient-care-overview/index.jsx";
import PatientRegistration       from "./pages/PatientRegistration/index.jsx";
import PatientList               from "./pages/PatientList/index.jsx";        // ✅ REAL
import BedOccupancy              from "./pages/BedOccupancy/index.jsx";       // ✅ REAL
import AlertFeed                 from "./pages/patient-care-overview/components/AlertFeed.jsx"; // ✅ REAL

/* ----------  AUTH  ---------- */
import LoginForm  from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

const Routes = () => (
  <BrowserRouter>
    <AuthProvider>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth */}
        <Route path="/login"  element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* ✅ MENÚ ENFERMERO REAL */}
        <Route path="/"                    element={<PatientCareOverview />} />
        <Route path="/patients/register"   element={<PatientRegistration />} />
        <Route path="/patients"            element={<PatientList />} />
        <Route path="/beds"                element={<BedOccupancy />} />
        <Route path="/alerts"              element={<AlertFeed />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </AuthProvider>
  </BrowserRouter>
);

export default Routes;