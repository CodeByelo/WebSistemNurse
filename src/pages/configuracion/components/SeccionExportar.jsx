// src/pages/configuracion/components/SeccionExportar.jsx
import React from "react";
import api from "../../../services/api";
import Button from "../../../components/ui/Button";

const SeccionExportar = () => {
  const exportarCSV = async () => {
    try {
      // 1) Traer expedientes desde tu API
      const res = await api.get("/api/expedientes");
      const data = res.data;
      if (!data || data.length === 0) return;

      // 2) Construir CSV
      const header = ["ID","Estudiante ID","Motivo","Diagnóstico","Fecha"];
      const rows = data.map(d => [
        d.id,
        d.estudiante_id,
        JSON.stringify(d.motivo),
        JSON.stringify(d.diagnostico),
        d.created_at
      ]);
      const csvContent = [header, ...rows]
        .map(r => r.join(","))
        .join("\n");

      // 3) Descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `expedientes_${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exportando CSV:", err);
    }
  };

  const logoutGlobal = async () => {
    try {
      // Llama a tu endpoint de logout global (implementa /api/logout-all en el back)
      await api.post("/api/logout-all");
    } catch (err) {
      console.error("Error cerrando sesiones:", err);
    } finally {
      // Redirige al login
      window.location.href = "/login";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-3">Exportar y seguridad</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={exportarCSV}>Descargar expedientes CSV</Button>
        <Button variant="outline" onClick={logoutGlobal}>
          Cerrar sesión en todos los dispositivos
        </Button>
      </div>
    </div>
  );
};

export default SeccionExportar;