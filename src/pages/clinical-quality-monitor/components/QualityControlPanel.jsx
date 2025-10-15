import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const QualityControlPanel = ({ 
  selectedFacility, 
  onFacilityChange, 
  selectedPeriod, 
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
  lastUpdated,
  isLoading 
}) => {
  const facilityOptions = [
    { value: 'all', label: 'Todas las Instalaciones' },
    { value: 'main_hospital', label: 'Hospital Principal' },
    { value: 'emergency_center', label: 'Centro de Emergencias' },
    { value: 'outpatient_clinic', label: 'Clínica Ambulatoria' },
    { value: 'pediatric_wing', label: 'Ala Pediátrica' }
  ];

  const periodOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'last_7_days', label: 'Últimos 7 días' },
    { value: 'last_30_days', label: 'Últimos 30 días' },
    { value: 'last_quarter', label: 'Último trimestre' },
    { value: 'last_year', label: 'Último año' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'safety', label: 'Seguridad del Paciente' },
    { value: 'outcomes', label: 'Resultados Clínicos' },
    { value: 'compliance', label: 'Cumplimiento Normativo' },
    { value: 'efficiency', label: 'Eficiencia Operacional' },
    { value: 'satisfaction', label: 'Satisfacción del Paciente' }
  ];

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)}h`;
    
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="building" size={20} className="text-muted-foreground" />
            <Select
              value={selectedFacility}
              onChange={onFacilityChange}
              options={facilityOptions}
              className="min-w-[200px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="calendar" size={20} className="text-muted-foreground" />
            <Select
              value={selectedPeriod}
              onChange={onPeriodChange}
              options={periodOptions}
              className="min-w-[180px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="filter" size={20} className="text-muted-foreground" />
            <Select
              value={selectedCategory}
              onChange={onCategoryChange}
              options={categoryOptions}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {/* Right Section - Actions and Status */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Última actualización:</div>
            <div className="text-sm font-medium text-foreground">
              {formatLastUpdated(lastUpdated)}
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' :'hover:bg-primary/90 hover:shadow-md'
            }`}
          >
            <Icon 
              name="refresh-cw" 
              size={16} 
              className={isLoading ? 'animate-spin' : ''} 
            />
            <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success">98.2%</div>
            <div className="text-xs text-muted-foreground">Cumplimiento General</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">24</div>
            <div className="text-xs text-muted-foreground">Métricas Activas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">3</div>
            <div className="text-xs text-muted-foreground">Alertas Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">15 min</div>
            <div className="text-xs text-muted-foreground">Frecuencia de Datos</div>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {(selectedFacility !== 'all' || selectedCategory !== 'all' || selectedPeriod !== 'last_30_days') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="filter" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {selectedFacility !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {facilityOptions?.find(f => f?.value === selectedFacility)?.label}
                  <button 
                    onClick={() => onFacilityChange('all')}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {categoryOptions?.find(c => c?.value === selectedCategory)?.label}
                  <button 
                    onClick={() => onCategoryChange('all')}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              )}
              {selectedPeriod !== 'last_30_days' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {periodOptions?.find(p => p?.value === selectedPeriod)?.label}
                  <button 
                    onClick={() => onPeriodChange('last_30_days')}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityControlPanel;