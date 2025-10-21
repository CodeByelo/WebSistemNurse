import React, { useState, useEffect } from "react";
import api from "../../services/api";
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
    try {
      let endpoint = tipo === "consultas" ? "/api/consultas" : "/api/inventario";
      const res = await api.get(endpoint, {
        params: {
          desde: `${fechaInicio}T00:00:00`,
          hasta: `${fechaFin}T23:59:59`
        }
      });
      setDatos(res.data || []);
    } catch (error) {
      setDatos([]);
      console.error("Error generando reporte:", error);
    }
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