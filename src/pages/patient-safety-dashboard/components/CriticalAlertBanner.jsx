import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CriticalAlertBanner = ({ emergencyMode, onAlertAction }) => {
  const [alerts, setAlerts] = useState([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    const mockAlerts = [
      {
        id: 'A001',
        type: 'critical',
        category: 'vital_signs',
        patient: 'María González',
        patientId: 'P001',
        room: '101A',
        message: 'Saturación de oxígeno crítica: 82%',
        timestamp: new Date(Date.now() - 120000),
        priority: 1,
        acknowledged: false,
        assignedNurse: 'Enf. Carmen López',
        actions: ['Administrar oxígeno', 'Contactar médico', 'Monitoreo continuo'],
        vitals: {
          oxygenSaturation: 82,
          heartRate: 125,
          bloodPressure: '160/95'
        }
      },
      {
        id: 'A002',
        type: 'critical',
        category: 'medication',
        patient: 'Juan Martínez',
        patientId: 'P002',
        room: '102B',
        message: 'Medicación vencida hace 45 minutos - Morfina 10mg',
        timestamp: new Date(Date.now() - 2700000),
        priority: 2,
        acknowledged: false,
        assignedNurse: 'Enf. Ana Ruiz',
        actions: ['Administrar medicación', 'Documentar retraso', 'Evaluar dolor'],
        medication: {
          name: 'Morfina 10mg',
          scheduledTime: '14:30',
          route: 'IV'
        }
      },
      {
        id: 'A003',
        type: 'warning',
        category: 'fall_risk',
        patient: 'Carmen Rodríguez',
        patientId: 'P003',
        room: '103A',
        message: 'Paciente intentó levantarse sin asistencia',
        timestamp: new Date(Date.now() - 300000),
        priority: 3,
        acknowledged: false,
        assignedNurse: 'Enf. Pedro Sánchez',
        actions: ['Evaluar riesgo de caída', 'Reforzar medidas de seguridad', 'Educación al paciente'],
        riskFactors: ['Edad avanzada', 'Medicación sedante', 'Debilidad muscular']
      },
      {
        id: 'A004',
        type: 'critical',
        category: 'infection_control',
        patient: 'Isabel Fernández',
        patientId: 'P005',
        room: '105A',
        message: 'Fiebre alta persistente: 39.8°C - Posible sepsis',
        timestamp: new Date(Date.now() - 600000),
        priority: 1,
        acknowledged: false,
        assignedNurse: 'Enf. Carmen López',
        actions: ['Hemocultivos urgentes', 'Antibióticos IV', 'Monitoreo intensivo'],
        vitals: {
          temperature: 39.8,
          heartRate: 135,
          bloodPressure: '85/50'
        }
      },
      {
        id: 'A005',
        type: 'warning',
        category: 'equipment',
        patient: 'Miguel Torres',
        patientId: 'P006',
        room: '106B',
        message: 'Monitor cardíaco con batería baja',
        timestamp: new Date(Date.now() - 900000),
        priority: 4,
        acknowledged: true,
        assignedNurse: 'Enf. Ana Ruiz',
        actions: ['Cambiar batería', 'Verificar funcionamiento', 'Documentar mantenimiento'],
        equipment: {
          type: 'Monitor cardíaco',
          model: 'MC-2000',
          batteryLevel: 15
        }
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  // Auto-rotate through critical alerts
  useEffect(() => {
    const criticalAlerts = alerts?.filter(alert => alert?.type === 'critical' && !alert?.acknowledged);
    
    if (criticalAlerts?.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex(prev => (prev + 1) % criticalAlerts?.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [alerts]);

  // Play audio alert for critical alerts
  useEffect(() => {
    const criticalAlerts = alerts?.filter(alert => alert?.type === 'critical' && !alert?.acknowledged);
    
    if (criticalAlerts?.length > 0 && audioEnabled) {
      const audio = new Audio('/assets/sounds/critical-alert.mp3');
      audio?.play()?.catch(() => {
        // Handle audio play failure silently
      });
    }
  }, [alerts, audioEnabled]);

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    onAlertAction?.(alertId, 'acknowledge');
  };

  const handleAction = (alertId, action) => {
    onAlertAction?.(alertId, action);
  };

  const getAlertIcon = (category) => {
    switch (category) {
      case 'vital_signs': return 'heart';
      case 'medication': return 'pill';
      case 'fall_risk': return 'alert-triangle';
      case 'infection_control': return 'shield-alert';
      case 'equipment': return 'settings';
      default: return 'alert-circle';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'info': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      vital_signs: 'Signos Vitales',
      medication: 'Medicación',
      fall_risk: 'Riesgo de Caída',
      infection_control: 'Control de Infecciones',
      equipment: 'Equipamiento'
    };
    return labels?.[category] || category;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now?.getTime() - timestamp?.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h ${minutes % 60}min`;
  };

  const criticalAlerts = alerts?.filter(alert => alert?.type === 'critical' && !alert?.acknowledged);
  const warningAlerts = alerts?.filter(alert => alert?.type === 'warning' && !alert?.acknowledged);
  const currentAlert = criticalAlerts?.[currentAlertIndex];

  if (alerts?.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Main Critical Alert Banner */}
      {currentAlert && (
        <div className={`${getAlertColor(currentAlert?.type)} p-4 rounded-lg shadow-lg animate-pulse-error`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Icon 
                name={getAlertIcon(currentAlert?.category)} 
                size={24} 
                className="mt-1 animate-pulse" 
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-sm">
                    {getCategoryLabel(currentAlert?.category)?.toUpperCase()}
                  </span>
                  <span className="text-sm opacity-90">
                    {currentAlert?.patient} • {currentAlert?.room}
                  </span>
                  <span className="text-xs opacity-75">
                    {getTimeAgo(currentAlert?.timestamp)}
                  </span>
                </div>
                
                <p className="text-lg font-semibold mb-2">
                  {currentAlert?.message}
                </p>
                
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <span>Enfermero/a: {currentAlert?.assignedNurse}</span>
                  {criticalAlerts?.length > 1 && (
                    <span>
                      Alerta {currentAlertIndex + 1} de {criticalAlerts?.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-sm bg-white/20 hover:bg-white/30 transition-colors"
                title={audioEnabled ? 'Silenciar alertas' : 'Activar alertas sonoras'}
              >
                <Icon name={audioEnabled ? 'volume-2' : 'volume-x'} size={16} />
              </button>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-sm bg-white/20 hover:bg-white/30 transition-colors"
                title="Ver detalles"
              >
                <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} />
              </button>
              
              <button
                onClick={() => handleAcknowledge(currentAlert?.id)}
                className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-sm text-sm font-medium transition-colors"
              >
                Reconocer
              </button>
            </div>
          </div>
          
          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold mb-2">Acciones Recomendadas:</h4>
                  <div className="space-y-1">
                    {currentAlert?.actions?.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(currentAlert?.id, action)}
                        className="block w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-sm text-sm transition-colors"
                      >
                        <Icon name="check-circle" size={14} className="inline mr-2" />
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Additional Info */}
                <div>
                  {currentAlert?.vitals && (
                    <div>
                      <h4 className="font-semibold mb-2">Signos Vitales:</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(currentAlert?.vitals)?.map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="opacity-90">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentAlert?.medication && (
                    <div>
                      <h4 className="font-semibold mb-2">Medicación:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-90">Medicamento:</span>
                          <span className="font-medium">{currentAlert?.medication?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Hora programada:</span>
                          <span className="font-medium">{currentAlert?.medication?.scheduledTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Vía:</span>
                          <span className="font-medium">{currentAlert?.medication?.route}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentAlert?.riskFactors && (
                    <div>
                      <h4 className="font-semibold mb-2">Factores de Riesgo:</h4>
                      <div className="space-y-1">
                        {currentAlert?.riskFactors?.map((factor, index) => (
                          <div key={index} className="text-sm opacity-90">
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Warning Alerts Summary */}
      {warningAlerts?.length > 0 && (
        <div className="bg-warning text-warning-foreground p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="alert-triangle" size={20} />
              <span className="font-semibold">
                {warningAlerts?.length} Alerta{warningAlerts?.length > 1 ? 's' : ''} de Precaución
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm underline hover:no-underline"
            >
              Ver todas
            </button>
          </div>
          
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-warning-foreground/20">
              <div className="space-y-2">
                {warningAlerts?.slice(0, 3)?.map((alert) => (
                  <div key={alert?.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name={getAlertIcon(alert?.category)} size={16} />
                      <span>{alert?.patient} • {alert?.message}</span>
                    </div>
                    <button
                      onClick={() => handleAcknowledge(alert?.id)}
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-sm text-xs"
                    >
                      Reconocer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Emergency Mode Indicator */}
      {emergencyMode && (
        <div className="bg-error text-error-foreground p-2 rounded-lg text-center animate-pulse-error">
          <Icon name="alert-triangle" size={16} className="inline mr-2" />
          <span className="font-bold text-sm">
            MODO EMERGENCIA ACTIVO - Interfaz simplificada
          </span>
        </div>
      )}
    </div>
  );
};

export default CriticalAlertBanner;