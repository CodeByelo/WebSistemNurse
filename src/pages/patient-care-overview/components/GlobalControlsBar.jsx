import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const GlobalControlsBar = ({ 
  selectedUnit, 
  onUnitChange, 
  currentShift, 
  onShiftChange, 
  autoRefresh, 
  onAutoRefreshChange,
  refreshInterval,
  onRefreshIntervalChange,
  onManualRefresh,
  lastUpdated 
}) => {
  const unitOptions = [
    { value: 'all', label: 'Todas las Unidades' },
    { value: 'icu', label: 'UCI - Unidad de Cuidados Intensivos' },
    { value: 'emergency', label: 'Urgencias' },
    { value: 'surgery', label: 'Cirugía' },
    { value: 'cardiology', label: 'Cardiología' },
    { value: 'pediatrics', label: 'Pediatría' },
    { value: 'maternity', label: 'Maternidad' },
    { value: 'oncology', label: 'Oncología' }
  ];

  const shiftOptions = [
    { value: 'day', label: 'Día (7:00 - 19:00)' },
    { value: 'evening', label: 'Tarde (19:00 - 23:00)' },
    { value: 'night', label: 'Noche (23:00 - 7:00)' }
  ];

  const refreshIntervalOptions = [
    { value: 5, label: '5 minutos' },
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' }
  ];

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `Hace ${diff}s`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    return timestamp?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Unidad"
              options={unitOptions}
              value={selectedUnit}
              onChange={onUnitChange}
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <Select
              label="Turno"
              options={shiftOptions}
              value={currentShift}
              onChange={onShiftChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => onAutoRefreshChange(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="autoRefresh" className="text-sm font-medium text-foreground">
                Auto-actualizar
              </label>
            </div>
            {autoRefresh && (
              <Select
                options={refreshIntervalOptions}
                value={refreshInterval}
                onChange={onRefreshIntervalChange}
                className="min-w-[120px]"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Última actualización: {formatLastUpdated(lastUpdated)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onManualRefresh}
              iconName="refresh-cw"
              iconPosition="left"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-muted-foreground">Conexión en tiempo real activa</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Próxima actualización: {autoRefresh ? `${refreshInterval} min` : 'Manual'}
        </div>
      </div>
    </div>
  );
};

export default GlobalControlsBar;