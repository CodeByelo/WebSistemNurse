// src/pages/dashboard-enfermeria/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const DashboardEnfermeria = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    consultasHoy: 0,
    atendidosHoy: 0,
    enEspera: 0,
    urgentes: 0,
    inventarioBajo: 0
  });

  const [consultasRecientes, setConsultasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];

      // Consultas de hoy
      const { data: consultasHoy, count: totalConsultasHoy } = await supabase
        .from('consultas')
        .select('*', { count: 'exact' })
        .eq('fecha', hoy);

      const { data: atendidos, count: totalAtendidos } = await supabase
        .from('consultas')
        .select('*', { count: 'exact' })
        .eq('fecha', hoy)
        .eq('estado', 'atendido');

      const { data: urgentes, count: totalUrgentes } = await supabase
        .from('consultas')
        .select('*', { count: 'exact' })
        .eq('fecha', hoy)
        .eq('prioridad', 'urgente')
        .eq('estado', 'en_espera');

      setEstadisticas({
        consultasHoy: totalConsultasHoy || 0,
        atendidosHoy: totalAtendidos || 0,
        enEspera: (totalConsultasHoy || 0) - (totalAtendidos || 0),
        urgentes: totalUrgentes || 0,
        inventarioBajo: 3 // Ejemplo: se actualizará desde inventario real
      });

      // Últimas 5 consultas del día
      const { data: recientes } = await supabase
        .from('consultas')
        .select(`
          *,
          estudiantes (
            nombre,
            apellido,
            carnet,
            carrera
          )
        `)
        .eq('fecha', hoy)
        .order('hora_llegada', { ascending: false })
        .limit(5);

      setConsultasRecientes(recientes || []);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
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
            {
              label: 'Consultas Hoy',
              value: estadisticas.consultasHoy,
              color: 'blue',
              icon: 'stethoscope'
            },
            {
              label: 'Atendidos',
              value: estadisticas.atendidosHoy,
              color: 'green',
              icon: 'check-circle'
            },
            {
              label: 'En Espera',
              value: estadisticas.enEspera,
              color: 'yellow',
              icon: 'clock'
            },
            {
              label: 'Urgentes',
              value: estadisticas.urgentes,
              color: 'red',
              icon: 'alert-triangle'
            },
            {
              label: 'Inventario Bajo',
              value: estadisticas.inventarioBajo,
              color: 'purple',
              icon: 'package'
            }
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {item.label}
                  </p>
                  <p
                    className={`text-2xl font-bold text-${item.color}-600`}
                  >
                    {item.value}
                  </p>
                </div>
                <div className={`bg-${item.color}-100 p-3 rounded-full`}>
                  <Icon
                    name={item.icon}
                    size={24}
                    className={`text-${item.color}-600`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={handleNuevaConsulta}
            className="h-16 text-base"
            iconName="plus-circle"
            iconPosition="left"
          >
            📝 Nueva Consulta
          </Button>

          <Button
            onClick={handleVerConsultas}
            variant="outline"
            className="h-16 text-base"
            iconName="list"
            iconPosition="left"
          >
            📋 Ver Consultas de Hoy
          </Button>

          <Button
            onClick={handleInventario}
            variant="secondary"
            className="h-16 text-base"
            iconName="archive"
            iconPosition="left"
          >
            📦 Inventario
          </Button>

          <Button
            onClick={handleExpedientes}
            variant="outline"
            className="h-16 text-base"
            iconName="folder-open"
            iconPosition="left"
          >
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
              {consultasRecientes.length === 0 ? (
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
                          {consulta.estudiantes?.nombre}{' '}
                          {consulta.estudiantes?.apellido}
                        </p>
                        <p className="text-sm text-gray-600">
                          {consulta.estudiantes?.carnet} • {consulta.motivo}
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
                          {consulta.estado === 'atendido'
                            ? 'Atendido'
                            : 'En espera'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Anuncios y Recordatorios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="bell" size={20} />
                Anuncios y Recordatorios
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    name="info"
                    size={16}
                    className="text-blue-600 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-blue-900">Inventario Bajo</p>
                    <p className="text-sm text-blue-700">
                      Quedan solo 5 unidades de paracetamol. Considera
                      reabastecer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    name="check-circle"
                    size={16}
                    className="text-green-600 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-green-900">
                      Todo Actualizado
                    </p>
                    <p className="text-sm text-green-700">
                      Los reportes del mes han sido generados exitosamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    name="calendar"
                    size={16}
                    className="text-yellow-600 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-yellow-900">
                      Mantenimiento Programado
                    </p>
                    <p className="text-sm text-yellow-700">
                      Revisión mensual del equipo: 25 de octubre a las 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardEnfermeria;
