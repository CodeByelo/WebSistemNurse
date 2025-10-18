import React from "react";
import SeccionTema from "./components/SeccionTema";
import SeccionNotificaciones from "./components/SeccionNotificaciones";
import SeccionPersonalizar from "./components/SeccionPersonalizar";
import SeccionExportar from "./components/SeccionExportar";

const ConfiguracionPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ Configuración</h1>
      <SeccionTema />
      <SeccionNotificaciones />
      <SeccionPersonalizar />
      <SeccionExportar />
    </div>
  </div>
);

export default ConfiguracionPage;