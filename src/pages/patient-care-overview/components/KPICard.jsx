import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  status = 'normal',
  onClick,
  loading = false 
}) => {
  const statusConfig = {
    normal: {
      bg: 'bg-card',
      border: 'border-border',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground'
    },
    warning: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-warning'
    },
    critical: {
      bg: 'bg-error/5',
      border: 'border-error/20',
      iconBg: 'bg-error/10',
      iconColor: 'text-error',
      valueColor: 'text-error'
    },
    success: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success'
    }
  };

  const config = statusConfig?.[status];

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const trendIcons = {
      up: 'trending-up',
      down: 'trending-down',
      stable: 'minus'
    };
    
    const trendColors = {
      up: status === 'critical' ? 'text-error' : 'text-success',
      down: status === 'critical' ? 'text-success' : 'text-error',
      stable: 'text-muted-foreground'
    };

    return (
      <div className={`flex items-center gap-1 ${trendColors?.[trend]}`}>
        <Icon name={trendIcons?.[trend]} size={14} />
        <span className="text-xs font-medium">{trendValue}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${config?.bg} ${config?.border} border rounded-lg p-6 shadow-sm animate-pulse`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
          <div className={`${config?.iconBg} rounded-lg p-3`}>
            <div className="w-6 h-6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${config?.bg} ${config?.border} border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </h3>
          
          <div className={`text-3xl font-bold ${config?.valueColor} mb-1`}>
            {value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-2">
              {subtitle}
            </p>
          )}
          
          {getTrendIcon()}
        </div>
        
        <div className={`${config?.iconBg} rounded-lg p-3`}>
          <Icon 
            name={icon} 
            size={24} 
            className={config?.iconColor}
          />
        </div>
      </div>
    </div>
  );
};

export default KPICard;