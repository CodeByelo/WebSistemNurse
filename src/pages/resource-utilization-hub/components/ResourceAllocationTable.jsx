import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ResourceAllocationTable = ({ className = '' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'utilization', direction: 'desc' });
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const resourceData = [
    {
      id: 'RES001',
      name: 'Monitor Cardíaco Philips',
      category: 'Equipos Médicos',
      department: 'UCI',
      currentUtilization: 87.5,
      targetUtilization: 85,
      costPerHour: 45,
      totalHours: 720,
      totalCost: 32400,
      efficiency: 92.3,
      status: 'optimal',
      predictedDemand: 89.2,
      maintenanceCost: 2400,
      roi: 15.8
    },
    {
      id: 'RES002',
      name: 'Ventilador Dräger',
      category: 'Equipos Médicos',
      department: 'UCI',
      currentUtilization: 95.2,
      targetUtilization: 90,
      costPerHour: 65,
      totalHours: 680,
      totalCost: 44200,
      efficiency: 88.7,
      status: 'overutilized',
      predictedDemand: 92.1,
      maintenanceCost: 3200,
      roi: 12.4
    },
    {
      id: 'RES003',
      name: 'Sala Quirófano 1',
      category: 'Instalaciones',
      department: 'Cirugía',
      currentUtilization: 72.8,
      targetUtilization: 80,
      costPerHour: 120,
      totalHours: 480,
      totalCost: 57600,
      efficiency: 91.0,
      status: 'underutilized',
      predictedDemand: 78.5,
      maintenanceCost: 4800,
      roi: 18.2
    },
    {
      id: 'RES004',
      name: 'Equipo Rayos X Portátil',
      category: 'Equipos Médicos',
      department: 'Radiología',
      currentUtilization: 68.3,
      targetUtilization: 75,
      costPerHour: 35,
      totalHours: 520,
      totalCost: 18200,
      efficiency: 85.4,
      status: 'underutilized',
      predictedDemand: 71.2,
      maintenanceCost: 1800,
      roi: 14.6
    },
    {
      id: 'RES005',
      name: 'Personal Enfermería Turno Día',
      category: 'Personal',
      department: 'Medicina Interna',
      currentUtilization: 91.7,
      targetUtilization: 85,
      costPerHour: 28,
      totalHours: 1440,
      totalCost: 40320,
      efficiency: 94.2,
      status: 'optimal',
      predictedDemand: 88.9,
      maintenanceCost: 0,
      roi: 22.1
    },
    {
      id: 'RES006',
      name: 'Camas UCI',
      category: 'Instalaciones',
      department: 'UCI',
      currentUtilization: 98.5,
      targetUtilization: 90,
      costPerHour: 85,
      totalHours: 720,
      totalCost: 61200,
      efficiency: 96.8,
      status: 'overutilized',
      predictedDemand: 95.2,
      maintenanceCost: 3600,
      roi: 25.4
    },
    {
      id: 'RES007',
      name: 'Laboratorio Análisis Clínicos',
      category: 'Servicios',
      department: 'Laboratorio',
      currentUtilization: 76.4,
      targetUtilization: 80,
      costPerHour: 55,
      totalHours: 600,
      totalCost: 33000,
      efficiency: 89.1,
      status: 'underutilized',
      predictedDemand: 79.8,
      maintenanceCost: 2200,
      roi: 16.7
    },
    {
      id: 'RES008',
      name: 'Farmacia Hospitalaria',
      category: 'Servicios',
      department: 'Farmacia',
      currentUtilization: 84.2,
      targetUtilization: 85,
      costPerHour: 42,
      totalHours: 720,
      totalCost: 30240,
      efficiency: 92.5,
      status: 'optimal',
      predictedDemand: 86.1,
      maintenanceCost: 1500,
      roi: 19.3
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'Equipos Médicos', label: 'Equipos Médicos' },
    { value: 'Instalaciones', label: 'Instalaciones' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Servicios', label: 'Servicios' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'optimal':
        return {
          label: 'Óptimo',
          color: 'text-success',
          bg: 'bg-success/10',
          icon: 'check-circle'
        };
      case 'overutilized':
        return {
          label: 'Sobreutilizado',
          color: 'text-error',
          bg: 'bg-error/10',
          icon: 'alert-triangle'
        };
      case 'underutilized':
        return {
          label: 'Subutilizado',
          color: 'text-warning',
          bg: 'bg-warning/10',
          icon: 'alert-circle'
        };
      default:
        return {
          label: 'Desconocido',
          color: 'text-muted-foreground',
          bg: 'bg-muted/10',
          icon: 'help-circle'
        };
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = resourceData?.filter(item => {
      const matchesFilter = item?.name?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
                           item?.department?.toLowerCase()?.includes(filterText?.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item?.category === selectedCategory;
      return matchesFilter && matchesCategory;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [resourceData, filterText, selectedCategory, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return 'chevrons-up-down';
    }
    return sortConfig?.direction === 'asc' ? 'chevron-up' : 'chevron-down';
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Nombre', 'Categoría', 'Departamento', 'Utilización Actual (%)', 
      'Utilización Objetivo (%)', 'Costo por Hora (€)', 'Horas Totales', 
      'Costo Total (€)', 'Eficiencia (%)', 'Estado', 'Demanda Predicha (%)', 
      'Costo Mantenimiento (€)', 'ROI (%)'
    ];
    
    const csvContent = [
      headers?.join(','),
      ...filteredAndSortedData?.map(row => [
        row?.id,
        `"${row?.name}"`,
        `"${row?.category}"`,
        `"${row?.department}"`,
        row?.currentUtilization,
        row?.targetUtilization,
        row?.costPerHour,
        row?.totalHours,
        row?.totalCost,
        row?.efficiency,
        `"${getStatusConfig(row?.status)?.label}"`,
        row?.predictedDemand,
        row?.maintenanceCost,
        row?.roi
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `recursos_utilizacion_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Tabla de Asignación de Recursos</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="download"
            iconPosition="left"
            onClick={exportToCSV}
          >
            Exportar CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por nombre o departamento..."
              value={filterText}
              onChange={(e) => setFilterText(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-clinical text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories?.map((category) => (
                <option key={category?.value} value={category?.value}>
                  {category?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {[
                { key: 'name', label: 'Recurso' },
                { key: 'category', label: 'Categoría' },
                { key: 'department', label: 'Departamento' },
                { key: 'currentUtilization', label: 'Utilización Actual' },
                { key: 'efficiency', label: 'Eficiencia' },
                { key: 'totalCost', label: 'Costo Total' },
                { key: 'roi', label: 'ROI' },
                { key: 'status', label: 'Estado' },
                { key: 'predictedDemand', label: 'Demanda Predicha' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    <Icon 
                      name={getSortIcon(column?.key)} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((resource) => {
              const statusConfig = getStatusConfig(resource?.status);
              
              return (
                <tr key={resource?.id} className="hover:bg-muted/20 transition-colors duration-200">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-foreground text-sm">{resource?.name}</div>
                      <div className="text-xs text-muted-foreground">{resource?.id}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{resource?.category}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{resource?.department}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">
                            {resource?.currentUtilization?.toFixed(1)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Obj: {resource?.targetUtilization}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              resource?.currentUtilization > resource?.targetUtilization + 5 ? 'bg-error' :
                              resource?.currentUtilization < resource?.targetUtilization - 5 ? 'bg-warning': 'bg-success'
                            }`}
                            style={{ width: `${Math.min(resource?.currentUtilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-foreground">
                      {resource?.efficiency?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        €{resource?.totalCost?.toLocaleString('es-ES')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        €{resource?.costPerHour}/hora
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${
                      resource?.roi >= 20 ? 'text-success' : 
                      resource?.roi >= 15 ? 'text-warning' : 'text-error'
                    }`}>
                      {resource?.roi?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-clinical text-xs font-medium ${statusConfig?.bg} ${statusConfig?.color}`}>
                      <Icon name={statusConfig?.icon} size={12} className="mr-1" />
                      {statusConfig?.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        {resource?.predictedDemand?.toFixed(1)}%
                      </span>
                      <Icon 
                        name={resource?.predictedDemand > resource?.currentUtilization ? 'trending-up' : 'trending-down'} 
                        size={14} 
                        className={resource?.predictedDemand > resource?.currentUtilization ? 'text-success' : 'text-error'}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="eye"
                        onClick={() => console.log(`Ver detalles: ${resource?.id}`)}
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="settings"
                        onClick={() => console.log(`Configurar: ${resource?.id}`)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedData?.length)} de {filteredAndSortedData?.length} recursos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="xs"
                iconName="chevron-left"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
              <span className="text-sm text-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="xs"
                iconName="chevron-right"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceAllocationTable;