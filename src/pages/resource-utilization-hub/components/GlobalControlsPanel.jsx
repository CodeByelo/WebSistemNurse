import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControlsPanel = ({ onFiltersChange, className = '' }) => {
  const [selectedCostCenter, setSelectedCostCenter] = useState('all');
  const [selectedFiscalPeriod, setSelectedFiscalPeriod] = useState('current_month');
  const [utilizationThreshold, setUtilizationThreshold] = useState('standard');
  const [refreshInterval, setRefreshInterval] = useState('10min');
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const costCenterOptions = [
    { value: 'all', label: 'Todos los Centros de Costo' },
    { value: 'uci', label: 'Unidad de Cuidados Intensivos' },
    { value: 'urgencias', label: 'Servicio de Urgencias' },
    { value: 'cirugia', label: 'Departamento de Cirugía' },
    { value: 'medicina_interna', label: 'Medicina Interna' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'ginecologia', label: 'Ginecología y Obstetricia' },
    { value: 'radiologia', label: 'Radiología e Imagen' },
    { value: 'laboratorio', label: 'Laboratorio Clínico' },
    { value: 'farmacia', label: 'Farmacia Hospitalaria' }
  ];

  const fiscalPeriodOptions = [
    { value: 'current_month', label: 'Mes Actual (Octubre 2024)' },
    { value: 'last_month', label: 'Mes Anterior (Septiembre 2024)' },
    { value: 'current_quarter', label: 'Trimestre Actual (Q4 2024)' },
    { value: 'last_quarter', label: 'Trimestre Anterior (Q3 2024)' },
    { value: 'current_year', label: 'Año Actual (2024)' },
    { value: 'last_year', label: 'Año Anterior (2023)' },
    { value: 'ytd', label: 'Año hasta la Fecha' },
    { value: 'custom', label: 'Período Personalizado' }
  ];

  const thresholdOptions = [
    { value: 'conservative', label: 'Conservador (70-85%)' },
    { value: 'standard', label: 'Estándar (75-90%)' },
    { value: 'aggressive', label: 'Agresivo (80-95%)' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const refreshIntervalOptions = [
    { value: '5min', label: 'Cada 5 minutos' },
    { value: '10min', label: 'Cada 10 minutos' },
    { value: '15min', label: 'Cada 15 minutos' },
    { value: '30min', label: 'Cada 30 minutos' },
    { value: '1hour', label: 'Cada hora' },
    { value: 'manual', label: 'Manual' }
  ];

  const handleFilterChange = (filterType, value) => {
    const filters = {
      costCenter: selectedCostCenter,
      fiscalPeriod: selectedFiscalPeriod,
      utilizationThreshold,
      refreshInterval,
      alertsEnabled
    };

    filters[filterType] = value;

    switch (filterType) {
      case 'costCenter':
        setSelectedCostCenter(value);
        break;
      case 'fiscalPeriod':
        setSelectedFiscalPeriod(value);
        break;
      case 'utilizationThreshold':
        setUtilizationThreshold(value);
        break;
      case 'refreshInterval':
        setRefreshInterval(value);
        break;
      case 'alertsEnabled':
        setAlertsEnabled(value);
        break;
    }

    onFiltersChange?.(filters);
  };

  const handleRefreshData = () => {
    console.log('Actualizando datos del dashboard...');
    // Trigger data refresh
    onFiltersChange?.({
      costCenter: selectedCostCenter,
      fiscalPeriod: selectedFiscalPeriod,
      utilizationThreshold,
      refreshInterval,
      alertsEnabled,
      forceRefresh: true
    });
  };

  const handleExportReport = () => {
    console.log('Exportando reporte completo...');
    // Generate comprehensive report
  };

  const getThresholdDescription = () => {
    switch (utilizationThreshold) {
      case 'conservative':
        return 'Rangos de utilización conservadores para máxima estabilidad';
      case 'standard':
        return 'Rangos de utilización estándar balanceando eficiencia y estabilidad';
      case 'aggressive':
        return 'Rangos de utilización agresivos para máxima eficiencia';
      case 'custom':
        return 'Rangos de utilización personalizados según configuración';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-clinical">
              <Icon name="settings" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Controles Globales</h2>
              <p className="text-sm text-muted-foreground">
                Configuración y filtros para el análisis de recursos
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="refresh-cw"
              iconPosition="left"
              onClick={handleRefreshData}
            >
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="download"
              iconPosition="left"
              onClick={handleExportReport}
            >
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cost Center Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Centro de Costo
            </label>
            <Select
              value={selectedCostCenter}
              onChange={(value) => handleFilterChange('costCenter', value)}
              options={costCenterOptions}
              placeholder="Seleccionar centro de costo"
            />
            <p className="text-xs text-muted-foreground">
              Filtrar recursos por departamento o unidad específica
            </p>
          </div>

          {/* Fiscal Period Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Período Fiscal
            </label>
            <Select
              value={selectedFiscalPeriod}
              onChange={(value) => handleFilterChange('fiscalPeriod', value)}
              options={fiscalPeriodOptions}
              placeholder="Seleccionar período"
            />
            <p className="text-xs text-muted-foreground">
              Período de tiempo para el análisis de costos y utilización
            </p>
          </div>

          {/* Utilization Threshold Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Umbral de Utilización
            </label>
            <Select
              value={utilizationThreshold}
              onChange={(value) => handleFilterChange('utilizationThreshold', value)}
              options={thresholdOptions}
              placeholder="Seleccionar umbral"
            />
            <p className="text-xs text-muted-foreground">
              {getThresholdDescription()}
            </p>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Intervalo de Actualización
            </label>
            <Select
              value={refreshInterval}
              onChange={(value) => handleFilterChange('refreshInterval', value)}
              options={refreshIntervalOptions}
              placeholder="Seleccionar intervalo"
            />
            <p className="text-xs text-muted-foreground">
              Frecuencia de actualización automática de datos
            </p>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Configuración Avanzada</h3>
            <Button
              variant="ghost"
              size="xs"
              iconName={alertsEnabled ? 'bell' : 'bell-off'}
              onClick={() => handleFilterChange('alertsEnabled', !alertsEnabled)}
              className={alertsEnabled ? 'text-primary' : 'text-muted-foreground'}
            >
              {alertsEnabled ? 'Alertas Activas' : 'Alertas Desactivadas'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Filters Summary */}
            <div className="bg-muted/30 rounded-clinical p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Filtros Activos</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Centro: {costCenterOptions?.find(opt => opt?.value === selectedCostCenter)?.label}</div>
                <div>Período: {fiscalPeriodOptions?.find(opt => opt?.value === selectedFiscalPeriod)?.label}</div>
                <div>Umbral: {thresholdOptions?.find(opt => opt?.value === utilizationThreshold)?.label}</div>
              </div>
            </div>

            {/* Data Status */}
            <div className="bg-muted/30 rounded-clinical p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Estado de Datos</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Última actualización:</span>
                  <span className="text-foreground font-medium">18:25</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Próxima actualización:</span>
                  <span className="text-foreground font-medium">18:35</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-success" />
                  <span className="text-xs text-success">Datos en tiempo real</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-muted/30 rounded-clinical p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Acciones Rápidas</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="bookmark"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('Guardar configuración actual')}
                >
                  Guardar Vista
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="rotate-ccw"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('Restaurar configuración por defecto')}
                >
                  Restaurar Defecto
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="share"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('Compartir configuración')}
                >
                  Compartir Vista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControlsPanel;