import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const FloorPlanVisualization = ({ selectedUnit, onBedClick }) => {
  const [selectedFloor, setSelectedFloor] = useState('floor1');
  const [hoveredBed, setHoveredBed] = useState(null);

  // Mock bed data with patient information
  const bedData = {
    floor1: [
      { id: 'A101', patient: 'Juan Pérez', risk: 'high', los: 5, status: 'occupied', acuity: 4 },
      { id: 'A102', patient: 'María García', risk: 'medium', los: 2, status: 'occupied', acuity: 3 },
      { id: 'A103', patient: null, risk: 'low', los: 0, status: 'available', acuity: 0 },
      { id: 'A104', patient: 'Carlos López', risk: 'critical', los: 8, status: 'occupied', acuity: 5 },
      { id: 'A105', patient: null, risk: 'low', los: 0, status: 'maintenance', acuity: 0 },
      { id: 'A106', patient: 'Ana Martín', risk: 'medium', los: 3, status: 'occupied', acuity: 3 },
      { id: 'B201', patient: 'Luis Rodríguez', risk: 'high', los: 6, status: 'occupied', acuity: 4 },
      { id: 'B202', patient: null, risk: 'low', los: 0, status: 'available', acuity: 0 },
      { id: 'B203', patient: 'Carmen Ruiz', risk: 'medium', los: 1, status: 'occupied', acuity: 2 },
      { id: 'B204', patient: 'Miguel Torres', risk: 'critical', los: 12, status: 'occupied', acuity: 5 },
      { id: 'B205', patient: null, risk: 'low', los: 0, status: 'cleaning', acuity: 0 },
      { id: 'B206', patient: 'Isabel Moreno', risk: 'low', los: 1, status: 'occupied', acuity: 2 }
    ]
  };

  const floorOptions = [
    { value: 'floor1', label: 'Planta 1 - UCI' },
    { value: 'floor2', label: 'Planta 2 - Cardiología' },
    { value: 'floor3', label: 'Planta 3 - Cirugía' }
  ];

  const getBedStatusConfig = (bed) => {
    const configs = {
      occupied: {
        bg: bed?.risk === 'critical' ? 'bg-error' : 
            bed?.risk === 'high' ? 'bg-warning' : 
            bed?.risk === 'medium' ? 'bg-primary' : 'bg-success',
        border: 'border-border',
        text: 'text-white'
      },
      available: {
        bg: 'bg-muted',
        border: 'border-border',
        text: 'text-muted-foreground'
      },
      maintenance: {
        bg: 'bg-secondary',
        border: 'border-secondary',
        text: 'text-secondary-foreground'
      },
      cleaning: {
        bg: 'bg-accent/20',
        border: 'border-accent',
        text: 'text-accent'
      }
    };
    return configs?.[bed?.status] || configs?.available;
  };

  const getLOSHeatColor = (los) => {
    if (los === 0) return 'opacity-50';
    if (los <= 2) return 'opacity-60';
    if (los <= 5) return 'opacity-80';
    return 'opacity-100';
  };

  const BedTooltip = ({ bed }) => {
    if (!bed) return null;

    return (
      <div className="absolute z-50 bg-popover border border-border rounded-lg p-3 shadow-lg min-w-[200px] pointer-events-none">
        <div className="font-semibold text-sm mb-2">Cama {bed?.id}</div>
        {bed?.patient ? (
          <div className="space-y-1 text-xs">
            <div><strong>Paciente:</strong> {bed?.patient}</div>
            <div><strong>Riesgo:</strong> 
              <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                bed?.risk === 'critical' ? 'bg-error text-error-foreground' :
                bed?.risk === 'high' ? 'bg-warning text-warning-foreground' :
                bed?.risk === 'medium' ? 'bg-primary text-primary-foreground' :
                'bg-success text-success-foreground'
              }`}>
                {bed?.risk === 'critical' ? 'Crítico' :
                 bed?.risk === 'high' ? 'Alto' :
                 bed?.risk === 'medium' ? 'Medio' : 'Bajo'}
              </span>
            </div>
            <div><strong>Estancia:</strong> {bed?.los} días</div>
            <div><strong>Acuidad:</strong> {bed?.acuity}/5</div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {bed?.status === 'available' ? 'Disponible' :
             bed?.status === 'maintenance' ? 'En mantenimiento' :
             bed?.status === 'cleaning' ? 'En limpieza' : 'No disponible'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Plano de Planta - Ocupación de Camas
        </h3>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e?.target?.value)}
            className="text-sm bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {floorOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="info" size={14} />
            <span>Hover para detalles</span>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error rounded"></div>
          <span className="text-xs">Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-warning rounded"></div>
          <span className="text-xs">Alto Riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-xs">Riesgo Medio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success rounded"></div>
          <span className="text-xs">Bajo Riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted border border-border rounded"></div>
          <span className="text-xs">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary rounded"></div>
          <span className="text-xs">Mantenimiento</span>
        </div>
      </div>
      {/* Floor Plan Grid */}
      <div className="relative">
        <div className="grid grid-cols-6 gap-4 min-h-[400px] p-4 bg-muted/20 rounded-lg">
          {bedData?.[selectedFloor]?.map((bed, index) => {
            const config = getBedStatusConfig(bed);
            const heatColor = getLOSHeatColor(bed?.los);
            
            return (
              <div
                key={bed?.id}
                className={`relative ${config?.bg} ${config?.border} border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${heatColor}`}
                onMouseEnter={(e) => setHoveredBed({ bed, x: e?.clientX, y: e?.clientY })}
                onMouseLeave={() => setHoveredBed(null)}
                onClick={() => onBedClick?.(bed)}
              >
                <div className={`text-center ${config?.text}`}>
                  <div className="font-semibold text-sm mb-1">{bed?.id}</div>
                  
                  {bed?.patient ? (
                    <div className="space-y-1">
                      <div className="text-xs truncate">{bed?.patient}</div>
                      <div className="flex items-center justify-center gap-1">
                        <Icon 
                          name={bed?.risk === 'critical' ? 'alert-triangle' : 
                                bed?.risk === 'high' ? 'alert-circle' : 
                                bed?.risk === 'medium' ? 'info' : 'check-circle'} 
                          size={12} 
                        />
                        <span className="text-xs">{bed?.los}d</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs">
                      {bed?.status === 'available' ? 'Libre' :
                       bed?.status === 'maintenance' ? 'Mant.' :
                       bed?.status === 'cleaning' ? 'Limp.' : 'N/D'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredBed && (
          <div 
            className="fixed z-50"
            style={{ 
              left: hoveredBed?.x + 10, 
              top: hoveredBed?.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <BedTooltip bed={hoveredBed?.bed} />
          </div>
        )}
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {bedData?.[selectedFloor]?.filter(b => b?.status === 'occupied')?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground">Ocupadas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {bedData?.[selectedFloor]?.filter(b => b?.status === 'available')?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground">Disponibles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-error">
            {bedData?.[selectedFloor]?.filter(b => b?.risk === 'critical')?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground">Críticos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {bedData?.[selectedFloor]?.reduce((sum, b) => sum + b?.los, 0) / bedData?.[selectedFloor]?.filter(b => b?.status === 'occupied')?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground">Estancia Media</div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanVisualization;