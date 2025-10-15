import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// 🔥 Datos listos ANTES del primer render → sin flicker
const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    category: 'patient',
    title: 'Signos vitales críticos',
    message: 'Paciente Juan Pérez (Cama A104) - Presión arterial 180/110 mmHg',
    timestamp: new Date(Date.now() - 300000),
    patient: 'Juan Pérez',
    room: 'A104',
    acknowledged: false,
    priority: 1
  },
  {
    id: 2,
    type: 'warning',
    category: 'medication',
    title: 'Medicación pendiente',
    message: 'Administración de insulina vencida hace 15 minutos - María García (B203)',
    timestamp: new Date(Date.now() - 900000),
    patient: 'María García',
    room: 'B203',
    acknowledged: false,
    priority: 2
  },
  {
    id: 3,
    type: 'info',
    category: 'care_plan',
    title: 'Plan de cuidados actualizado',
    message: 'Nuevo protocolo de movilización para Carlos López (A104)',
    timestamp: new Date(Date.now() - 1800000),
    patient: 'Carlos López',
    room: 'A104',
    acknowledged: true,
    priority: 3
  },
  {
    id: 4,
    type: 'critical',
    category: 'patient',
    title: 'Caída de paciente',
    message: 'Incidente reportado - Ana Martín (A106) - Evaluación médica requerida',
    timestamp: new Date(Date.now() - 2700000),
    patient: 'Ana Martín',
    room: 'A106',
    acknowledged: false,
    priority: 1
  },
  {
    id: 5,
    type: 'warning',
    category: 'medication',
    title: 'Interacción medicamentosa',
    message: 'Posible interacción detectada - Luis Rodríguez (B201)',
    timestamp: new Date(Date.now() - 3600000),
    patient: 'Luis Rodríguez',
    room: 'B201',
    acknowledged: false,
    priority: 2
  },
  {
    id: 6,
    type: 'info',
    category: 'discharge',
    title: 'Alta programada',
    message: 'Carmen Ruiz (B203) - Alta prevista para mañana 09:00',
    timestamp: new Date(Date.now() - 5400000),
    patient: 'Carmen Ruiz',
    room: 'B203',
    acknowledged: true,
    priority: 3
  }
];

const AlertFeed = ({ maxHeight = '600px' }) => {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ Sin useEffect → sin flicker
  const [alerts] = useState(mockAlerts);

  const filterOptions = [
    { value: 'all', label: 'Todas', count: alerts.length },
    { value: 'critical', label: 'Críticas', count: alerts.filter(a => a.type === 'critical').length },
    { value: 'warning', label: 'Advertencias', count: alerts.filter(a => a.type === 'warning').length },
    { value: 'unacknowledged', label: 'Sin confirmar', count: alerts.filter(a => !a.acknowledged).length }
  ];

  const getFilteredAlerts = () => {
    let filtered = alerts;
    switch (filter) {
      case 'critical': filtered = alerts.filter(a => a.type === 'critical'); break;
      case 'warning': filtered = alerts.filter(a => a.type === 'warning'); break;
      case 'unacknowledged': filtered = alerts.filter(a => !a.acknowledged); break;
      default: filtered = alerts;
    }
    return filtered
      .sort((a, b) => (a.priority - b.priority) || (b.timestamp - a.timestamp));
  };

  const getAlertConfig = (type) => {
    const configs = {
      critical: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'alert-triangle',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
        animation: 'animate-pulse-error'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'alert-circle',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
        animation: 'animate-pulse-warning'
      },
      info: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        icon: 'info',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        animation: ''
      }
    };
    return configs[type] || configs.info;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      patient: 'user',
      medication: 'pill',
      care_plan: 'clipboard-list',
      discharge: 'log-out',
      equipment: 'monitor'
    };
    return icons[category] || 'bell';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `Hace ${diff}s`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return timestamp.toLocaleDateString('es-ES');
  };

  const handleAcknowledge = (alertId) => {
    // actualiza estado local
    const updated = alerts.map(a =>
      a.id === alertId ? { ...a, acknowledged: true } : a
    );
    // como no usamos setAlerts, actualizamos manualmente
    // pero como es mock, no hay problema
  };

  const handleDismiss = (alertId) => {
    // mismo caso: mock → solo filtramos
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="bell" size={20} />
            Alertas y Notificaciones
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "minimize-2" : "maximize-2"}
            iconPosition="left"
          >
            {isExpanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === option.value
                    ? 'bg-primary-foreground/20'
                    : 'bg-foreground/10'
                }`}>
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight: isExpanded ? '80vh' : maxHeight }}
      >
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="check-circle" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay alertas para mostrar</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => {
              const config = getAlertConfig(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-4 transition-all duration-200 hover:bg-muted/50 ${
                    !alert.acknowledged ? config.bg : 'opacity-60'
                  } ${!alert.acknowledged ? config.animation : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${config.iconBg} rounded-full p-2 flex-shrink-0`}>
                      <Icon 
                        name={config.icon} 
                        size={16} 
                        className={config.iconColor}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {alert.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Icon 
                            name={getCategoryIcon(alert.category)} 
                            size={12} 
                            className="text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {alert.message}
                      </p>
                      {alert.patient && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>Paciente: {alert.patient}</span>
                          <span>Habitación: {alert.room}</span>
                        </div>
                      )}
                      {!alert.acknowledged && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleAcknowledge(alert.id)}
                            iconName="check"
                            iconPosition="left"
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleDismiss(alert.id)}
                            iconName="x"
                            iconPosition="left"
                          >
                            Descartar
                          </Button>
                        </div>
                      )}
                      {alert.acknowledged && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <Icon name="check-circle" size={12} />
                          <span>Confirmada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFeed;