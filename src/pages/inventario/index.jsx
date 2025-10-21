// src/pages/inventario/InventarioPage.jsx (o el nombre correcto)
import React, { useState, useEffect } from "react";
import api from "../../services/api"; // <-- IMPORTANTE: Usamos Axios
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import InventarioTable from "./components/InventarioTable";
import AgregarProductoModal from "./components/AgregarProductoModal";
import EditarProductoModal from "./components/EditarProductoModal";

const InventarioPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(null); // { id, ... }

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/inventario");
      setProductos(res.data || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (nuevo) => {
    if (nuevo.id) {
      // Editar: Asume que tu backend maneja PUT o POST con ID
      await api.post(`/api/inventario/${nuevo.id}`, nuevo); 
    } else {
      // Crear
      await api.post("/api/inventario", nuevo);
    }
    cargarInventario(); // Refrescar lista
    setModalAgregar(false);
    setModalEditar(null);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/api/inventario/${id}`);
      cargarInventario();
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📦 Inventario</h1>
          <p className="text-sm text-gray-600">Gestión de productos médicos</p>
        </div>
        <Button onClick={() => setModalAgregar(true)} iconName="plus-circle">
          Agregar producto
        </Button>
      </div>

      {/* Tabla */}
      <InventarioTable
        data={productos}
        loading={loading}
        onEditar={setModalEditar}
        onEliminar={handleEliminar}
      />

      {/* Modales - Asegúrate de que los componentes internos usen la API en lugar de supabase */}
      {modalAgregar && (
        <AgregarProductoModal
          abierto
          onCerrar={() => setModalAgregar(false)}
          onGuardar={handleGuardar}
        />
      )}
      {modalEditar && (
        <EditarProductoModal
          abierto
          producto={modalEditar}
          onCerrar={() => setModalEditar(null)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
};

export default InventarioPage;