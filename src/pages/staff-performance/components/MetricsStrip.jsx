import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ dateRange, selectedDepartments }) => {
  const metrics = [
    {
      id: 'staffing_ratio',
      title: 'Ratio de Personal',
      value: '1:4.2',
      change: -0.3,
      changeType: 'improvement',
      target: '1:4.0',
      icon: 'users',
      description: 'Pacientes por enfermero/a'
    },
    {
      id: 'overtime_hours',
      title: 'Horas Extra',
      value: '127.5h',
      change: 15.2,
      changeType: 'concern',
      target: '< 100h',
      icon: 'clock',
      description: 'Total semanal'
    },
    {
      id: 'patient_satisfaction',
      title: 'Satisfacción Paciente',
      value: '4.7/5',
      change: 0.2,
      changeType: 'improvement',
      target: '> 4.5',
      icon: 'heart',
      description: 'Promedio mensual'
    },
    {
      id: 'documentation_compliance',
      title: 'Cumplimiento Documentación',
      value: '94.8%',
      change: 2.1,
      changeType: 'improvement',
      target: '> 95%',
      icon: 'clipboard-check',
      description: 'Registros completos'
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'improvement':
        return 'text-success';
      case 'concern':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType, change) => {
    if (changeType === 'improvement') {
      return change > 0 ? 'trending-up' : 'trending-down';
    } else if (changeType === 'concern') {
      return change > 0 ? 'trending-up' : 'trending-down';
    }
    return 'minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card rounded-lg border border-border p-6 clinical-hover"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon 
                  name={metric?.icon} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric?.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                {metric?.value}
              </span>
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric?.changeType)}`}>
                <Icon 
                  name={getChangeIcon(metric?.changeType, metric?.change)} 
                  size={16} 
                />
                <span>
                  {Math.abs(metric?.change)}
                  {metric?.id === 'overtime_hours' ? 'h' : metric?.id === 'documentation_compliance' ? '%' : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Objetivo: {metric?.target}
              </span>
              <span className={`font-medium ${
                metric?.changeType === 'improvement' ? 'text-success' : 
                metric?.changeType === 'concern' ? 'text-error' : 'text-muted-foreground'
              }`}>
                {metric?.changeType === 'improvement' ? 'En objetivo' : 
                 metric?.changeType === 'concern' ? 'Requiere atención' : 'Estable'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;