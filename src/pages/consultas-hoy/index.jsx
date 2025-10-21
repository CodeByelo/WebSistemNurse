// src/pages/consultas-hoy/index.jsx (o el nombre correcto)
import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Importamos Axios
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AtenderModal from "./components/AtenderModal"; // opcional

const ConsultasHoy = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas"); // todas | en_espera | urgente
  const [modal, setModal] = useState(null); // { id, nombre }

  useEffect(() => {
    cargarConsultas();
  }, [filtro]);

  const cargarConsultas = async () => {
    setLoading(true);
    try {
      // Llamamos a un único endpoint que trae todo lo necesario, incluyendo fecha de hoy
      const res = await api.get(`/api/consultas/dia?filtro=${filtro}`);
      setConsultas(res.data || []);
    } catch (error) {
      console.error("Error cargando consultas:", error);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarAtendido = async (id) => {
    try {
      // Llama al endpoint para cambiar el estado a 'atendido'
      await api.post(`/api/consultas/${id}/atender`);
      cargarConsultas();
      setModal(null);
    } catch (error) {
      console.error("Error al marcar como atendido:", error);
    }
  };

  const chip = (color, texto) => (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}
    >
      {texto}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Consultas del día</h1>
          <p className="text-sm text-gray-600">{new Date().toLocaleDateString("es-ES")}</p>
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="en_espera">En espera</option>
          <option value="urgente">Urgentes</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">Cargando…</td>
              </tr>
            ) : consultas.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">Sin consultas registradas hoy</td>
              </tr>
            ) : (
              consultas.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.hora_llegada?.slice(0, 5)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {c.paciente_nombre} {c.paciente_apellido} {/* Nombres ajustados por API */}
                    </div>
                    <div className="text-xs text-gray-500">CI: {c.paciente_ci}</div> {/* CI ajustado por API */}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.paciente_carrera}</td> {/* Carrera ajustada */}
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{c.motivo}</td>
                  <td className="px-4 py-3">
                    {c.prioridad === "urgente"
                      ? chip("bg-red-100 text-red-700", "Urgente")
                      : chip("bg-green-100 text-green-700", "Normal")}
                  </td>
                  <td className="px-4 py-3">
                    {c.estado === "atendido"
                      ? chip("bg-blue-100 text-blue-700", "Atendido")
                      : chip("bg-yellow-100 text-yellow-700", "En espera")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.estado === "en_espera" && (
                      <Button
                        size="xs"
                        onClick={() => setModal({ id: c.id, nombre: `${c.paciente_nombre} ${c.paciente_apellido}` })}
                      >
                        Atender
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal rápido (opcional) */}
      {modal && (
        <AtenderModal
          abierto
          onCerrar={() => setModal(null)}
          onConfirmar={() => marcarAtendido(modal.id)}
          nombre={modal.nombre}
        />
      )}
    </div>
  );
};

export default ConsultasHoy;