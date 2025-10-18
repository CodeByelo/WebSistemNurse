import React from "react";
import Button from "../../../components/ui/Button";

const FiltrosReporte = ({ fechaInicio, fechaFin, tipo, setFechaInicio, setFechaFin, setTipo, onGenerar }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
      <input
        type="date"
        className="w-full border rounded-lg px-3 py-2"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
      <input
        type="date"
        className="w-full border rounded-lg px-3 py-2"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
      <select
        className="w-full border rounded-lg px-3 py-2"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="consultas">Consultas</option>
        <option value="inventario">Inventario</option>
      </select>
    </div>
    <Button onClick={onGenerar}>Generar reporte</Button>
  </div>
);

export default FiltrosReporte;