import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const SeccionNotificaciones = () => {
  const [inv, setInv] = useState(true);
  const [email, setEmail] = useState(false);

  useEffect(() => {
    cargarNotifs();
  }, []);

  const cargarNotifs = async () => {
    const { data } = await supabase.from("preferencias").select("notif_inventario, notif_email").single();
    if (data) {
      setInv(data.notif_inventario ?? true);
      setEmail(data.notif_email ?? false);
    }
  };

  const guardar = async (campo, valor) => {
    await supabase.from("preferencias").upsert({ [campo]: valor });
  };

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
            onChange={(e) => {
              const val = e.target.checked;
              setInv(val);
              guardar("notif_inventario", val);
            }}
          />
          <span className="text-sm text-gray-700">Alertas de inventario bajo</span>
        </label>

        {/* Resumen diario por correo */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={email}
            onChange={(e) => {
              const val = e.target.checked;
              setEmail(val);
              guardar("notif_email", val);
            }}
          />
          <span className="text-sm text-gray-700">Resumen diario por correo</span>
        </label>
      </div>
    </div>
  );
};

export default SeccionNotificaciones;