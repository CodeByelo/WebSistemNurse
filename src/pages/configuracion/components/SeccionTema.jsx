import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Switch from "../../../components/ui/Switch"; // tu componente Switch

const SeccionTema = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    cargarTema();
  }, []);

  const cargarTema = async () => {
    const { data } = await supabase.from("preferencias").select("dark_mode").single();
    const valor = data?.dark_mode ?? false;
    setDark(valor);
    aplicarTema(valor);
  };

  const aplicarTema = (valor) => {
    if (valor) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTema = async () => {
    const nuevo = !dark;
    setDark(nuevo);
    aplicarTema(nuevo);
    await supabase.from("preferencias").upsert({ dark_mode: nuevo });
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-2">Tema de la aplicación</h2>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Modo oscuro</span>
        <Switch checked={dark} onChange={toggleTema} />
      </div>
    </div>
  );
};

export default SeccionTema;