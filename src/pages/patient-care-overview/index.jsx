import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalControlsBar from './components/GlobalControlsBar';
import FloorPlanVisualization from './components/FloorPlanVisualization';
import AlertFeed from './components/AlertFeed';
import PatientFlowChart from './components/PatientFlowChart';
import { useAuth } from '../../contexts/AuthContext';
import Layout from './Layout';

const mockStats = { bedOccupancy: { occupied: 89, total: 120, occupancyRate: 74, available: 31 }, patients: { active: 89 }, staff: { onDuty: 42 } };
const mockAlerts = [{ severity: 'critical' }, { severity: 'critical' }, { severity: 'high' }, { severity: 'high' }];
const mockBeds = [{ id: 'A101', patient: 'Juan Pérez', risk: 'critical', status: 'occupied', los: 5 }, { id: 'A102', patient: null, risk: 'low', status: 'available', los: 0 }];
const getInitialShift = () => { const h = new Date().getHours(); if (h >= 7 && h < 19) return 'day'; if (h >= 19 && h < 23) return 'evening'; return 'night'; };

const PatientCareOverview = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const selectedUnit = 'all';
  const currentShift = getInitialShift();
  const autoRefresh = true;
  const refreshInterval = 15;
  const lastUpdated = new Date();
  const kpiData = [
    { title: 'Censo Actual', value: '89', subtitle: 'de 120 camas', icon: 'users', trend: 'up', trendValue: '+3', status: 'normal' },
    { title: 'Camas Disponibles', value: '31', subtitle: '25.8% ocupación', icon: 'bed', trend: 'down', trendValue: '-2', status: 'success' },
    { title: 'Pacientes Activos', value: '89', subtitle: 'Total activos', icon: 'user-check', trend: 'stable', trendValue: '0', status: 'normal' },
    { title: 'Personal en Turno', value: '42', subtitle: 'Turno actual', icon: 'users', trend: 'stable', trendValue: '0', status: 'normal' },
    { title: 'Alertas Críticas', value: '2', subtitle: '4 total', icon: 'alert-triangle', trend: 'up', trendValue: '+2', status: 'critical' },
    { title: 'Alertas Altas', value: '2', subtitle: 'Prioridad alta', icon: 'alert-circle', trend: 'up', trendValue: '+2', status: 'warning' }
  ];

  const handleAuthAction = () => navigate('/login');
  const handleKPIClick = (kpiType) => {
    switch (kpiType) {
      case 'safety': navigate('/patient-safety-dashboard'); break;
      case 'quality': navigate('/clinical-quality-monitor'); break;
      case 'staff': navigate('/staff-performance-analytics'); break;
      case 'resources': navigate('/resource-utilization-hub'); break;
      default: break;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Vista General de Cuidados de Pacientes</h1>
                <p className="text-muted-foreground mt-1">
                  Centro de comando para operaciones de enfermería y monitoreo de pacientes
                  {isAuthenticated && user?.userProfile && <span className="ml-2 text-blue-600">- Bienvenido, {user?.userProfile?.full_name}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2 text-sm text-green-600"><Icon name="check-circle" size={16} /><span>Conectado</span></div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-600"><Icon name="alert-circle" size={16} /><span>Modo Vista Previa</span></div>
                  )}
                </div>
                <Button variant="outline" onClick={handleAuthAction} iconName={isAuthenticated ? "log-out" : "log-in"} iconPosition="left">{isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}</Button>
                <Button variant="outline" onClick={() => handleKPIClick('safety')} iconName="shield-check" iconPosition="left">Seguridad del Paciente</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <GlobalControlsBar selectedUnit={selectedUnit} onUnitChange={() => {}} currentShift={currentShift} onShiftChange={() => {}} autoRefresh={autoRefresh} onAutoRefreshChange={() => {}} refreshInterval={refreshInterval} onRefreshIntervalChange={() => {}} onManualRefresh={() => {}} lastUpdated={lastUpdated} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {kpiData.map((kpi, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleKPIClick(kpi.title)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{kpi.title}</h3>
                    <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
                    {kpi.subtitle && <p className="text-sm text-muted-foreground mb-2">{kpi.subtitle}</p>}
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3"><Icon name={kpi.icon} size={24} className="text-primary" /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm"><Icon name={isAuthenticated ? "database" : "eye"} size={16} className="text-blue-600" /><span className="text-blue-800">{isAuthenticated ? `Datos en tiempo real desde Supabase - Última actualización: ${lastUpdated.toLocaleTimeString()}` : "Datos de muestra para vista previa - Inicia sesión para datos en tiempo real"}</span></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2"><FloorPlanVisualization selectedUnit={selectedUnit} onBedClick={() => {}} beds={mockBeds} loading={false} /></div>
            <div className="xl:col-span-1"><AlertFeed maxHeight="600px" /></div>
          </div>

          <div className="mb-6"><PatientFlowChart /></div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Icon name="zap" size={20} /> Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => handleKPIClick('staff')} iconName="users" iconPosition="left" className="justify-start h-auto p-4"><div className="text-left"><div className="font-medium">Análisis de Personal</div><div className="text-xs text-muted-foreground">Rendimiento y carga de trabajo</div></div></Button>
              <Button variant="outline" onClick={() => handleKPIClick('quality')} iconName="clipboard-check" iconPosition="left" className="justify-start h-auto p-4"><div className="text-left"><div className="font-medium">Monitor de Calidad</div><div className="text-xs text-muted-foreground">Indicadores clínicos</div></div></Button>
              <Button variant="outline" onClick={() => handleKPIClick('resources')} iconName="bar-chart-3" iconPosition="left" className="justify-start h-auto p-4"><div className="text-left"><div className="font-medium">Centro de Recursos</div><div className="text-xs text-muted-foreground">Utilización y optimización</div></div></Button>
              <Button variant="outline" onClick={() => handleKPIClick('safety')} iconName="shield-check" iconPosition="left" className="justify-start h-auto p-4"><div className="text-left"><div className="font-medium">Seguridad del Paciente</div><div className="text-xs text-muted-foreground">Alertas y prevención</div></div></Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientCareOverview;