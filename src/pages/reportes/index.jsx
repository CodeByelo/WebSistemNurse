import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import FiltrosReporte from "./components/FiltrosReporte";
import TablaReporte from "./components/TablaReporte";
// import ExportarPDF from "./components/ExportarPDF"; // opcional

const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("consultas"); // consultas | inventario
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fechas por defecto: mes actual
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split("T")[0];
    setFechaInicio(primerDia);
    setFechaFin(ultimoDia);
  }, []);

  const generarReporte = async () => {
    setLoading(true);
    let query = supabase.from(tipo).select("*").gte("created_at", `${fechaInicio}T00:00:00`).lte("created_at", `${fechaFin}T23:59:59`);
    const { data, error } = await query;
    if (!error) setDatos(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Reportes mensuales</h1>
        <p className="text-sm text-gray-600">Genera reportes filtrados por fecha</p>
      </div>

      <FiltrosReporte
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        tipo={tipo}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
        setTipo={setTipo}
        onGenerar={generarReporte}
      />

      <TablaReporte datos={datos} tipo={tipo} loading={loading} />

      {/* <ExportarPDF datos={datos} tipo={tipo} /> */}
    </div>
  );
};

export default ReportesPage;