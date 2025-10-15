import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import FilterControls from './components/FilterControls';
import MetricsStrip from './components/MetricsStrip';
import WorkloadDistributionChart from './components/WorkloadDistributionChart';
import StaffLeaderboard from './components/StaffLeaderboard';
import SchedulingHeatmap from './components/SchedulingHeatmap';
import Layout from './Layout';

const StaffPerformanceAnalytics = () => {
  const [dateRange, setDateRange] = useState('last7days');
  const [selectedDepartments, setSelectedDepartments] = useState(['all']);
  const [comparisonMode, setComparisonMode] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleExport = () => {
    const csvContent = `data:text/csv;charset=utf-8,Reporte,Análisis de Rendimiento del Personal\nFecha Generación,${new Date().toLocaleDateString('es-ES')}\nRango de Fechas,${dateRange}\nDepartamentos,${selectedDepartments.join(', ')}\nModo Comparación,${comparisonMode}\n\nMétricas Principales:\nRatio de Personal,1:4.2\nHoras Extra,127.5h\nSatisfacción Paciente,4.7/5\nCumplimiento Documentación,94.8%`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `staff_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatLastUpdated = () => lastUpdated.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <Helmet><title>Análisis de Rendimiento del Personal - SIGCA-E Analytics</title><meta name="description" content="Dashboard de análisis de rendimiento del personal de enfermería con métricas de productividad, satisfacción y eficiencia operacional" /></Helmet>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Icon name="users" size={24} className="text-primary" /></div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Análisis de Rendimiento del Personal</h1>
                  <p className="text-muted-foreground">Métricas de productividad y eficiencia del equipo de enfermería</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Icon name="clock" size={16} /><span>Última actualización: {formatLastUpdated()}</span>{isLoading && <Icon name="loader-2" size={16} className="animate-spin text-primary" />}</div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-success rounded-full animate-pulse-success"></div><span className="text-sm text-success font-medium">Sistema Activo</span></div>
            </div>
          </div>
          <FilterControls dateRange={dateRange} setDateRange={setDateRange} selectedDepartments={selectedDepartments} setSelectedDepartments={setSelectedDepartments} comparisonMode={comparisonMode} setComparisonMode={setComparisonMode} onExport={handleExport} onRefresh={handleRefresh} />
          <MetricsStrip dateRange={dateRange} selectedDepartments={selectedDepartments} />
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            <div className="xl:col-span-8"><WorkloadDistributionChart dateRange={dateRange} selectedDepartments={selectedDepartments} /></div>
            <div className="xl:col-span-4"><StaffLeaderboard dateRange={dateRange} selectedDepartments={selectedDepartments} /></div>
          </div>
          <SchedulingHeatmap dateRange={dateRange} selectedDepartments={selectedDepartments} />
        </div>
      </div>
    </Layout>
  );
};

export default StaffPerformanceAnalytics;