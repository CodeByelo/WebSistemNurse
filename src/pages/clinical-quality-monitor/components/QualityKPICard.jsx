import React from 'react';
import Icon from '../../../components/AppIcon';

const QualityKPICard = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  trendValue, 
  benchmark, 
  status = 'normal',
  icon,
  description,
  onClick 
}) => {
  const getStatusConfig = () => {
    const configs = {
      excellent: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        text: 'text-success',
        icon: 'trending-up'
      },
      good: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        icon: 'trending-up'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        icon: 'alert-triangle'
      },
      critical: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        text: 'text-error',
        icon: 'trending-down'
      },
      normal: {
        bg: 'bg-muted/50',
        border: 'border-border',
        text: 'text-foreground',
        icon: 'minus'
      }
    };
    return configs?.[status] || configs?.normal;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'minus';
  };

  const getTrendColor = () => {
    if (trend === 'up' && status === 'excellent') return 'text-success';
    if (trend === 'up' && status === 'critical') return 'text-error';
    if (trend === 'down' && status === 'excellent') return 'text-error';
    if (trend === 'down' && status === 'critical') return 'text-success';
    return 'text-muted-foreground';
  };

  const config = getStatusConfig();

  return (
    <div 
      className={`${config?.bg} ${config?.border} border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] clinical-hover`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${config?.bg} ${config?.border} border`}>
            <Icon name={icon} size={20} className={config?.text} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <div className={`p-1 rounded ${config?.bg}`}>
          <Icon name={config?.icon} size={16} className={config?.text} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        {trendValue && (
          <div className="flex items-center space-x-2">
            <Icon name={getTrendIcon()} size={14} className={getTrendColor()} />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trendValue}
            </span>
            <span className="text-xs text-muted-foreground">vs período anterior</span>
          </div>
        )}

        {benchmark && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Referencia:</span>
              <span className="font-medium text-foreground">{benchmark}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityKPICard;