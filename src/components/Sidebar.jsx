// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Vista General de Cuidados', path: '/', icon: 'layout-dashboard' },
    { label: 'Seguridad del Paciente', path: '/patient-safety-dashboard', icon: 'shield-check' },
    { label: 'Calidad Clínica', path: '/clinical-quality-monitor', icon: 'clipboard-check' },
    { label: 'Rendimiento del Personal', path: '/staff-performance-analytics', icon: 'users' },
    { label: 'Centro de Recursos', path: '/resource-utilization-hub', icon: 'bar-chart-3' },
    { label: 'Alta de Paciente', path: '/patients/register', icon: 'user-plus' },
    { label: 'Lista de Pacientes', path: '/patients', icon: 'list' },
    { label: 'Ocupación de Camas', path: '/bed-occupancy', icon: 'bed' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">SIGCA-E</h2>
        <p className="text-xs text-muted-foreground">Sistema de Gestión Clínica y Automatización</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon name={item.icon} size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
        v1.0 - Tesis 2025
      </div>
    </div>
  );
};

export default Sidebar;