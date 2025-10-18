import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
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
    const { data, error } = await supabase
      .from("inventario")
      .select("*")
      .order("nombre", { ascending: true });
    if (!error) setProductos(data);
    setLoading(false);
  };

  const handleGuardar = async (nuevo) => {
    if (nuevo.id) {
      // Editar
      await supabase.from("inventario").update(nuevo).eq("id", nuevo.id);
    } else {
      // Crear
      await supabase.from("inventario").insert(nuevo);
    }
    cargarInventario();
    setModalAgregar(false);
    setModalEditar(null);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await supabase.from("inventario").delete().eq("id", id);
    cargarInventario();
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

      {/* Modales */}
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