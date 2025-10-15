import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  dateRange, 
  setDateRange, 
  selectedDepartments, 
  setSelectedDepartments,
  comparisonMode,
  setComparisonMode,
  onExport,
  onRefresh 
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'last7days', label: 'Últimos 7 días' },
    { value: 'last30days', label: 'Últimos 30 días' },
    { value: 'thisMonth', label: 'Este mes' },
    { value: 'lastMonth', label: 'Mes anterior' },
    { value: 'thisQuarter', label: 'Este trimestre' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Todos los Departamentos' },
    { value: 'uci', label: 'UCI' },
    { value: 'emergencias', label: 'Emergencias' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'medicina_interna', label: 'Medicina Interna' },
    { value: 'oncologia', label: 'Oncología' },
    { value: 'neurologia', label: 'Neurología' }
  ];

  const shiftOptions = [
    { value: 'all', label: 'Todos los Turnos' },
    { value: 'day', label: 'Día (7:00-15:00)' },
    { value: 'evening', label: 'Tarde (15:00-23:00)' },
    { value: 'night', label: 'Noche (23:00-7:00)' }
  ];

  const comparisonOptions = [
    { value: 'none', label: 'Sin Comparación' },
    { value: 'previous_period', label: 'Período Anterior' },
    { value: 'same_period_last_year', label: 'Mismo Período Año Anterior' },
    { value: 'benchmark', label: 'Benchmark Hospitalario' }
  ];

  const handleDepartmentChange = (value) => {
    if (value === 'all') {
      setSelectedDepartments(['all']);
    } else {
      const newSelection = selectedDepartments?.includes('all') 
        ? [value]
        : selectedDepartments?.includes(value)
          ? selectedDepartments?.filter(dept => dept !== value)
          : [...selectedDepartments, value];
      
      setSelectedDepartments(newSelection?.length === 0 ? ['all'] : newSelection);
    }
  };

  const clearAllFilters = () => {
    setDateRange('last7days');
    setSelectedDepartments(['all']);
    setComparisonMode('none');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (dateRange !== 'last7days') count++;
    if (!selectedDepartments?.includes('all')) count++;
    if (comparisonMode !== 'none') count++;
    return count;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Date Range Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="calendar" size={16} className="text-muted-foreground" />
            <Select
              value={dateRange}
              onChange={setDateRange}
              options={dateRangeOptions}
              className="min-w-[160px]"
            />
          </div>

          {/* Department Multi-Select */}
          <div className="flex items-center space-x-2">
            <Icon name="building" size={16} className="text-muted-foreground" />
            <Select
              value={selectedDepartments?.[0]}
              onChange={handleDepartmentChange}
              options={departmentOptions}
              className="min-w-[180px]"
              multiple={!selectedDepartments?.includes('all')}
            />
            {!selectedDepartments?.includes('all') && selectedDepartments?.length > 1 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                {selectedDepartments?.length}
              </span>
            )}
          </div>

          {/* Comparison Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Icon name="git-compare" size={16} className="text-muted-foreground" />
            <Select
              value={comparisonMode}
              onChange={setComparisonMode}
              options={comparisonOptions}
              className="min-w-[160px]"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="filter" size={16} />
            <span>Filtros Avanzados</span>
            <Icon 
              name={isFiltersExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
            />
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="x"
              iconPosition="left"
            >
              Limpiar
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="refresh-cw"
            iconPosition="left"
          >
            Actualizar
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onExport}
            iconName="download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>
      </div>
      {/* Advanced Filters Panel */}
      {isFiltersExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Shift Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Turno
              </label>
              <Select
                value="all"
                onChange={() => {}}
                options={shiftOptions}
                className="w-full"
              />
            </div>

            {/* Performance Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rango de Rendimiento
              </label>
              <Select
                value="all"
                onChange={() => {}}
                options={[
                  { value: 'all', label: 'Todos los Niveles' },
                  { value: 'excellent', label: 'Excelente (>95%)' },
                  { value: 'good', label: 'Bueno (85-95%)' },
                  { value: 'needs_improvement', label: 'Requiere Mejora (<85%)' }
                ]}
                className="w-full"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nivel de Experiencia
              </label>
              <Select
                value="all"
                onChange={() => {}}
                options={[
                  { value: 'all', label: 'Todos los Niveles' },
                  { value: 'junior', label: 'Junior (0-2 años)' },
                  { value: 'mid', label: 'Intermedio (3-7 años)' },
                  { value: 'senior', label: 'Senior (8+ años)' }
                ]}
                className="w-full"
              />
            </div>

            {/* Certification Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estado de Certificaciones
              </label>
              <Select
                value="all"
                onChange={() => {}}
                options={[
                  { value: 'all', label: 'Todos los Estados' },
                  { value: 'current', label: 'Certificaciones Vigentes' },
                  { value: 'expiring', label: 'Por Vencer (30 días)' },
                  { value: 'expired', label: 'Vencidas' }
                ]}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Filtros Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Alto Rendimiento', icon: 'trending-up' },
                { label: 'Nuevos Empleados', icon: 'user-plus' },
                { label: 'Certificaciones Pendientes', icon: 'alert-circle' },
                { label: 'Horas Extra Altas', icon: 'clock' },
                { label: 'Satisfacción Baja', icon: 'frown' }
              ]?.map((preset, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <Icon name={preset?.icon} size={14} />
                  <span>{preset?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="filter" size={14} />
            <span>Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {dateRange !== 'last7days' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
                </span>
              )}
              {!selectedDepartments?.includes('all') && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {selectedDepartments?.length} departamento(s)
                </span>
              )}
              {comparisonMode !== 'none' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {comparisonOptions?.find(opt => opt?.value === comparisonMode)?.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;