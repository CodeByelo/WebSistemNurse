import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const InventarioTable = ({ data, loading, onEditar, onEliminar }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Umbral</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {loading ? (
          <tr>
            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">Cargando…</td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">Sin productos registrados</td>
          </tr>
        ) : (
          data.map((p) => {
            const bajo = p.cantidad <= p.umbral_bajo;
            return (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{p.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.cantidad}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.umbral_bajo}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${bajo ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {bajo ? "Bajo stock" : "OK"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button size="xs" onClick={() => onEditar(p)}>Editar</Button>
                  <Button size="xs" variant="outline" onClick={() => onEliminar(p.id)}>Eliminar</Button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

export default InventarioTable;