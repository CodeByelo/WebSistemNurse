import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [currentShift, setCurrentShift] = useState('day');
  const [alertCounts, setAlertCounts] = useState({
    critical: 2,
    warning: 5,
    info: 3
  });
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-detect shift based on current time
  useEffect(() => {
    const detectShift = () => {
      const hour = new Date()?.getHours();
      if (hour >= 7 && hour < 19) {
        setCurrentShift('day');
      } else if (hour >= 19 && hour < 23) {
        setCurrentShift('evening');
      } else {
        setCurrentShift('night');
      }
    };

    detectShift();
    const interval = setInterval(detectShift, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      label: 'Supervisión de Pacientes',
      items: [
        {
          path: '/patient-care-overview',
          label: 'Vista General de Cuidados',
          icon: 'activity',
          alerts: alertCounts?.critical + alertCounts?.warning
        },
        {
          path: '/patient-safety-dashboard',
          label: 'Seguridad del Paciente',
          icon: 'shield-check',
          alerts: alertCounts?.critical
        }
      ]
    },
    {
      label: 'Análisis de Personal',
      items: [
        {
          path: '/staff-performance-analytics',
          label: 'Rendimiento del Personal',
          icon: 'users',
          alerts: 0
        }
      ]
    },
    {
      label: 'Calidad Clínica',
      items: [
        {
          path: '/clinical-quality-monitor',
          label: 'Monitor de Calidad',
          icon: 'clipboard-check',
          alerts: alertCounts?.warning
        }
      ]
    },
    {
      label: 'Recursos',
      items: [
        {
          path: '/resource-utilization-hub',
          label: 'Centro de Recursos',
          icon: 'bar-chart-3',
          alerts: 0
        }
      ]
    }
  ];

  const secondaryItems = [
    { path: '/settings', label: 'Configuración', icon: 'settings' },
    { path: '/help', label: 'Ayuda', icon: 'help-circle' },
    { path: '/admin', label: 'Administración', icon: 'shield' }
  ];

  const handleEmergencyToggle = () => {
    setEmergencyMode(!emergencyMode);
    // In emergency mode, redirect to patient safety dashboard
    if (!emergencyMode) {
      navigate('/patient-safety-dashboard');
    }
  };

  const handleShiftChange = (shift) => {
    setCurrentShift(shift);
    // Trigger data refresh for new shift context
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const getActiveGroup = () => {
    return navigationItems?.find(group => 
      group?.items?.some(item => isActiveRoute(item?.path))
    );
  };

  const totalAlerts = alertCounts?.critical + alertCounts?.warning + alertCounts?.info;

  return (
    <header className={`fixed top-0 left-0 right-0 z-navigation bg-card border-b border-border transition-all duration-200 ${
      emergencyMode ? 'bg-error text-error-foreground shadow-clinical-lg' : 'shadow-clinical'
    }`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-clinical flex items-center justify-center">
              <Icon name="activity" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground leading-none">
                SIGCA-E
              </h1>
              <span className="text-xs text-muted-foreground leading-none">
                Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((group, groupIndex) => (
            <div key={groupIndex} className="relative group">
              <button
                className={`flex items-center space-x-2 px-3 py-2 rounded-clinical-sm text-sm font-medium transition-all duration-200 ${
                  getActiveGroup()?.label === group?.label
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{group?.label}</span>
                {group?.items?.some(item => item?.alerts > 0) && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error rounded-full animate-pulse-error">
                    {group?.items?.reduce((sum, item) => sum + item?.alerts, 0)}
                  </span>
                )}
                <Icon name="chevron-down" size={16} />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-clinical shadow-clinical-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-alerts">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                    {group?.label}
                  </div>
                  {group?.items?.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => navigate(item?.path)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-clinical-sm text-sm transition-all duration-200 ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </div>
                      {item?.alerts > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error rounded-full animate-pulse-error">
                          {item?.alerts}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-clinical-sm text-sm font-medium text-foreground hover:bg-muted transition-all duration-200"
            >
              <span>Más</span>
              <Icon name="more-horizontal" size={16} />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-clinical shadow-clinical-lg z-alerts">
                <div className="p-2">
                  {secondaryItems?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        navigate(item?.path);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-clinical-sm text-sm text-popover-foreground hover:bg-muted transition-all duration-200"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-3">
          {/* Shift Selector */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Turno:</span>
            <select
              value={currentShift}
              onChange={(e) => handleShiftChange(e?.target?.value)}
              className="text-sm bg-input border border-border rounded-clinical-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="day">Día</option>
              <option value="evening">Tarde</option>
              <option value="night">Noche</option>
            </select>
          </div>

          {/* Alert Summary */}
          {totalAlerts > 0 && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-muted rounded-clinical">
              <Icon name="bell" size={16} className="text-warning" />
              <span className="text-sm font-medium">{totalAlerts}</span>
            </div>
          )}

          {/* Emergency Mode Toggle */}
          <Button
            variant={emergencyMode ? "destructive" : "outline"}
            size="sm"
            onClick={handleEmergencyToggle}
            iconName={emergencyMode ? "alert-triangle" : "shield"}
            iconPosition="left"
            className={emergencyMode ? "animate-pulse-error" : ""}
          >
            {emergencyMode ? 'Emergencia Activa' : 'Modo Emergencia'}
          </Button>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 rounded-clinical-sm hover:bg-muted transition-all duration-200">
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>
      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <div className="bg-error text-error-foreground px-4 py-2 text-center text-sm font-medium animate-pulse-error">
          <Icon name="alert-triangle" size={16} className="inline mr-2" />
          MODO EMERGENCIA ACTIVADO - Interfaz simplificada para atención crítica
        </div>
      )}
    </header>
  );
};

export default Header;