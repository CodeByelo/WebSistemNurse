import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentIncidentsList = ({ incidents, onIncidentClick, onViewAll }) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        icon: 'alert-triangle'
      },
      high: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        icon: 'alert-circle'
      },
      medium: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        icon: 'info'
      },
      low: {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        icon: 'check-circle'
      }
    };
    return configs?.[severity] || configs?.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        label: 'Pendiente'
      },
      investigating: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        label: 'Investigando'
      },
      resolved: {
        bg: 'bg-success/10',
        text: 'text-success',
        label: 'Resuelto'
      },
      closed: {
        bg: 'bg-muted/50',
        text: 'text-muted-foreground',
        label: 'Cerrado'
      }
    };
    return configs?.[status] || configs?.pending;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const incidentDate = new Date(date);
    const diffInMinutes = Math.floor((now - incidentDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `hace ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `hace ${days}d`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Incidentes Recientes
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Eventos críticos que requieren atención
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Ver todos
        </button>
      </div>
      <div className="space-y-3">
        {incidents?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="check-circle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-muted-foreground">No hay incidentes recientes</p>
          </div>
        ) : (
          incidents?.map((incident) => {
            const severityConfig = getSeverityConfig(incident?.severity);
            const statusConfig = getStatusConfig(incident?.status);
            
            return (
              <div
                key={incident?.id}
                className="p-4 border border-border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 clinical-hover"
                onClick={() => onIncidentClick(incident)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${severityConfig?.bg} ${severityConfig?.border} border`}>
                      <Icon 
                        name={severityConfig?.icon} 
                        size={16} 
                        className={severityConfig?.text} 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{incident?.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {incident?.location} • {incident?.patient}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.bg} ${statusConfig?.text}`}>
                      {statusConfig?.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(incident?.timestamp)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {incident?.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="user" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {incident?.reportedBy}
                      </span>
                    </div>
                    {incident?.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <Icon name="user-check" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {incident?.assignedTo}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {incident?.hasAttachments && (
                      <Icon name="paperclip" size={14} className="text-muted-foreground" />
                    )}
                    {incident?.priority === 'urgent' && (
                      <div className="w-2 h-2 bg-error rounded-full animate-pulse-error" />
                    )}
                    <Icon name="chevron-right" size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {incidents?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-error rounded-full" />
                <span className="text-muted-foreground">
                  {incidents?.filter(i => i?.severity === 'critical')?.length} Críticos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-muted-foreground">
                  {incidents?.filter(i => i?.severity === 'high')?.length} Altos
                </span>
              </div>
            </div>
            <span className="text-muted-foreground">
              Mostrando {incidents?.length} de {incidents?.length + 15}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentIncidentsList;