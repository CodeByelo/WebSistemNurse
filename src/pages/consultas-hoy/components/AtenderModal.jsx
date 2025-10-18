import React from "react";
import Button from "../../../components/ui/Button";

const AtenderModal = ({ abierto, onCerrar, onConfirmar, nombre }) => {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">¿Marcar como atendido?</h3>
        <p className="text-sm text-gray-600 mb-4">{nombre}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCerrar}>Cancelar</Button>
          <Button onClick={onConfirmar}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
};

export default AtenderModal;