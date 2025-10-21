// src/hooks/useReporteMensual.js (o el nombre que tenga)

import { useEffect, useState } from "react";
import api from "../../../services/api"; // Importa tu cliente Axios

export default function useReporteMensual(mes, anio) {
  const [data, setData] = useState({ consultas: [], inventario: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, [mes, anio]);

  const cargar = async () => {
    setLoading(true);
    const mesFormateado = mes.toString().padStart(2, "0");
    const inicio = `${anio}-${mesFormateado}-01`;
    // Cálculo seguro de fin de mes
    const fin = new Date(anio, mes, 0).toISOString().split("T")[0]; 

    try {
      // 1. Consultas del mes (Llama a tu nuevo endpoint de backend)
      const resConsultas = await api.get(`/api/reportes/consultas?mes=${mesFormateado}&anio=${anio}`);
      
      // 2. Inventario actual (Llama a tu nuevo endpoint de backend)
      const resInventario = await api.get("/api/reportes/inventario");
      
      setData({ 
        consultas: resConsultas.data || [], 
        inventario: resInventario.data || [] 
      });
      
    } catch (error) {
      console.error("Error cargando reportes:", error);
      setData({ consultas: [], inventario: [] });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
}