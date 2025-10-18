import React from "react";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/ui/Button";

const SeccionExportar = () => {
  const exportarCSV = async () => {
    const { data } = await supabase.from("expedientes").select("*");
    if (!data) return;
    const csv = [
      ["ID", "Estudiante ID", "Motivo", "Diagnóstico", "Fecha"],
      ...data.map((d) => [d.id, d.estudiante_id, d.motivo, d.diagnostico, d.created_at]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expedientes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const logoutGlobal = async () => {
    await supabase.auth.signOut({ scope: "global" });
    window.location.replace("/login");
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-3">Exportar y seguridad</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={exportarCSV}>Descargar expedientes CSV</Button>
        <Button variant="outline" onClick={logoutGlobal}>Cerrar sesión en todos los dispositivos</Button>
      </div>
    </div>
  );
};

export default SeccionExportar;