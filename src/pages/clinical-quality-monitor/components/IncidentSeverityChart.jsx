import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const IncidentSeverityChart = ({ data, onSeverityClick }) => {
  const severityConfig = {
    critical: { color: '#DC2626', label: 'Crítico', icon: 'alert-triangle' },
    high: { color: '#F59E0B', label: 'Alto', icon: 'alert-circle' },
    medium: { color: '#3B82F6', label: 'Medio', icon: 'info' },
    low: { color: '#10B981', label: 'Bajo', icon: 'check-circle' }
  };

  const chartData = Object.entries(data)?.map(([severity, count]) => ({
    name: severityConfig?.[severity]?.label || severity,
    value: count,
    severity,
    color: severityConfig?.[severity]?.color || '#6B7280'
  }));

  const total = chartData?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const percentage = ((data?.value / total) * 100)?.toFixed(1);
      
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data?.color }}
            />
            <span className="font-medium text-popover-foreground">{data?.name}</span>
          </div>
          <p className="text-sm text-popover-foreground">
            {data?.value} incidentes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for slices < 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Distribución por Severidad
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Incidentes por nivel de gravedad
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-xs text-muted-foreground">Total incidentes</div>
        </div>
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onClick={(data) => onSeverityClick(data?.severity)}
              className="cursor-pointer"
            >
              {chartData?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry?.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {chartData?.map((item) => {
          const percentage = ((item?.value / total) * 100)?.toFixed(1);
          const config = severityConfig?.[item?.severity];
          
          return (
            <div 
              key={item?.severity}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors duration-200"
              onClick={() => onSeverityClick(item?.severity)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  />
                  <Icon name={config?.icon || 'circle'} size={16} className="text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">{item?.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">{item?.value}</div>
                <div className="text-xs text-muted-foreground">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Última actualización:</span>
          <span className="font-medium text-foreground">
            {new Date()?.toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IncidentSeverityChart;