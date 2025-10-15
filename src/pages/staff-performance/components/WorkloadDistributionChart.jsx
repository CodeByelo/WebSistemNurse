import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const WorkloadDistributionChart = ({ dateRange, selectedDepartments }) => {
  const [selectedView, setSelectedView] = useState('unit');
  const [selectedMetric, setSelectedMetric] = useState('workload');

  const workloadData = [
    {
      name: 'UCI',
      workload: 85,
      patientOutcomes: 4.8,
      staffCount: 12,
      avgHours: 8.5,
      satisfaction: 4.7
    },
    {
      name: 'Emergencias',
      workload: 92,
      patientOutcomes: 4.6,
      staffCount: 18,
      avgHours: 9.2,
      satisfaction: 4.5
    },
    {
      name: 'Cardiología',
      workload: 78,
      patientOutcomes: 4.9,
      staffCount: 8,
      avgHours: 8.0,
      satisfaction: 4.8
    },
    {
      name: 'Pediatría',
      workload: 70,
      patientOutcomes: 4.9,
      staffCount: 10,
      avgHours: 7.8,
      satisfaction: 4.9
    },
    {
      name: 'Cirugía',
      workload: 88,
      patientOutcomes: 4.7,
      staffCount: 15,
      avgHours: 8.8,
      satisfaction: 4.6
    },
    {
      name: 'Medicina Interna',
      workload: 82,
      patientOutcomes: 4.8,
      staffCount: 14,
      avgHours: 8.3,
      satisfaction: 4.7
    }
  ];

  const shiftData = [
    {
      name: '07:00-15:00',
      workload: 85,
      patientOutcomes: 4.8,
      staffCount: 45,
      avgHours: 8.0,
      satisfaction: 4.8
    },
    {
      name: '15:00-23:00',
      workload: 78,
      patientOutcomes: 4.7,
      staffCount: 38,
      avgHours: 8.2,
      satisfaction: 4.6
    },
    {
      name: '23:00-07:00',
      workload: 65,
      patientOutcomes: 4.6,
      staffCount: 25,
      avgHours: 8.5,
      satisfaction: 4.5
    }
  ];

  const individualData = [
    {
      name: 'Ana García',
      workload: 95,
      patientOutcomes: 4.9,
      staffCount: 1,
      avgHours: 8.2,
      satisfaction: 4.8
    },
    {
      name: 'Carlos López',
      workload: 88,
      patientOutcomes: 4.7,
      staffCount: 1,
      avgHours: 8.5,
      satisfaction: 4.6
    },
    {
      name: 'María Rodríguez',
      workload: 92,
      patientOutcomes: 4.8,
      staffCount: 1,
      avgHours: 8.0,
      satisfaction: 4.9
    },
    {
      name: 'José Martínez',
      workload: 85,
      patientOutcomes: 4.6,
      staffCount: 1,
      avgHours: 8.8,
      satisfaction: 4.5
    },
    {
      name: 'Laura Sánchez',
      workload: 90,
      patientOutcomes: 4.8,
      staffCount: 1,
      avgHours: 8.3,
      satisfaction: 4.7
    }
  ];

  const getCurrentData = () => {
    switch (selectedView) {
      case 'shift':
        return shiftData;
      case 'individual':
        return individualData;
      default:
        return workloadData;
    }
  };

  const viewOptions = [
    { value: 'unit', label: 'Por Unidad', icon: 'building' },
    { value: 'shift', label: 'Por Turno', icon: 'clock' },
    { value: 'individual', label: 'Individual', icon: 'user' }
  ];

  const metricOptions = [
    { value: 'workload', label: 'Carga de Trabajo', color: '#2563EB' },
    { value: 'satisfaction', label: 'Satisfacción', color: '#059669' },
    { value: 'avgHours', label: 'Horas Promedio', color: '#F59E0B' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-foreground">
                {entry?.value}
                {entry?.dataKey === 'patientOutcomes' ? '/5' : 
                 entry?.dataKey === 'workload' ? '%' : 
                 entry?.dataKey === 'avgHours' ? 'h' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Distribución de Carga de Trabajo
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis de carga laboral y resultados de pacientes por {selectedView === 'unit' ? 'unidad' : selectedView === 'shift' ? 'turno' : 'personal'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Vista:</span>
            <div className="flex bg-muted rounded-lg p-1">
              {viewOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => setSelectedView(option?.value)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedView === option?.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={option?.icon} size={16} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Métrica:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e?.target?.value)}
              className="bg-input border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {metricOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={getCurrentData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="workload" 
              fill="#2563EB" 
              name="Carga de Trabajo (%)"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="patientOutcomes" 
              stroke="#059669" 
              strokeWidth={3}
              name="Resultados Pacientes"
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="trending-up" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Mejor Rendimiento</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {selectedView === 'unit' ? 'Pediatría' : selectedView === 'shift' ? '07:00-15:00' : 'Ana García'}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedView === 'unit' ? '4.9/5 resultados' : selectedView === 'shift' ? '4.8/5 satisfacción' : '4.9/5 resultados'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="alert-triangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Requiere Atención</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {selectedView === 'unit' ? 'Emergencias' : selectedView === 'shift' ? '23:00-07:00' : 'José Martínez'}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedView === 'unit' ? '92% carga trabajo' : selectedView === 'shift' ? '4.5/5 satisfacción' : '8.8h promedio'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="users" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Personal Total</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {getCurrentData()?.reduce((sum, item) => sum + item?.staffCount, 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            Enfermeros/as activos
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkloadDistributionChart;