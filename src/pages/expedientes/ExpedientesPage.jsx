import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import ExpedienteModal from "./components/ExpedienteModal";
import api from "../../services/api";

const FILAS_POR_PAGINA = 10;

const ExpedientesPage = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [consultaActiva, setConsultaActiva] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPagina(1);
      setConsultaActiva(terminoBusqueda.trim());
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [terminoBusqueda]);

  useEffect(() => {
    cargarEstudiantesPaginados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaActiva, pagina]);

  const cargarEstudiantesPaginados = async () => {
    setCargando(true);
    try {
      const q = consultaActiva;
      const res = await api.get("/api/estudiantes", {
        params: {
          busqueda: q,
          pagina,
          filas: FILAS_POR_PAGINA
        }
      });
      const { estudiantes: estudiantesData, totalPaginas: paginasCalc } = res.data;
      setTotalPaginas(paginasCalc);

      // Obtener última consulta para cada estudiante
      const estudiantesConUltima = await Promise.all(
        estudiantesData.map(async (est) => {
          // Traer el último expediente del estudiante
          const resExp = await api.get("/api/expedientes", {
            params: { estudiante_id: est.id, limit: 1 }
          });
          const expedientesData = resExp.data || [];
          const ultima = expedientesData.length > 0 ? expedientesData[0] : null;
          return {
            ...est,
            ultimaConsulta: ultima ? ultima.created_at : null,
            ultimaExpedienteId: ultima ? ultima.id : null
          };
        })
      );

      setEstudiantes(estudiantesConUltima);
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
      setEstudiantes([]);
      setTotalPaginas(1);
    } finally {
      setCargando(false);
    }
  };

  const abrirExpediente = async (estudiante) => {
    setCargando(true);
    try {
      let expediente = null;
      if (estudiante.ultimaExpedienteId) {
        const res = await api.get(`/api/expedientes/${estudiante.ultimaExpedienteId}`);
        expediente = res.data;
      } else {
        const res = await api.get("/api/expedientes", {
          params: { estudiante_id: estudiante.id, limit: 1 }
        });
        const data2 = res.data || [];
        expediente = data2.length > 0 ? data2[0] : null;
      }

      setEstudianteSeleccionado(estudiante);
      setExpedienteSeleccionado(expediente);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error al abrir expediente:", error);
      setEstudianteSeleccionado(estudiante);
      setExpedienteSeleccionado(null);
      setModalAbierto(true);
    } finally {
      setCargando(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setExpedienteSeleccionado(null);
    setEstudianteSeleccionado(null);
  };

  const irPaginaAnterior = () => {
    setPagina((p) => Math.max(1, p - 1));
  };

  const irPaginaSiguiente = () => {
    setPagina((p) => Math.min(totalPaginas, p + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📁 Expedientes</h1>
          <p className="text-sm text-gray-600">Buscar y gestionar expedientes estudiantiles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setTerminoBusqueda(""); setPagina(1); }}>
            <Icon name="refresh-cw" size={16} />
            <span className="ml-2">Limpiar</span>
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-1">Buscar (CI, nombre o apellido)</label>
            <div className="flex items-center gap-2">
              <input
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: 1234567, Juan, Pérez"
              />
              <Button onClick={() => { setConsultaActiva(terminoBusqueda.trim()); setPagina(1); }}>
                <Icon name="search" size={16} />
              </Button>
            </div>
          </div>
          <div className="w-48 text-right">
            <p className="text-sm text-gray-500">Página {pagina} / {totalPaginas}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha última consulta</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {cargando ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : estudiantes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No se encontraron estudiantes
                </td>
              </tr>
            ) : (
              estudiantes.map((est) => (
                <tr key={est.id}>
                  <td className="px-4 py-3">
                    <img
                      src={est.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nombre + ' ' + est.apellido)}&size=80`}
                      alt={`${est.nombre} ${est.apellido}`}
                      className="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{est.nombre} {est.apellido}</div>
                    <div className="text-xs text-gray-500">CI: {est.ci}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{est.carrera}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {est.ultimaConsulta ? new Date(est.ultimaConsulta).toLocaleString("es-ES", { year: "numeric", month: "short", day: "2-digit" }) : "Sin consultas"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => abrirExpediente(est)} className="inline-flex items-center" >
                        <Icon name="folder-open" size={16} />
                        <span className="ml-2">Ver expediente</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Mostrando {estudiantes.length} de {totalPaginas * FILAS_POR_PAGINA} (página {pagina})
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={irPaginaAnterior} disabled={pagina <= 1}>
            <Icon name="chevron-left" size={16} />
          </Button>
          <div className="px-3 py-2 border rounded-md bg-white">
            Página {pagina} / {totalPaginas}
          </div>
          <Button onClick={irPaginaSiguiente} disabled={pagina >= totalPaginas}>
            <Icon name="chevron-right" size={16} />
          </Button>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <ExpedienteModal
          abierto={modalAbierto}
          onCerrar={cerrarModal}
          estudiante={estudianteSeleccionado}
          expediente={expedienteSeleccionado}
        />
      )}
    </div>
  );
};

export default ExpedientesPage;