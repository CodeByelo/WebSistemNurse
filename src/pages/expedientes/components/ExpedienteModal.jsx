// src/pages/expedientes/components/ExpedienteModal.jsx
import React, { useEffect, useRef } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

/**
 * Props esperados:
 * - abierto: boolean
 * - onCerrar: function
 * - estudiante: objeto estudiante (id, nombre, apellido, ci, carrera, foto_url)
 * - expediente: objeto expediente (motivo, hallazgos, diagnostico, medicacion (json), created_at)
 *
 * Este modal muestra la "Hoja-1" tal como se solicitó y un botón Imprimir que llama window.print().
 * Se usa la clase `print:hidden` para ocultar controles en la impresión.
 */

const ExpedienteModal = ({ abierto, onCerrar, estudiante, expediente }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (abierto) {
      // enfoque simple para accesibilidad
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  if (!abierto) return null;

  const manejarImprimir = () => {
    // Antes de print: aseguramos que elementos con print:hidden no se muestren mediante CSS
    window.print();
  };

  const fechaExpediente = expediente?.created_at
    ? new Date(expediente.created_at).toLocaleString("es-ES", { year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "—";

  const medicacionTexto = (() => {
    if (!expediente || !expediente.medicacion) return "—";
    try {
      if (typeof expediente.medicacion === "string") {
        return JSON.stringify(JSON.parse(expediente.medicacion), null, 2);
      }
      return JSON.stringify(expediente.medicacion, null, 2);
    } catch {
      return String(expediente.medicacion);
    }
  })();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onCerrar}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden"
        aria-label="Expediente"
      >
        {/* Cabecera (no imprimir) */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <div className="flex items-center gap-3">
            <Icon name="file-text" size={20} />
            <h3 className="text-lg font-semibold">Hoja-1 — Expediente</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={manejarImprimir}>
              <Icon name="printer" size={16} />
              <span className="ml-2">Imprimir</span>
            </Button>
            <Button onClick={onCerrar} variant="outline">
              <Icon name="x" size={16} />
            </Button>
          </div>
        </div>

        {/* Contenido imprimible */}
        <div className="p-6 space-y-6">
          {/* Encabezado con datos del estudiante */}
          <div className="flex items-start gap-4">
            <img
              src={
                (estudiante && estudiante.foto_url) ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent((estudiante?.nombre || "") + " " + (estudiante?.apellido || ""))}&size=160`
              }
              alt={`${estudiante?.nombre || ""} ${estudiante?.apellido || ""}`}
              className="h-20 w-20 rounded-md object-cover border"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold">{estudiante?.nombre} {estudiante?.apellido}</h4>
                  <p className="text-sm text-gray-600">CI: {estudiante?.ci || "—"}</p>
                  <p className="text-sm text-gray-600">Carrera: {estudiante?.carrera || "—"}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <div>Fecha: {fechaExpediente}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección Hoja-1 (mantener campos exactamente) */}
          <div className="border rounded-md p-4">
            <h5 className="font-semibold mb-3">Hoja-1</h5>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <div className="whitespace-pre-wrap text-sm text-gray-800">{expediente?.motivo || "—"}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hallazgos</label>
              <div className="whitespace-pre-wrap text-sm text-gray-800">{expediente?.hallazgos || "—"}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
              <div className="whitespace-pre-wrap text-sm text-gray-800">{expediente?.diagnostico || "—"}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicación</label>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded">{medicacionTexto}</pre>
            </div>
          </div>

          {/* Pie (no imprimir) */}
          <div className="flex justify-end gap-2 print:hidden">
            <Button onClick={onCerrar} variant="outline">
              <Icon name="x" size={14} />
              <span className="ml-2">Cerrar</span>
            </Button>
            <Button onClick={manejarImprimir}>
              <Icon name="printer" size={14} />
              <span className="ml-2">Imprimir</span>
            </Button>
          </div>
        </div>

        {/* Estilos especiales para impresión:
            - Ocultar toda la UI que tenga clase print:hidden
            - Asegurarse de que modal ocupe toda la página en print
         */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            /* mostrar solo el modal contenido */
            .print\\:hidden { display: none !important; }
            .relative.z-10 { position: static !important; visibility: visible !important; }
            .relative.z-10 * { visibility: visible !important; }
            .relative.z-10 { width: 100% !important; max-width: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ExpedienteModal;
