import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import Switch from "../../../components/ui/Switch";

const SeccionTema = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    cargarTema();
    // eslint-disable-next-line
  }, []);

  const cargarTema = async () => {
    try {
      const res = await api.get("/api/preferencias");
      const valor = res.data?.dark_mode ?? false;
      setDark(valor);
      aplicarTema(valor);
    } catch (err) {
      setDark(false);
      aplicarTema(false);
      console.error("Error cargando tema:", err);
    }
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
    try {
      await api.post("/api/preferencias", { dark_mode: nuevo });
    } catch (err) {
      console.error("Error guardando tema:", err);
    }
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