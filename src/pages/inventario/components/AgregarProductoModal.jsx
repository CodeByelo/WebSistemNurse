import React, { useState } from "react";
import Button from "../../../components/ui/Button";

const AgregarProductoModal = ({ abierto, onCerrar, onGuardar }) => {
  const [form, setForm] = useState({ nombre: "", cantidad: 0, umbral_bajo: 5 });

  if (!abierto) return null;

  const handleGuardar = () => {
    onGuardar({ ...form, cantidad: Number(form.cantidad), umbral_bajo: Number(form.umbral_bajo) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Agregar producto</h3>
        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Umbral bajo"
            value={form.umbral_bajo}
            onChange={(e) => setForm({ ...form, umbral_bajo: e.target.value })}
          />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onCerrar}>Cancelar</Button>
          <Button onClick={handleGuardar}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default AgregarProductoModal;