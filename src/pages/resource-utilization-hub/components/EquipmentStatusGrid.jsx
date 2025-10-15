import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EquipmentStatusGrid = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const equipmentData = [
    {
      id: 'EQ001',
      name: 'Monitor Cardíaco MC-500',
      category: 'monitoring',
      location: 'UCI - Cama 12',
      status: 'operational',
      uptime: 98.5,
      lastMaintenance: '2024-09-15',
      nextMaintenance: '2024-10-15',
      utilization: 85,
      alerts: 0,
      model: 'Philips IntelliVue',
      serialNumber: 'PH2024001'
    },
    {
      id: 'EQ002',
      name: 'Ventilador Mecánico VM-300',
      category: 'respiratory',
      location: 'UCI - Cama 8',
      status: 'maintenance',
      uptime: 92.1,
      lastMaintenance: '2024-09-28',
      nextMaintenance: '2024-10-28',
      utilization: 0,
      alerts: 1,
      model: 'Dräger Evita',
      serialNumber: 'DR2024002'
    },
    {
      id: 'EQ003',
      name: 'Bomba de Infusión BI-200',
      category: 'infusion',
      location: 'Planta 3 - Hab 305',
      status: 'operational',
      uptime: 99.2,
      lastMaintenance: '2024-09-10',
      nextMaintenance: '2024-11-10',
      utilization: 72,
      alerts: 0,
      model: 'Baxter Sigma',
      serialNumber: 'BX2024003'
    },
    {
      id: 'EQ004',
      name: 'Desfibrilador DEF-400',
      category: 'emergency',
      location: 'Urgencias - Sala 2',
      status: 'alert',
      uptime: 89.7,
      lastMaintenance: '2024-09-20',
      nextMaintenance: '2024-10-05',
      utilization: 45,
      alerts: 2,
      model: 'Zoll X-Series',
      serialNumber: 'ZL2024004'
    },
    {
      id: 'EQ005',
      name: 'Ecógrafo ECO-600',
      category: 'imaging',
      location: 'Radiología - Sala A',
      status: 'operational',
      uptime: 96.8,
      lastMaintenance: '2024-09-05',
      nextMaintenance: '2024-12-05',
      utilization: 68,
      alerts: 0,
      model: 'GE Vivid',
      serialNumber: 'GE2024005'
    },
    {
      id: 'EQ006',
      name: 'Cama Eléctrica CE-100',
      category: 'furniture',
      location: 'Planta 2 - Hab 201',
      status: 'operational',
      uptime: 100,
      lastMaintenance: '2024-08-15',
      nextMaintenance: '2024-11-15',
      utilization: 90,
      alerts: 0,
      model: 'Hill-Rom Centrella',
      serialNumber: 'HR2024006'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos', icon: 'layers' },
    { value: 'monitoring', label: 'Monitoreo', icon: 'activity' },
    { value: 'respiratory', label: 'Respiratorio', icon: 'wind' },
    { value: 'infusion', label: 'Infusión', icon: 'droplets' },
    { value: 'emergency', label: 'Emergencia', icon: 'zap' },
    { value: 'imaging', label: 'Imagen', icon: 'scan' },
    { value: 'furniture', label: 'Mobiliario', icon: 'bed' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operativo',
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success',
          icon: 'check-circle'
        };
      case 'maintenance':
        return {
          label: 'Mantenimiento',
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning',
          icon: 'wrench'
        };
      case 'alert':
        return {
          label: 'Alerta',
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error',
          icon: 'alert-triangle'
        };
      default:
        return {
          label: 'Desconocido',
          color: 'text-muted-foreground',
          bg: 'bg-muted/10',
          border: 'border-muted',
          icon: 'help-circle'
        };
    }
  };

  const filteredEquipment = selectedCategory === 'all' 
    ? equipmentData 
    : equipmentData?.filter(eq => eq?.category === selectedCategory);

  const handleMaintenanceRequest = (equipmentId) => {
    console.log(`Solicitud de mantenimiento para equipo: ${equipmentId}`);
  };

  const EquipmentCard = ({ equipment }) => {
    const statusConfig = getStatusConfig(equipment?.status);
    
    return (
      <div className="bg-card border border-border rounded-clinical p-4 hover:shadow-clinical transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm mb-1">{equipment?.name}</h4>
            <p className="text-xs text-muted-foreground">{equipment?.model}</p>
            <p className="text-xs text-muted-foreground">{equipment?.location}</p>
          </div>
          <div className={`px-2 py-1 rounded-clinical text-xs font-medium ${statusConfig?.bg} ${statusConfig?.color} ${statusConfig?.border} border`}>
            <Icon name={statusConfig?.icon} size={12} className="inline mr-1" />
            {statusConfig?.label}
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Tiempo Activo</span>
            <span className="text-xs font-medium text-foreground">{equipment?.uptime}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${equipment?.uptime >= 95 ? 'bg-success' : equipment?.uptime >= 85 ? 'bg-warning' : 'bg-error'}`}
              style={{ width: `${equipment?.uptime}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Utilización</span>
            <span className="text-xs font-medium text-foreground">{equipment?.utilization}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${equipment?.utilization}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Próximo Mant.: {new Date(equipment.nextMaintenance)?.toLocaleDateString('es-ES')}</span>
          {equipment?.alerts > 0 && (
            <span className="text-error font-medium">
              <Icon name="alert-circle" size={12} className="inline mr-1" />
              {equipment?.alerts} alerta{equipment?.alerts > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="xs"
            iconName="wrench"
            iconPosition="left"
            onClick={() => handleMaintenanceRequest(equipment?.id)}
            className="flex-1"
          >
            Mantenimiento
          </Button>
          <Button
            variant="ghost"
            size="xs"
            iconName="eye"
            onClick={() => console.log(`Ver detalles: ${equipment?.id}`)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Estado de Equipos</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="xs"
              iconName="grid-3x3"
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="xs"
              iconName="list"
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-clinical text-sm font-medium transition-all duration-200 ${
                selectedCategory === category?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={category?.icon} size={14} />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment?.map((equipment) => (
              <EquipmentCard key={equipment?.id} equipment={equipment} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEquipment?.map((equipment) => {
              const statusConfig = getStatusConfig(equipment?.status);
              return (
                <div key={equipment?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-clinical">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-clinical ${statusConfig?.bg}`}>
                      <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{equipment?.name}</h4>
                      <p className="text-sm text-muted-foreground">{equipment?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{equipment?.uptime}%</p>
                      <p className="text-xs text-muted-foreground">Tiempo Activo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{equipment?.utilization}%</p>
                      <p className="text-xs text-muted-foreground">Utilización</p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="wrench"
                      onClick={() => handleMaintenanceRequest(equipment?.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredEquipment?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="search-x" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron equipos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentStatusGrid;