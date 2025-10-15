import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const QualityMetricsTable = ({ data, onRowClick, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({
    department: 'all',
    status: 'all',
    severity: 'all'
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (type, value) => {
    setFilterConfig(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getSortedAndFilteredData = () => {
    let filteredData = [...data];

    // Apply filters
    if (filterConfig?.department !== 'all') {
      filteredData = filteredData?.filter(item => item?.department === filterConfig?.department);
    }
    if (filterConfig?.status !== 'all') {
      filteredData = filteredData?.filter(item => item?.status === filterConfig?.status);
    }
    if (filterConfig?.severity !== 'all') {
      filteredData = filteredData?.filter(item => item?.severity === filterConfig?.severity);
    }

    // Apply sorting
    if (sortConfig?.key) {
      filteredData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const getStatusBadge = (status) => {
    const configs = {
      excellent: { bg: 'bg-success/10', text: 'text-success', label: 'Excelente' },
      good: { bg: 'bg-primary/10', text: 'text-primary', label: 'Bueno' },
      warning: { bg: 'bg-warning/10', text: 'text-warning', label: 'Atención' },
      critical: { bg: 'bg-error/10', text: 'text-error', label: 'Crítico' }
    };
    const config = configs?.[status] || configs?.good;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const getTrendSparkline = (trendData) => {
    if (!trendData || trendData?.length === 0) return null;
    
    return (
      <div className="w-16 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="chevrons-up-down" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="chevron-up" size={14} className="text-primary" />
      : <Icon name="chevron-down" size={14} className="text-primary" />;
  };

  let filteredData = getSortedAndFilteredData();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Métricas de Calidad Detalladas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Análisis completo de indicadores por departamento
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            <Icon name="download" size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Departamento:</label>
          <select
            value={filterConfig?.department}
            onChange={(e) => handleFilter('department', e?.target?.value)}
            className="px-3 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="emergency">Emergencias</option>
            <option value="icu">UCI</option>
            <option value="surgery">Cirugía</option>
            <option value="cardiology">Cardiología</option>
            <option value="pediatrics">Pediatría</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Estado:</label>
          <select
            value={filterConfig?.status}
            onChange={(e) => handleFilter('status', e?.target?.value)}
            className="px-3 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="excellent">Excelente</option>
            <option value="good">Bueno</option>
            <option value="warning">Atención</option>
            <option value="critical">Crítico</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Severidad:</label>
          <select
            value={filterConfig?.severity}
            onChange={(e) => handleFilter('severity', e?.target?.value)}
            className="px-3 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todas</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th 
                className="text-left py-3 px-4 font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center space-x-2">
                  <span>Departamento</span>
                  {getSortIcon('department')}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSort('metric')}
              >
                <div className="flex items-center space-x-2">
                  <span>Métrica</span>
                  {getSortIcon('metric')}
                </div>
              </th>
              <th 
                className="text-center py-3 px-4 font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSort('currentValue')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Valor Actual</span>
                  {getSortIcon('currentValue')}
                </div>
              </th>
              <th 
                className="text-center py-3 px-4 font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSort('target')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Meta</span>
                  {getSortIcon('target')}
                </div>
              </th>
              <th className="text-center py-3 px-4 font-medium text-foreground">
                Tendencia
              </th>
              <th 
                className="text-center py-3 px-4 font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Estado</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="text-center py-3 px-4 font-medium text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((row, index) => (
              <tr 
                key={index}
                className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors duration-200"
                onClick={() => onRowClick(row)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="building" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{row?.department}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-foreground">{row?.metric}</div>
                    <div className="text-xs text-muted-foreground">{row?.description}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="font-bold text-foreground">
                    {row?.currentValue} {row?.unit}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="text-muted-foreground">
                    {row?.target} {row?.unit}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {getTrendSparkline(row?.trendData)}
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(row?.status)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="eye" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="edit" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="more-horizontal" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="search-x" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No se encontraron métricas con los filtros aplicados</p>
        </div>
      )}
      {/* Pagination */}
      {filteredData?.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredData?.length} de {data?.length} métricas
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border rounded text-sm hover:bg-muted transition-colors duration-200">
              Anterior
            </button>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">1</span>
            <button className="px-3 py-1 border border-border rounded text-sm hover:bg-muted transition-colors duration-200">
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityMetricsTable;