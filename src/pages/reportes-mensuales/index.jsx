import React, { useRef, useState } from "react";
import useReporteMensual from "./hooks/useReporteMensual";
import GraficoBarras from "./components/GraficoBarras";
import GraficoPastel from "./components/GraficoPastel";
import EnviarReportePorCorreo from "./components/EnviarReportePorCorreo";

const ReportesMensuales = () => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  const graficoBarrasRef = useRef();
  const graficoPastelRef = useRef();

  const { data, loading } = useReporteMensual(mes, anio);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Reporte mensual</h1>
            <p className="text-sm text-gray-600">Gráficos en tiempo real</p>
          </div>
          <div className="flex gap-3">
            <select className="border rounded-lg px-3 py-2" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("es", { month: "long" })}</option>
              ))}
            </select>
            <input type="number" className="border rounded-lg px-3 py-2 w-28" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
            <EnviarReportePorCorreo graficoBarrasRef={graficoBarrasRef} graficoPastelRef={graficoPastelRef} mes={mes} anio={anio} />
          </div>
        </div>

        {/* Gráficos */}
        {loading ? (
          <p className="text-gray-500">Cargando datos…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={graficoBarrasRef}>
              <GraficoBarras consultas={data.consultas} />
            </div>
            <div ref={graficoPastelRef}>
              <GraficoPastel inventario={data.inventario} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesMensuales;