// src/pages/dashboard-enfermeria/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import api from '../../services/api'; // <-- Importamos Axios

const DashboardEnfermeria = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    consultasHoy: 0,
    atendidosHoy: 0,
    enEspera: 0,
    urgentes: 0,
    inventarioBajo: 3 // Dato inicial fijo
  });

  const [consultasRecientes, setConsultasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    setLoading(true);
    try {
      // 1. Llamada a endpoint que consolida los KPIs
      const resKpis = await api.get('/api/dashboard/kpis');
      setEstadisticas(prev => ({
        ...prev,
        ...resKpis.data.kpis
      }));
      
      // 2. Últimas 5 consultas del día
      const resRecientes = await api.get('/api/dashboard/consultas_recientes');
      setConsultasRecientes(resRecientes.data || []);

    } catch (error) {
      console.error('Error cargando dashboard desde API:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaConsulta = () => navigate('/nueva-consulta');
  const handleVerConsultas = () => navigate('/consultas-hoy');
  const handleInventario = () => navigate('/inventario');
  const handleExpedientes = () => navigate('/expedientes');

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  // Función utilitaria para clases dinámicas (para evitar errores de compilación de Tailwind)
  const getColorClasses = (color) => {
    switch (color) {
        case 'blue': return { text: 'text-blue-600', bg: 'bg-blue-100', icon: 'stethoscope' };
        case 'green': return { text: 'text-green-600', bg: 'bg-green-100', icon: 'check-circle' };
        case 'yellow': return { text: 'text-yellow-600', bg: 'bg-yellow-100', icon: 'clock' };
        case 'red': return { text: 'text-red-600', bg: 'bg-red-100', icon: 'alert-triangle' };
        case 'purple': return { text: 'text-purple-600', bg: 'bg-purple-100', icon: 'package' };
        default: return { text: 'text-gray-600', bg: 'bg-gray-100', icon: 'help-circle' };
    }
  }
  
  return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 Enfermería Universitaria
          </h1>
          <p className="text-gray-600">
            Bienvenido al sistema de gestión de consultas médicas estudiantiles
          </p>
          <div className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Consultas Hoy', value: estadisticas.consultasHoy, color: 'blue' },
            { label: 'Atendidos', value: estadisticas.atendidosHoy, color: 'green' },
            { label: 'En Espera', value: estadisticas.enEspera, color: 'yellow' },
            { label: 'Urgentes', value: estadisticas.urgentes, color: 'red' },
            { label: 'Inventario Bajo', value: estadisticas.inventarioBajo, color: 'purple' }
          ].map((item) => {
            const classes = getColorClasses(item.color);
            return (
                <div
                    key={item.label}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {item.label}
                            </p>
                            <p className={`text-2xl font-bold ${classes.text}`}>
                                {item.value}
                            </p>
                        </div>
                        <div className={`${classes.bg} p-3 rounded-full`}>
                            <Icon name={classes.icon} size={24} className={`${classes.text}`} />
                        </div>
                    </div>
                </div>
            );
          })}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button onClick={handleNuevaConsulta} className="h-16 text-base" iconName="plus-circle" iconPosition="left">
            📝 Nueva Consulta
          </Button>

          <Button onClick={handleVerConsultas} variant="outline" className="h-16 text-base" iconName="list" iconPosition="left">
            📋 Ver Consultas de Hoy
          </Button>

          <Button onClick={handleInventario} variant="secondary" className="h-16 text-base" iconName="archive" iconPosition="left">
            📦 Inventario
          </Button>

          <Button onClick={handleExpedientes} variant="outline" className="h-16 text-base" iconName="folder-open" iconPosition="left">
            📁 Expedientes
          </Button>
        </div>

        {/* Consultas Recientes + Anuncios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultas Recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="history" size={20} />
                Últimas Consultas del Día
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <p className="text-center py-4">Cargando consultas...</p>
              ) : consultasRecientes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay consultas registradas hoy
                </p>
              ) : (
                <div className="space-y-3">
                  {consultasRecientes.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {consulta.paciente_nombre} {consulta.paciente_apellido}
                        </p>
                        <p className="text-sm text-gray-600">
                          {consulta.paciente_carnet} • {consulta.motivo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {consulta.hora_llegada?.slice(0, 5)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            consulta.estado === 'atendido'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {consulta.estado === 'atendido' ? 'Atendido' : 'En espera'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Anuncios y Recordatorios (Static Content) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="bell" size={20} />
                Anuncios y Recordatorios
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* ... Contenido estático de recordatorios ... */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="info" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Inventario Bajo</p>
                    <p className="text-sm text-blue-700">
                      Quedan solo 5 unidades de paracetamol. Considera reabastecer.
                    </p>
                  </div>
                </div>
              </div>
              {/* ... otros anuncios estáticos ... */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardEnfermeria;