import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryLevelsChart = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const inventoryData = [
    {
      category: 'Medicamentos',
      currentStock: 2450,
      minLevel: 1500,
      maxLevel: 3000,
      reorderPoint: 1800,
      turnoverRate: 8.5,
      costValue: 125000,
      trend: 'stable',
      items: [
        { name: 'Paracetamol 500mg', stock: 850, min: 500, status: 'normal' },
        { name: 'Ibuprofeno 400mg', stock: 320, min: 300, status: 'low' },
        { name: 'Amoxicilina 500mg', stock: 180, min: 200, status: 'critical' }
      ]
    },
    {
      category: 'Material Quirúrgico',
      currentStock: 1850,
      minLevel: 1200,
      maxLevel: 2500,
      reorderPoint: 1400,
      turnoverRate: 12.3,
      costValue: 89000,
      trend: 'increasing',
      items: [
        { name: 'Guantes Estériles', stock: 2500, min: 1000, status: 'normal' },
        { name: 'Mascarillas N95', stock: 450, min: 500, status: 'low' },
        { name: 'Jeringas 10ml', stock: 1200, min: 800, status: 'normal' }
      ]
    },
    {
      category: 'Equipos Médicos',
      currentStock: 95,
      minLevel: 80,
      maxLevel: 120,
      reorderPoint: 85,
      turnoverRate: 2.1,
      costValue: 450000,
      trend: 'decreasing',
      items: [
        { name: 'Termómetros Digitales', stock: 25, min: 20, status: 'normal' },
        { name: 'Tensiómetros', stock: 15, min: 18, status: 'critical' },
        { name: 'Oxímetros', stock: 35, min: 25, status: 'normal' }
      ]
    },
    {
      category: 'Material de Curas',
      currentStock: 3200,
      minLevel: 2000,
      maxLevel: 4000,
      reorderPoint: 2300,
      turnoverRate: 15.7,
      costValue: 32000,
      trend: 'stable',
      items: [
        { name: 'Gasas Estériles', stock: 1500, min: 800, status: 'normal' },
        { name: 'Vendas Elásticas', stock: 650, min: 400, status: 'normal' },
        { name: 'Apósitos Adhesivos', stock: 280, min: 300, status: 'low' }
      ]
    }
  ];

  const monthlyTrendData = [
    { month: 'Ene', medicamentos: 2200, quirurgico: 1650, equipos: 88, curas: 2800 },
    { month: 'Feb', medicamentos: 2350, quirurgico: 1720, equipos: 92, curas: 3100 },
    { month: 'Mar', medicamentos: 2180, quirurgico: 1580, equipos: 89, curas: 2950 },
    { month: 'Abr', medicamentos: 2420, quirurgico: 1780, equipos: 94, curas: 3200 },
    { month: 'May', medicamentos: 2380, quirurgico: 1850, equipos: 91, curas: 3050 },
    { month: 'Jun', medicamentos: 2450, quirurgico: 1850, equipos: 95, curas: 3200 }
  ];

  const categories = [
    { value: 'all', label: 'Todas las Categorías', color: '#2563EB' },
    { value: 'medicamentos', label: 'Medicamentos', color: '#10B981' },
    { value: 'quirurgico', label: 'Material Quirúrgico', color: '#F59E0B' },
    { value: 'equipos', label: 'Equipos Médicos', color: '#EF4444' },
    { value: 'curas', label: 'Material de Curas', color: '#8B5CF6' }
  ];

  const getStockStatus = (current, min, reorder) => {
    if (current <= min) return { status: 'critical', color: 'text-error', bg: 'bg-error/10' };
    if (current <= reorder) return { status: 'low', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'normal', color: 'text-success', bg: 'bg-success/10' };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'trending-up';
      case 'decreasing': return 'trending-down';
      default: return 'minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-success';
      case 'decreasing': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-clinical p-3 shadow-clinical">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value?.toLocaleString('es-ES')} unidades
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Niveles de Inventario</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="xs"
              iconName="bar-chart-3"
              onClick={() => setChartType('bar')}
            />
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="xs"
              iconName="trending-up"
              onClick={() => setChartType('line')}
            />
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="xs"
              iconName="area-chart"
              onClick={() => setChartType('area')}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories?.map((category) => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-clinical text-sm font-medium transition-all duration-200 ${
                selectedCategory === category?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category?.color }}
              />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {/* Chart Section */}
        <div className="mb-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedCategory === 'all' ? (
                    <>
                      <Bar dataKey="medicamentos" fill="#10B981" name="Medicamentos" />
                      <Bar dataKey="quirurgico" fill="#F59E0B" name="Material Quirúrgico" />
                      <Bar dataKey="equipos" fill="#EF4444" name="Equipos Médicos" />
                      <Bar dataKey="curas" fill="#8B5CF6" name="Material de Curas" />
                    </>
                  ) : (
                    <Bar 
                      dataKey={selectedCategory} 
                      fill={categories?.find(c => c?.value === selectedCategory)?.color || '#2563EB'} 
                      name={categories?.find(c => c?.value === selectedCategory)?.label || 'Categoría'}
                    />
                  )}
                </BarChart>
              ) : chartType === 'line' ? (
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
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedCategory === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="medicamentos" stroke="#10B981" strokeWidth={2} name="Medicamentos" />
                      <Line type="monotone" dataKey="quirurgico" stroke="#F59E0B" strokeWidth={2} name="Material Quirúrgico" />
                      <Line type="monotone" dataKey="equipos" stroke="#EF4444" strokeWidth={2} name="Equipos Médicos" />
                      <Line type="monotone" dataKey="curas" stroke="#8B5CF6" strokeWidth={2} name="Material de Curas" />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={selectedCategory} 
                      stroke={categories?.find(c => c?.value === selectedCategory)?.color || '#2563EB'} 
                      strokeWidth={2}
                      name={categories?.find(c => c?.value === selectedCategory)?.label || 'Categoría'}
                    />
                  )}
                </LineChart>
              ) : (
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedCategory === 'all' ? (
                    <>
                      <Area type="monotone" dataKey="medicamentos" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Medicamentos" />
                      <Area type="monotone" dataKey="quirurgico" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Material Quirúrgico" />
                      <Area type="monotone" dataKey="equipos" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Equipos Médicos" />
                      <Area type="monotone" dataKey="curas" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Material de Curas" />
                    </>
                  ) : (
                    <Area 
                      type="monotone" 
                      dataKey={selectedCategory} 
                      stroke={categories?.find(c => c?.value === selectedCategory)?.color || '#2563EB'} 
                      fill={categories?.find(c => c?.value === selectedCategory)?.color || '#2563EB'}
                      fillOpacity={0.6}
                      name={categories?.find(c => c?.value === selectedCategory)?.label || 'Categoría'}
                    />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventoryData?.map((category, index) => {
            const stockStatus = getStockStatus(category?.currentStock, category?.minLevel, category?.reorderPoint);
            
            return (
              <div key={index} className="bg-muted/30 border border-border rounded-clinical p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground text-sm">{category?.category}</h4>
                  <div className={`p-1 rounded-clinical ${stockStatus?.bg}`}>
                    <Icon 
                      name={stockStatus?.status === 'critical' ? 'alert-triangle' : stockStatus?.status === 'low' ? 'alert-circle' : 'check-circle'} 
                      size={14} 
                      className={stockStatus?.color}
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Stock Actual</span>
                    <span className="text-sm font-medium text-foreground">
                      {category?.currentStock?.toLocaleString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stockStatus?.status === 'critical' ? 'bg-error' : 
                        stockStatus?.status === 'low' ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ 
                        width: `${Math.min((category?.currentStock / category?.maxLevel) * 100, 100)}%` 
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {category?.minLevel?.toLocaleString('es-ES')}</span>
                    <span>Max: {category?.maxLevel?.toLocaleString('es-ES')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Icon name={getTrendIcon(category?.trend)} size={12} className={getTrendColor(category?.trend)} />
                    <span className={getTrendColor(category?.trend)}>
                      Rotación: {category?.turnoverRate}x
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    €{(category?.costValue / 1000)?.toFixed(0)}K
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryLevelsChart;