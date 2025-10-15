import React from 'react';
import Icon from '../../../components/AppIcon';

const ResourceKPICard = ({ 
  title, 
  value, 
  unit = '', 
  change, 
  changeType = 'neutral', 
  icon, 
  target,
  status = 'normal',
  onClick,
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-error bg-error/5';
      case 'warning':
        return 'border-warning bg-warning/5';
      case 'success':
        return 'border-success bg-success/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  return (
    <div
      className={`p-6 rounded-clinical border-2 transition-all duration-200 hover:shadow-clinical cursor-pointer ${getStatusColor()} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-clinical ${status === 'critical' ? 'bg-error text-error-foreground' : status === 'warning' ? 'bg-warning text-warning-foreground' : status === 'success' ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
        </div>
        {status !== 'normal' && (
          <div className={`p-1 rounded-full ${status === 'critical' ? 'bg-error' : status === 'warning' ? 'bg-warning' : 'bg-success'}`}>
            <Icon 
              name={status === 'critical' ? 'alert-triangle' : status === 'warning' ? 'alert-circle' : 'check-circle'} 
              size={12} 
              color="white" 
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>

        {change !== undefined && (
          <div className="flex items-center space-x-2">
            <Icon name={getChangeIcon()} size={14} className={getChangeColor()} />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {Math.abs(change)}% vs mes anterior
            </span>
          </div>
        )}

        {target && (
          <div className="text-xs text-muted-foreground">
            Objetivo: {target}{unit}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceKPICard;