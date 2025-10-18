import React from "react";

const TablaReporte = ({ datos, tipo, loading }) => {
  const cols =
    tipo === "consultas"
      ? ["Fecha", "Estudiante", "Motivo", "Prioridad", "Estado"]
      : ["Producto", "Cantidad", "Umbral", "Estado"];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={cols.length} className="px-4 py-6 text-center text-gray-500">Cargando…</td>
            </tr>
          ) : datos.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="px-4 py-6 text-center text-gray-500">Sin registros en el período seleccionado</td>
            </tr>
          ) : (
            datos.map((d) =>
              tipo === "consultas" ? (
                <tr key={d.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(d.created_at).toLocaleDateString("es-ES")}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{d.estudiante_nombre || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{d.motivo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${d.prioridad === "urgente" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {d.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${d.estado === "atendido" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {d.estado}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr key={d.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{d.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{d.cantidad}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{d.umbral_bajo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${d.cantidad <= d.umbral_bajo ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {d.cantidad <= d.umbral_bajo ? "Bajo stock" : "OK"}
                    </span>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaReporte;