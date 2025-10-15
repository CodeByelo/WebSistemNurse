import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyContext = createContext();

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

const EmergencyModeToggle = ({ children }) => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState('normal');
  const [emergencyData, setEmergencyData] = useState({
    activeAlerts: [],
    criticalPatients: [],
    emergencyContacts: []
  });
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const navigate = useNavigate();

  // Emergency levels configuration
  const emergencyLevels = {
    normal: {
      label: 'Normal',
      color: 'text-foreground',
      bg: 'bg-background',
      priority: 0
    },
    yellow: {
      label: 'Precaución',
      color: 'text-warning-foreground',
      bg: 'bg-warning',
      priority: 1
    },
    orange: {
      label: 'Alerta',
      color: 'text-warning-foreground',
      bg: 'bg-warning',
      priority: 2
    },
    red: {
      label: 'Crítico',
      color: 'text-error-foreground',
      bg: 'bg-error',
      priority: 3
    }
  };

  // Initialize emergency mode from localStorage
  useEffect(() => {
    const savedEmergencyMode = localStorage.getItem('emergencyMode') === 'true';
    const savedEmergencyLevel = localStorage.getItem('emergencyLevel') || 'normal';
    
    setEmergencyMode(savedEmergencyMode);
    setEmergencyLevel(savedEmergencyLevel);
  }, []);

  // Voice commands setup
  useEffect(() => {
    if (!emergencyMode || !voiceCommandsEnabled) return;

    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) return;

    const speechRecognition = new recognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'es-ES';

    speechRecognition.onresult = (event) => {
      const command = event?.results?.[event?.results?.length - 1]?.[0]?.transcript?.toLowerCase();
      handleVoiceCommand(command);
    };

    speechRecognition?.start();

    return () => {
      speechRecognition?.stop();
    };
  }, [emergencyMode, voiceCommandsEnabled]);

  const handleVoiceCommand = (command) => {
    if (command?.includes('seguridad paciente')) {
      navigate('/patient-safety-dashboard');
    } else if (command?.includes('cuidados paciente')) {
      navigate('/patient-care-overview');
    } else if (command?.includes('desactivar emergencia')) {
      deactivateEmergencyMode();
    }
  };

  const activateEmergencyMode = (level = 'red') => {
    setEmergencyMode(true);
    setEmergencyLevel(level);
    localStorage.setItem('emergencyMode', 'true');
    localStorage.setItem('emergencyLevel', level);
    
    // Navigate to patient safety dashboard in emergency mode
    navigate('/patient-safety-dashboard');
    
    // Enable voice commands
    setVoiceCommandsEnabled(true);
    
    // Trigger emergency data refresh
    refreshEmergencyData();
    
    // Play emergency sound (if audio is enabled)
    playEmergencySound();
  };

  const deactivateEmergencyMode = () => {
    setEmergencyMode(false);
    setEmergencyLevel('normal');
    localStorage.setItem('emergencyMode', 'false');
    localStorage.setItem('emergencyLevel', 'normal');
    
    // Disable voice commands
    setVoiceCommandsEnabled(false);
  };

  const updateEmergencyLevel = (level) => {
    setEmergencyLevel(level);
    localStorage.setItem('emergencyLevel', level);
    
    if (level !== 'normal' && !emergencyMode) {
      activateEmergencyMode(level);
    } else if (level === 'normal' && emergencyMode) {
      deactivateEmergencyMode();
    }
  };

  const refreshEmergencyData = () => {
    // Simulate emergency data loading
    setEmergencyData({
      activeAlerts: [
        { id: 1, patient: 'Paciente 101', type: 'Caída', severity: 'critical', time: new Date() },
        { id: 2, patient: 'Paciente 205', type: 'Medicación', severity: 'warning', time: new Date() }
      ],
      criticalPatients: [
        { id: 101, name: 'Juan Pérez', room: '101A', condition: 'Crítico' },
        { id: 205, name: 'María García', room: '205B', condition: 'Inestable' }
      ],
      emergencyContacts: [
        { role: 'Médico de Guardia', name: 'Dr. López', phone: '1234' },
        { role: 'Supervisor', name: 'Enf. Martínez', phone: '5678' }
      ]
    });
  };

  const playEmergencySound = () => {
    // Play emergency notification sound
    const audio = new Audio('/assets/sounds/emergency-alert.mp3');
    audio?.play()?.catch(() => {
      // Handle audio play failure silently
    });
  };

  const getEmergencyConfig = () => {
    return emergencyLevels?.[emergencyLevel];
  };

  const contextValue = {
    emergencyMode,
    emergencyLevel,
    emergencyData,
    voiceCommandsEnabled,
    emergencyLevels,
    activateEmergencyMode,
    deactivateEmergencyMode,
    updateEmergencyLevel,
    refreshEmergencyData,
    getEmergencyConfig,
    setVoiceCommandsEnabled
  };

  const EmergencyToggleButton = ({ size = 'sm', className = '' }) => {
    const config = getEmergencyConfig();
    
    return (
      <Button
        variant={emergencyMode ? "destructive" : "outline"}
        size={size}
        onClick={() => emergencyMode ? deactivateEmergencyMode() : activateEmergencyMode()}
        iconName={emergencyMode ? "alert-triangle" : "shield"}
        iconPosition="left"
        className={`${emergencyMode ? 'animate-pulse-error' : ''} ${className}`}
      >
        {emergencyMode ? 'Emergencia Activa' : 'Modo Emergencia'}
      </Button>
    );
  };

  const EmergencyBanner = () => {
    if (!emergencyMode) return null;
    
    const config = getEmergencyConfig();
    
    return (
      <div className={`${config?.bg} ${config?.color} px-4 py-2 text-center text-sm font-medium animate-pulse-error`}>
        <Icon name="alert-triangle" size={16} className="inline mr-2" />MODO EMERGENCIA ACTIVADO ({config?.label?.toUpperCase()}) - Interfaz simplificada para atención crítica
                {voiceCommandsEnabled && (
          <span className="ml-4">
            <Icon name="mic" size={16} className="inline mr-1" />
            Comandos de voz activos
          </span>
        )}
      </div>
    );
  };

  return (
    <EmergencyContext.Provider value={contextValue}>
      {children}
      <EmergencyBanner />
    </EmergencyContext.Provider>
  );
};

// Export individual components for flexible usage
export { EmergencyModeToggle as default, EmergencyContext };

// Standalone toggle button component
export const EmergencyToggleButton = ({ size = 'sm', className = '' }) => {
  const { emergencyMode, activateEmergencyMode, deactivateEmergencyMode } = useEmergency();
  
  return (
    <Button
      variant={emergencyMode ? "destructive" : "outline"}
      size={size}
      onClick={() => emergencyMode ? deactivateEmergencyMode() : activateEmergencyMode()}
      iconName={emergencyMode ? "alert-triangle" : "shield"}
      iconPosition="left"
      className={`${emergencyMode ? 'animate-pulse-error' : ''} ${className}`}
    >
      {emergencyMode ? 'Emergencia Activa' : 'Modo Emergencia'}
    </Button>
  );
};