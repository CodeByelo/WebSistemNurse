import React, { useState } from 'react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CostAnalysisVisualization = ({ className = '' }) => {
  const [selectedView, setSelectedView] = useState('breakdown');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const costBreakdownData = [
    { name: 'Personal', value: 450000, percentage: 45, color: '#2563EB', budget: 480000 },
    { name: 'Medicamentos', value: 180000, percentage: 18, color: '#10B981', budget: 170000 },
    { name: 'Equipos Médicos', value: 120000, percentage: 12, color: '#F59E0B', budget: 110000 },
    { name: 'Suministros', value: 90000, percentage: 9, color: '#EF4444', budget: 95000 },
    { name: 'Mantenimiento', value: 80000, percentage: 8, color: '#8B5CF6', budget: 85000 },
    { name: 'Servicios', value: 50000, percentage: 5, color: '#06B6D4', budget: 55000 },
    { name: 'Otros', value: 30000, percentage: 3, color: '#84CC16', budget: 35000 }
  ];

  const monthlyTrendData = [
    { month: 'Ene', actual: 980000, budget: 1000000, variance: -20000 },
    { month: 'Feb', actual: 1050000, budget: 1000000, variance: 50000 },
    { month: 'Mar', actual: 920000, budget: 1000000, variance: -80000 },
    { month: 'Abr', actual: 1100000, budget: 1000000, variance: 100000 },
    { month: 'May', actual: 980000, budget: 1000000, variance: -20000 },
    { month: 'Jun', actual: 1000000, budget: 1000000, variance: 0 }
  ];

  const departmentCosts = [
    {
      name: 'UCI',
      totalCost: 280000,
      budgetedCost: 270000,
      variance: 10000,
      costPerPatient: 3500,
      patientDays: 80,
      categories: {
        personal: 140000,
        medicamentos: 60000,
        equipos: 50000,
        suministros: 30000
      }
    },
    {
      name: 'Urgencias',
      totalCost: 220000,
      budgetedCost: 230000,
      variance: -10000,
      costPerPatient: 1100,
      patientDays: 200,
      categories: {
        personal: 120000,
        medicamentos: 40000,
        equipos: 35000,
        suministros: 25000
      }
    },
    {
      name: 'Cirugía',
      totalCost: 180000,
      budgetedCost: 175000,
      variance: 5000,
      costPerPatient: 4500,
      patientDays: 40,
      categories: {
        personal: 80000,
        medicamentos: 35000,
        equipos: 45000,
        suministros: 20000
      }
    },
    {
      name: 'Medicina Interna',
      totalCost: 150000,
      budgetedCost: 160000,
      variance: -10000,
      costPerPatient: 1250,
      patientDays: 120,
      categories: {
        personal: 85000,
        medicamentos: 30000,
        equipos: 20000,
        suministros: 15000
      }
    }
  ];

  const kpiData = [
    {
      title: 'Costo por Paciente/Día',
      value: '€1,875',
      change: -5.2,
      changeType: 'positive',
      target: '€1,950',
      icon: 'euro'
    },
    {
      title: 'Variación Presupuestaria',
      value: '€40K',
      change: 2.1,
      changeType: 'negative',
      target: '€0',
      icon: 'trending-up'
    },
    {
      title: 'Eficiencia Operativa',
      value: '87.5%',
      change: 3.8,
      changeType: 'positive',
      target: '90%',
      icon: 'target'
    },
    {
      title: 'ROI Equipos Médicos',
      value: '12.8%',
      change: 1.2,
      changeType: 'positive',
      target: '15%',
      icon: 'trending-up'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-clinical p-3 shadow-clinical">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: €{entry?.value?.toLocaleString('es-ES')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-clinical p-3 shadow-clinical">
          <p className="font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            €{data?.value?.toLocaleString('es-ES')} ({data?.percentage}%)
          </p>
          <p className="text-xs text-muted-foreground">
            Presupuesto: €{data?.budget?.toLocaleString('es-ES')}
          </p>
        </div>
      );
    }
    return null;
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-error';
    if (variance < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return 'trending-up';
    if (variance < 0) return 'trending-down';
    return 'minus';
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Análisis de Costos</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedView === 'breakdown' ? 'default' : 'outline'}
              size="xs"
              iconName="pie-chart"
              onClick={() => setSelectedView('breakdown')}
            >
              Desglose
            </Button>
            <Button
              variant={selectedView === 'trends' ? 'default' : 'outline'}
              size="xs"
              iconName="trending-up"
              onClick={() => setSelectedView('trends')}
            >
              Tendencias
            </Button>
            <Button
              variant={selectedView === 'departments' ? 'default' : 'outline'}
              size="xs"
              iconName="building"
              onClick={() => setSelectedView('departments')}
            >
              Departamentos
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData?.map((kpi, index) => (
            <div key={index} className="bg-muted/30 border border-border rounded-clinical p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name={kpi?.icon} size={20} className="text-primary" />
                <span className={`text-xs font-medium ${
                  kpi?.changeType === 'positive' ? 'text-success' : 'text-error'
                }`}>
                  {kpi?.change > 0 ? '+' : ''}{kpi?.change}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{kpi?.title}</p>
                <p className="text-lg font-bold text-foreground">{kpi?.value}</p>
                <p className="text-xs text-muted-foreground">Objetivo: {kpi?.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6">
        {selectedView === 'breakdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Distribución de Costos</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {costBreakdownData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Detalle por Categoría</h4>
              <div className="space-y-3">
                {costBreakdownData?.map((item, index) => {
                  const variance = item?.value - item?.budget;
                  const variancePercentage = ((variance / item?.budget) * 100)?.toFixed(1);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-clinical">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item?.color }}
                        />
                        <div>
                          <p className="font-medium text-foreground text-sm">{item?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item?.percentage}% del total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          €{item?.value?.toLocaleString('es-ES')}
                        </p>
                        <p className={`text-xs ${getVarianceColor(variance)}`}>
                          <Icon 
                            name={getVarianceIcon(variance)} 
                            size={10} 
                            className="inline mr-1" 
                          />
                          {variancePercentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'trends' && (
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Tendencia Mensual de Costos</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `€${(value / 1000)?.toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    name="Costo Real"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Presupuesto"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Variance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyTrendData?.slice(-3)?.map((month, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded-clinical p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{month?.month}</h5>
                    <Icon 
                      name={getVarianceIcon(month?.variance)} 
                      size={16} 
                      className={getVarianceColor(month?.variance)}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Real:</span>
                      <span className="font-medium">€{(month?.actual / 1000)?.toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Presupuesto:</span>
                      <span className="font-medium">€{(month?.budget / 1000)?.toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Variación:</span>
                      <span className={`font-medium ${getVarianceColor(month?.variance)}`}>
                        €{(Math.abs(month?.variance) / 1000)?.toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'departments' && (
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Costos por Departamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departmentCosts?.map((dept, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded-clinical p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-foreground">{dept?.name}</h5>
                    <span className={`text-sm font-medium ${getVarianceColor(dept?.variance)}`}>
                      <Icon 
                        name={getVarianceIcon(dept?.variance)} 
                        size={14} 
                        className="inline mr-1" 
                      />
                      €{(Math.abs(dept?.variance) / 1000)?.toFixed(0)}K
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Costo Total</span>
                      <span className="font-medium text-foreground">
                        €{dept?.totalCost?.toLocaleString('es-ES')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Costo por Paciente</span>
                      <span className="font-medium text-foreground">
                        €{dept?.costPerPatient?.toLocaleString('es-ES')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Días Paciente</span>
                      <span className="font-medium text-foreground">{dept?.patientDays}</span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Distribución de Costos</p>
                      <div className="space-y-1">
                        {Object.entries(dept?.categories)?.map(([category, amount], catIndex) => (
                          <div key={catIndex} className="flex justify-between text-xs">
                            <span className="text-muted-foreground capitalize">{category}:</span>
                            <span className="font-medium">€{(amount / 1000)?.toFixed(0)}K</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostAnalysisVisualization;