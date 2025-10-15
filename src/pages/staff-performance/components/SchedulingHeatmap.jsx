import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SchedulingHeatmap = ({ dateRange, selectedDepartments }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('efficiency');

  const departments = ['UCI', 'Emergencias', 'Cardiología', 'Pediatría', 'Cirugía', 'Medicina Interna'];
  const shifts = ['07:00-15:00', '15:00-23:00', '23:00-07:00'];
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Mock scheduling efficiency data (0-100%)
  const schedulingData = {
    efficiency: {
      'UCI': [92, 88, 85, 90, 87, 82, 78, 95, 91, 89, 93, 88, 85, 80, 94, 90, 87, 92, 89, 86, 83],
      'Emergencias': [85, 82, 78, 88, 85, 80, 75, 90, 87, 84, 89, 86, 82, 78, 88, 85, 81, 87, 84, 80, 77],
      'Cardiología': [95, 92, 89, 94, 91, 88, 85, 97, 94, 91, 96, 93, 90, 87, 95, 92, 89, 94, 91, 88, 85],
      'Pediatría': [88, 85, 82, 90, 87, 84, 81, 92, 89, 86, 91, 88, 85, 82, 90, 87, 84, 89, 86, 83, 80],
      'Cirugía': [90, 87, 84, 92, 89, 86, 83, 94, 91, 88, 93, 90, 87, 84, 92, 89, 86, 91, 88, 85, 82],
      'Medicina Interna': [87, 84, 81, 89, 86, 83, 80, 91, 88, 85, 90, 87, 84, 81, 89, 86, 83, 88, 85, 82, 79]
    },
    coverage: {
      'UCI': [98, 95, 92, 97, 94, 91, 88, 99, 96, 93, 98, 95, 92, 89, 97, 94, 91, 96, 93, 90, 87],
      'Emergencias': [95, 92, 89, 96, 93, 90, 87, 97, 94, 91, 96, 93, 90, 87, 95, 92, 89, 94, 91, 88, 85],
      'Cardiología': [99, 96, 93, 98, 95, 92, 89, 100, 97, 94, 99, 96, 93, 90, 98, 95, 92, 97, 94, 91, 88],
      'Pediatría': [96, 93, 90, 97, 94, 91, 88, 98, 95, 92, 97, 94, 91, 88, 96, 93, 90, 95, 92, 89, 86],
      'Cirugía': [97, 94, 91, 98, 95, 92, 89, 99, 96, 93, 98, 95, 92, 89, 97, 94, 91, 96, 93, 90, 87],
      'Medicina Interna': [94, 91, 88, 95, 92, 89, 86, 96, 93, 90, 95, 92, 89, 86, 94, 91, 88, 93, 90, 87, 84]
    }
  };

  const getHeatmapColor = (value, mode) => {
    const intensity = value / 100;
    
    if (mode === 'efficiency') {
      if (value >= 90) return `bg-success opacity-${Math.min(100, Math.round(intensity * 100))}`;
      if (value >= 80) return `bg-warning opacity-${Math.min(100, Math.round(intensity * 100))}`;
      return `bg-error opacity-${Math.min(100, Math.round(intensity * 100))}`;
    } else {
      if (value >= 95) return `bg-primary opacity-${Math.min(100, Math.round(intensity * 100))}`;
      if (value >= 85) return `bg-secondary opacity-${Math.min(100, Math.round(intensity * 100))}`;
      return `bg-muted opacity-${Math.min(100, Math.round(intensity * 100))}`;
    }
  };

  const getValueColor = (value, mode) => {
    if (mode === 'efficiency') {
      if (value >= 90) return 'text-success';
      if (value >= 80) return 'text-warning';
      return 'text-error';
    } else {
      if (value >= 95) return 'text-primary';
      if (value >= 85) return 'text-secondary';
      return 'text-muted-foreground';
    }
  };

  const getCurrentData = () => {
    return schedulingData?.[viewMode];
  };

  const getWeeklyAverage = (department) => {
    const data = getCurrentData()?.[department];
    return Math.round(data?.reduce((sum, val) => sum + val, 0) / data?.length);
  };

  const getShiftAverage = (shiftIndex) => {
    const allDepts = Object.values(getCurrentData());
    const shiftValues = allDepts?.map(dept => {
      const shiftData = [];
      for (let i = shiftIndex; i < dept?.length; i += 3) {
        shiftData?.push(dept?.[i]);
      }
      return shiftData?.reduce((sum, val) => sum + val, 0) / shiftData?.length;
    });
    return Math.round(shiftValues?.reduce((sum, val) => sum + val, 0) / shiftValues?.length);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Mapa de Calor - Programación de Turnos
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis de {viewMode === 'efficiency' ? 'eficiencia' : 'cobertura'} por departamento y turno
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Vista:</span>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('efficiency')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'efficiency' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="zap" size={16} />
                <span>Eficiencia</span>
              </button>
              <button
                onClick={() => setViewMode('coverage')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'coverage' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="shield-check" size={16} />
                <span>Cobertura</span>
              </button>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200">
            <Icon name="download" size={16} />
            <span>Exportar Reporte</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days and shifts */}
          <div className="grid grid-cols-22 gap-1 mb-4">
            <div className="col-span-1"></div>
            {weekDays?.map((day, dayIndex) => (
              <div key={day} className="col-span-3 text-center">
                <div className="text-sm font-medium text-foreground mb-1">{day}</div>
                <div className="grid grid-cols-3 gap-1">
                  {shifts?.map((shift, shiftIndex) => (
                    <div key={shiftIndex} className="text-xs text-muted-foreground p-1 bg-muted/30 rounded">
                      {shift?.split('-')?.[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap data */}
          <div className="space-y-2">
            {departments?.map((department, deptIndex) => (
              <div key={department} className="grid grid-cols-22 gap-1 items-center">
                <div className="col-span-1 text-sm font-medium text-foreground pr-4">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{department}</span>
                    <span className={`text-xs font-bold ${getValueColor(getWeeklyAverage(department), viewMode)}`}>
                      {getWeeklyAverage(department)}%
                    </span>
                  </div>
                </div>
                
                {weekDays?.map((day, dayIndex) => (
                  <div key={day} className="col-span-3 grid grid-cols-3 gap-1">
                    {shifts?.map((shift, shiftIndex) => {
                      const dataIndex = dayIndex * 3 + shiftIndex;
                      const value = getCurrentData()?.[department]?.[dataIndex];
                      
                      return (
                        <div
                          key={shiftIndex}
                          className={`relative h-12 rounded-md border border-border cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${getHeatmapColor(value, viewMode)}`}
                          title={`${department} - ${day} ${shift}: ${value}%`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xs font-bold ${value > 50 ? 'text-white' : 'text-foreground'}`}>
                              {value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Shift averages */}
          <div className="grid grid-cols-22 gap-1 mt-4 pt-4 border-t border-border">
            <div className="col-span-1 text-sm font-medium text-muted-foreground">
              Promedio Turno
            </div>
            {weekDays?.map((day, dayIndex) => (
              <div key={day} className="col-span-3 grid grid-cols-3 gap-1">
                {shifts?.map((shift, shiftIndex) => {
                  const avgValue = getShiftAverage(shiftIndex);
                  
                  return (
                    <div
                      key={shiftIndex}
                      className="h-8 bg-muted/50 rounded-md flex items-center justify-center border border-border"
                    >
                      <span className={`text-xs font-bold ${getValueColor(avgValue, viewMode)}`}>
                        {avgValue}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend and summary */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Leyenda:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${viewMode === 'efficiency' ? 'bg-success' : 'bg-primary'}`}></div>
                <span className="text-xs text-muted-foreground">Excelente (&gt;90%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${viewMode === 'efficiency' ? 'bg-warning' : 'bg-secondary'}`}></div>
                <span className="text-xs text-muted-foreground">Bueno (80-90%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${viewMode === 'efficiency' ? 'bg-error' : 'bg-muted'}`}></div>
                <span className="text-xs text-muted-foreground">Requiere Atención (&lt;80%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {Math.round(
                Object.values(getCurrentData())?.flat()?.reduce((sum, val) => sum + val, 0) / 
                Object.values(getCurrentData())?.flat()?.length
              )}%
            </p>
            <p className="text-xs text-muted-foreground">Promedio General</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-success">
              {Object.values(getCurrentData())?.flat()?.filter(val => val >= 90)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Turnos Excelentes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-error">
              {Object.values(getCurrentData())?.flat()?.filter(val => val < 80)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Requieren Atención</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingHeatmap;