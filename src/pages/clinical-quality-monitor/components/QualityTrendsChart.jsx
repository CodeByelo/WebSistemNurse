import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const QualityTrendsChart = ({ data, selectedMetrics, onMetricToggle, targets }) => {
  const metricConfig = {
    infectionRate: {
      name: 'Tasa de Infección',
      color: '#DC2626',
      unit: '%',
      target: 2.5
    },
    medicationErrors: {
      name: 'Errores de Medicación',
      color: '#F59E0B',
      unit: 'por 1000',
      target: 5.0
    },
    patientFalls: {
      name: 'Caídas de Pacientes',
      color: '#7C3AED',
      unit: 'por 1000',
      target: 3.2
    },
    qualityScore: {
      name: 'Puntuación de Calidad',
      color: '#059669',
      unit: 'pts',
      target: 85
    },
    readmissionRate: {
      name: 'Tasa de Readmisión',
      color: '#DC2626',
      unit: '%',
      target: 12.0
    },
    mortalityRate: {
      name: 'Tasa de Mortalidad',
      color: '#991B1B',
      unit: '%',
      target: 2.1
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-popover-foreground">{entry?.name}:</span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                {entry?.value} {metricConfig?.[entry?.dataKey]?.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Tendencias de Calidad Clínica
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de indicadores clave de calidad a lo largo del tiempo
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(metricConfig)?.map(([key, config]) => (
            <button
              key={key}
              onClick={() => onMetricToggle(key)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedMetrics?.includes(key)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: config?.color }}
              />
              <span>{config?.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetrics?.map((metric) => {
              const config = metricConfig?.[metric];
              if (!config) return null;
              
              return (
                <React.Fragment key={metric}>
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={config?.color}
                    strokeWidth={2}
                    dot={{ fill: config?.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: config?.color, strokeWidth: 2 }}
                    name={config?.name}
                  />
                  {targets && targets?.[metric] && (
                    <ReferenceLine
                      y={targets?.[metric]}
                      stroke={config?.color}
                      strokeDasharray="5 5"
                      strokeOpacity={0.6}
                      label={{ value: `Meta: ${targets?.[metric]}${config?.unit}`, position: 'topRight' }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedMetrics?.map((metric) => {
          const config = metricConfig?.[metric];
          const latestValue = data?.[data?.length - 1]?.[metric];
          const previousValue = data?.[data?.length - 2]?.[metric];
          const change = latestValue && previousValue ? ((latestValue - previousValue) / previousValue * 100)?.toFixed(1) : null;
          
          return (
            <div key={metric} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: config?.color }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {config?.name}
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {latestValue} {config?.unit}
              </div>
              {change && (
                <div className={`text-xs ${
                  parseFloat(change) > 0 ? 'text-error' : 'text-success'
                }`}>
                  {parseFloat(change) > 0 ? '+' : ''}{change}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QualityTrendsChart;