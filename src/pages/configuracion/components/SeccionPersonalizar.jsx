// src/pages/configuracion/components/SeccionPersonalizar.jsx

import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import Button from "../../../components/ui/Button";

const SeccionPersonalizar = () => {
  const [primario, setPrimario] = useState("#3b82f6");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    cargarPersonalizacion();
  }, []);

  const cargarPersonalizacion = async () => {
    try {
      const res = await api.get("/api/preferencias");
      const data = res.data;
      setPrimario(data.color_primario || "#3b82f6");
      setLogo(data.logo_url || "");
      aplicarColor(data.color_primario || "#3b82f6");
    } catch (err) {
      console.error("Error cargando personalización:", err);
    }
  };

  const aplicarColor = (hex) => {
    document.documentElement.style.setProperty("--color-p", hex);
  };

  const guardarColor = async () => {
    aplicarColor(primario);
    try {
      await api.post("/api/preferencias", { color_primario: primario });
      console.log("Color guardado con éxito");
    } catch (err) {
      console.error("Error guardando color:", err);
    }
  };

  const subirLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Asume que tu backend expone POST /api/upload-logo que devuelve { url }
    const formData = new FormData();
    formData.append("logo", file);
    try {
      const resUpload = await api.post("/api/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const url = resUpload.data.url;
      setLogo(url);
      await api.post("/api/preferencias", { logo_url: url });
      console.log("Logo subido y guardado");
    } catch (err) {
      console.error("Error subiendo logo:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-3">Personalizar institución</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color primario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color primario
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primario}
              onChange={(e) => setPrimario(e.target.value)}
              className="h-10 w-20 border rounded cursor-pointer"
            />
            <Button onClick={guardarColor}>Aplicar</Button>
          </div>
        </div>
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo (PNG/JPG)
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={subirLogo}
            className="text-sm"
          />
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="mt-2 h-16 object-contain border"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeccionPersonalizar;