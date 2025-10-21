import React, { useEffect, useState } from "react";

const SeccionNotificaciones = () => {
  const [inv, setInv] = useState(true);
  const [email, setEmail] = useState(false);

  // ⚠️ Nota: Las notificaciones se manejarán desde el backend (API) en el futuro.
  // Por ahora, solo mostramos la UI con estado local.

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-3">Notificaciones</h2>
      <div className="space-y-3">
        {/* Alertas de inventario */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={inv}
            onChange={(e) => setInv(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Alertas de inventario bajo</span>
        </label>

        {/* Resumen diario por correo */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Resumen diario por correo</span>
        </label>
      </div>
    </div>
  );
};

export default SeccionNotificaciones;