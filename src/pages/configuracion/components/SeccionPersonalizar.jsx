import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/ui/Button";

const SeccionPersonalizar = () => {
  const [primario, setPrimario] = useState("#3b82f6");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    cargarPersonalizacion();
  }, []);

  const cargarPersonalizacion = async () => {
    const { data } = await supabase.from("preferencias").select("color_primario, logo_url").single();
    if (data) {
      setPrimario(data.color_primario || "#3b82f6");
      setLogo(data.logo_url || "");
      aplicarColor(data.color_primario || "#3b82f6");
    }
  };

  const aplicarColor = (hex) => {
    document.documentElement.style.setProperty("--color-p", hex);
  };

  const guardarColor = async () => {
    aplicarColor(primario);
    await supabase.from("preferencias").upsert({ color_primario: primario });
  };

  const subirLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const nombre = `logo_${Date.now()}.${file.name.split(".").pop()}`;
    const { data, error } = await supabase.storage.from("config").upload(nombre, file);
    if (!error) {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/config/${data.path}`;
      setLogo(url);
      await supabase.from("preferencias").upsert({ logo_url: url });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-3">Personalizar institución</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color primario</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo (PNG/JPG)</label>
          <input type="file" accept="image/*" onChange={subirLogo} className="text-sm" />
          {logo && <img src={logo} alt="Logo" className="mt-2 h-16 object-contain" />}
        </div>
      </div>
    </div>
  );
};

export default SeccionPersonalizar;