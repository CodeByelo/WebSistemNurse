import React from 'react';
import Icon from '../AppIcon';

const AlertNotificationBadge = ({ 
  count = 0, 
  severity = 'info', 
  position = 'top-right',
  size = 'default',
  showIcon = true,
  onClick,
  className = ''
}) => {
  if (count === 0) return null;

  const severityConfig = {
    critical: {
      bg: 'bg-error',
      text: 'text-error-foreground',
      icon: 'alert-triangle',
      animation: 'animate-pulse-error'
    },
    warning: {
      bg: 'bg-warning',
      text: 'text-warning-foreground',
      icon: 'alert-circle',
      animation: 'animate-pulse-warning'
    },
    info: {
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      icon: 'info',
      animation: ''
    },
    success: {
      bg: 'bg-success',
      text: 'text-success-foreground',
      icon: 'check-circle',
      animation: 'animate-pulse-success'
    }
  };

  const sizeConfig = {
    sm: {
      badge: 'w-4 h-4 text-xs',
      icon: 12
    },
    default: {
      badge: 'w-5 h-5 text-xs',
      icon: 14
    },
    lg: {
      badge: 'w-6 h-6 text-sm',
      icon: 16
    }
  };

  const positionConfig = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  const config = severityConfig?.[severity];
  const sizeStyles = sizeConfig?.[size];
  const positionStyles = positionConfig?.[position];

  const displayCount = count > 99 ? '99+' : count?.toString();

  return (
    <div
      className={`absolute ${positionStyles} inline-flex items-center justify-center ${sizeStyles?.badge} ${config?.bg} ${config?.text} font-bold rounded-full border-2 border-background shadow-clinical cursor-pointer transition-all duration-200 hover:scale-110 ${config?.animation} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${count} ${severity} alerts`}
      onKeyDown={(e) => {
        if (e?.key === 'Enter' || e?.key === ' ') {
          onClick?.(e);
        }
      }}
    >
      {showIcon && count <= 9 ? (
        <Icon 
          name={config?.icon} 
          size={sizeStyles?.icon} 
          strokeWidth={2.5}
        />
      ) : (
        <span className="leading-none">{displayCount}</span>
      )}
    </div>
  );
};

export default AlertNotificationBadge;