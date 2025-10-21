import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const SidebarEnfermeria = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: '🏠 Inicio', path: '/dashboard-enfermeria', icon: 'home' },
    { label: '📝 Nueva Consulta', path: '/nueva-consulta', icon: 'plus-circle' },
    { label: '👥 Expedientes', path: '/expedientes', icon: 'users' },
    { label: '📅 Consultas Hoy', path: '/consultas-hoy', icon: 'calendar' },
    { label: '💊 Inventario', path: '/inventario', icon: 'package' },
    { label: '📊 Reportes', path: '/reportes', icon: 'bar-chart-3' },
    { label: '📈 Reportes Mensuales', path: '/reportes-mensuales', icon: 'bar-chart' }, // ⭐ ¡NUEVO!
    { label: '⚙️ Configuración', path: '/configuracion', icon: 'settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-xl font-bold">🏥 Enfermería</h2>
        <p className="text-blue-100 text-sm">Universidad ISUM</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon name={item.icon} size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>Sistema SIGCA-E</p>
        <p>v1.0 - 2025</p>
      </div>
    </div>
  );
};

export default SidebarEnfermeria;