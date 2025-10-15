import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ResourceKPICard from './components/ResourceKPICard';
import EquipmentStatusGrid from './components/EquipmentStatusGrid';
import InventoryLevelsChart from './components/InventoryLevelsChart';
import CostAnalysisVisualization from './components/CostAnalysisVisualization';
import ResourceAllocationTable from './components/ResourceAllocationTable';
import GlobalControlsPanel from './components/GlobalControlsPanel';
import Layout from './Layout';

const ResourceUtilizationHub = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [globalFilters, setGlobalFilters] = useState({ costCenter: 'all', fiscalPeriod: 'current_month', utilizationThreshold: 'standard', refreshInterval: '10min', alertsEnabled: true });
  const [activeView, setActiveView] = useState('overview');

  const kpiData = [
    { title: 'Tiempo Activo Equipos', value: '94.2', unit: '%', change: 2.1, changeType: 'positive', icon: 'activity', target: '95%', status: 'warning' },
    { title: 'Rotación Inventario', value: '8.7', unit: 'x/año', change: -1.3, changeType: 'negative', icon: 'refresh-cw', target: '10x', status: 'warning' },
    { title: 'Costo por Paciente/Día', value: '€1,875', unit: '', change: -3.2, changeType: 'positive', icon: 'euro', target: '€1,950', status: 'success' },
    { title: 'Eficiencia Cadena Suministro', value: '89.1', unit: '%', change: 4.7, changeType: 'positive', icon: 'truck', target: '92%', status: 'normal' },
    { title: 'Mantenimientos Programados', value: '23', unit: 'pendientes', change: -12.5, changeType: 'positive', icon: 'wrench', target: '15', status: 'warning' },
    { title: 'Variación Presupuestaria', value: '€42K', unit: 'exceso', change: 8.3, changeType: 'negative', icon: 'trending-up', target: '€0', status: 'critical' }
  ];

  const viewOptions = [
    { value: 'overview', label: 'Vista General', icon: 'layout-dashboard' },
    { value: 'equipment', label: 'Equipos', icon: 'monitor' },
    { value: 'inventory', label: 'Inventario', icon: 'package' },
    { value: 'costs', label: 'Costos', icon: 'euro' },
    { value: 'allocation', label: 'Asignación', icon: 'users' }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setLastUpdated(new Date());
    };
    loadDashboardData();
  }, [globalFilters]);

  useEffect(() => {
    if (globalFilters?.refreshInterval === 'manual') return;
    const intervalMap = { '5min': 5 * 60 * 1000, '10min': 10 * 60 * 1000, '15min': 15 * 60 * 1000, '30min': 30 * 60 * 1000, '1hour': 60 * 60 * 1000 };
    const interval = setInterval(() => setLastUpdated(new Date()), intervalMap?.[globalFilters?.refreshInterval] || 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [globalFilters?.refreshInterval]);

  const handleFiltersChange = (newFilters) => {
    setGlobalFilters(prev => ({ ...prev, ...newFilters }));
    if (newFilters?.forceRefresh) setLastUpdated(new Date());
  };

  const handleKPICardClick = (title) => console.log(`Navegando a detalles de: ${title}`);
  const handleEmergencyMode = () => console.log('Activando modo de emergencia para recursos críticos');

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <Helmet><title>Centro de Recursos - SIGCA-E Analytics</title><meta name="description" content="Dashboard de utilización de recursos hospitalarios con análisis de equipos, inventario y costos operativos" /></Helmet>
          <div className="flex items-center justify-center min-h-screen"><div className="text-center space-y-4"><Icon name="loader-2" size={48} className="animate-spin text-primary mx-auto" /><div><h2 className="text-lg font-semibold text-foreground">Cargando Centro de Recursos</h2><p className="text-sm text-muted-foreground">Preparando análisis de utilización...</p></div></div></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <Helmet><title>Centro de Recursos - SIGCA-E Analytics</title><meta name="description" content="Dashboard de utilización de recursos hospitalarios con análisis de equipos, inventario y costos operativos" /><meta name="keywords" content="recursos hospitalarios, utilización equipos, inventario médico, costos operativos, eficiencia hospitalaria" /></Helmet>
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-clinical"><Icon name="bar-chart-3" size={24} className="text-primary" /></div>
                <div><h1 className="text-2xl font-bold text-foreground">Centro de Utilización de Recursos</h1><p className="text-sm text-muted-foreground">Monitoreo de eficiencia operativa y análisis de costos hospitalarios</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm"><p className="text-muted-foreground">Última actualización</p><p className="font-medium text-foreground">{lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p></div>
                <Button variant="destructive" size="sm" iconName="alert-triangle" iconPosition="left" onClick={handleEmergencyMode}>Modo Emergencia</Button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {viewOptions.map((option) => (
                <button key={option.value} onClick={() => setActiveView(option.value)} className={`flex items-center space-x-2 px-4 py-2 rounded-clinical text-sm font-medium transition-all duration-200 ${activeView === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}><Icon name={option.icon} size={16} /><span>{option.label}</span></button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GlobalControlsPanel onFiltersChange={handleFiltersChange} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {kpiData.map((kpi, index) => (
              <ResourceKPICard key={index} {...kpi} onClick={() => handleKPICardClick(kpi.title)} />
            ))}
          </div>
          {(activeView === 'overview' || activeView === 'equipment') && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <EquipmentStatusGrid className="xl:col-span-1" />
              <InventoryLevelsChart className="xl:col-span-1" />
              <CostAnalysisVisualization className="xl:col-span-1" />
            </div>
          )}
          {activeView === 'equipment' && <EquipmentStatusGrid className="mb-8" />}
          {activeView === 'inventory' && <InventoryLevelsChart className="mb-8" />}
          {activeView === 'costs' && <CostAnalysisVisualization className="mb-8" />}
          {(activeView === 'overview' || activeView === 'allocation') && <ResourceAllocationTable />}
          {activeView === 'allocation' && <ResourceAllocationTable />}
        </div>
      </div>
    </Layout>
  );
};

export default ResourceUtilizationHub;