import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MedicationSafetyTracker = ({ selectedUnit }) => {
  const [medications, setMedications] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [showInteractions, setShowInteractions] = useState(false);

  useEffect(() => {
    const mockMedications = [
      {
        id: 'M001',
        patient: 'María González',
        patientId: 'P001',
        room: '101A',
        medication: 'Amoxicilina 500mg',
        dosage: '1 cápsula cada 8 horas',
        route: 'Oral',
        scheduledTime: '15:00',
        status: 'due',
        priority: 'high',
        nurse: 'Enf. Carmen López',
        interactions: ['Warfarina'],
        allergies: [],
        lastGiven: '07:00'
      },
      {
        id: 'M002',
        patient: 'Juan Martínez',
        patientId: 'P002',
        room: '102B',
        medication: 'Morfina 10mg',
        dosage: '1 ampolla cada 4 horas PRN',
        route: 'IV',
        scheduledTime: '14:30',
        status: 'overdue',
        priority: 'critical',
        nurse: 'Enf. Ana Ruiz',
        interactions: [],
        allergies: [],
        lastGiven: '10:30'
      },
      {
        id: 'M003',
        patient: 'Carmen Rodríguez',
        patientId: 'P003',
        room: '103A',
        medication: 'Digoxina 0.25mg',
        dosage: '1 comprimido diario',
        route: 'Oral',
        scheduledTime: '15:30',
        status: 'administered',
        priority: 'high',
        nurse: 'Enf. Pedro Sánchez',
        interactions: ['Furosemida'],
        allergies: [],
        lastGiven: '15:30'
      },
      {
        id: 'M004',
        patient: 'Antonio Silva',
        patientId: 'P004',
        room: '104B',
        medication: 'Paracetamol 500mg',
        dosage: '1 comprimido cada 6 horas',
        route: 'Oral',
        scheduledTime: '16:00',
        status: 'scheduled',
        priority: 'low',
        nurse: 'Enf. Laura García',
        interactions: [],
        allergies: [],
        lastGiven: '10:00'
      },
      {
        id: 'M005',
        patient: 'Isabel Fernández',
        patientId: 'P005',
        room: '105A',
        medication: 'Vancomicina 1g',
        dosage: '1 vial cada 12 horas',
        route: 'IV',
        scheduledTime: '14:00',
        status: 'interaction_alert',
        priority: 'critical',
        nurse: 'Enf. Carmen López',
        interactions: ['Gentamicina', 'Furosemida'],
        allergies: ['Penicilina'],
        lastGiven: '02:00'
      }
    ];

    setMedications(mockMedications);
  }, [selectedUnit]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'overdue':
        return {
          label: 'Vencido',
          color: 'bg-error text-error-foreground',
          icon: 'alert-triangle',
          animation: 'animate-pulse-error'
        };
      case 'due':
        return {
          label: 'Pendiente',
          color: 'bg-warning text-warning-foreground',
          icon: 'clock',
          animation: 'animate-pulse-warning'
        };
      case 'scheduled':
        return {
          label: 'Programado',
          color: 'bg-primary text-primary-foreground',
          icon: 'calendar',
          animation: ''
        };
      case 'administered':
        return {
          label: 'Administrado',
          color: 'bg-success text-success-foreground',
          icon: 'check-circle',
          animation: ''
        };
      case 'interaction_alert':
        return {
          label: 'Alerta Interacción',
          color: 'bg-error text-error-foreground',
          icon: 'alert-octagon',
          animation: 'animate-pulse-error'
        };
      default:
        return {
          label: 'Desconocido',
          color: 'bg-muted text-muted-foreground',
          icon: 'help-circle',
          animation: ''
        };
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return 'alert-triangle';
      case 'high': return 'alert-circle';
      case 'low': return 'info';
      default: return 'minus';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const filteredMedications = medications?.filter(med => {
    if (selectedTimeframe === 'current') {
      return ['due', 'overdue', 'interaction_alert']?.includes(med?.status);
    }
    return true;
  });

  const getTimeUntilDue = (scheduledTime) => {
    const now = new Date();
    const scheduled = new Date();
    const [hours, minutes] = scheduledTime?.split(':');
    scheduled?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diff = scheduled?.getTime() - now?.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    
    if (diffMinutes < 0) {
      return `Vencido hace ${Math.abs(diffMinutes)} min`;
    } else if (diffMinutes < 60) {
      return `En ${diffMinutes} min`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      return `En ${diffHours}h ${diffMinutes % 60}min`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="pill" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Seguimiento de Medicación
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInteractions(!showInteractions)}
              className={`p-2 rounded-sm transition-colors ${
                showInteractions ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground'
              }`}
              title="Mostrar interacciones"
            >
              <Icon name="alert-triangle" size={16} />
            </button>
          </div>
        </div>

        {/* Timeframe Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Vista:</span>
          {[
            { value: 'current', label: 'Pendientes' },
            { value: 'all', label: 'Todas' }
          ]?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedTimeframe(option?.value)}
              className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
                selectedTimeframe === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-error/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="alert-triangle" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Vencidos</span>
            </div>
            <p className="text-2xl font-bold text-error">
              {medications?.filter(m => m?.status === 'overdue')?.length}
            </p>
          </div>
          
          <div className="p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-warning">
              {medications?.filter(m => m?.status === 'due')?.length}
            </p>
          </div>
          
          <div className="p-3 bg-error/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="alert-octagon" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Interacciones</span>
            </div>
            <p className="text-2xl font-bold text-error">
              {medications?.filter(m => m?.status === 'interaction_alert')?.length}
            </p>
          </div>
          
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="check-circle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Completados</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {medications?.filter(m => m?.status === 'administered')?.length}
            </p>
          </div>
        </div>

        {/* Medication List */}
        <div className="space-y-3">
          {filteredMedications?.map((medication) => {
            const statusConfig = getStatusConfig(medication?.status);
            
            return (
              <div
                key={medication?.id}
                className={`p-4 border border-border rounded-lg transition-all duration-200 hover:shadow-md ${
                  medication?.status === 'overdue' || medication?.status === 'interaction_alert' ?'border-error bg-error/5' 
                    : medication?.status === 'due' ?'border-warning bg-warning/5' :''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getPriorityIcon(medication?.priority)} 
                        size={16} 
                        className={getPriorityColor(medication?.priority)} 
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">{medication?.patient}</h4>
                        <p className="text-sm text-muted-foreground">{medication?.room}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig?.color} ${statusConfig?.animation}`}>
                    <Icon name={statusConfig?.icon} size={12} className="inline mr-1" />
                    {statusConfig?.label}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Medicamento:</span>
                    <p className="font-medium text-foreground">{medication?.medication}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Dosis:</span>
                    <p className="font-medium text-foreground">{medication?.dosage}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Vía:</span>
                    <p className="font-medium text-foreground">{medication?.route}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Programado:</span>
                      <span className="font-medium ml-1">{medication?.scheduledTime}</span>
                    </div>
                    
                    {medication?.status !== 'administered' && (
                      <div className={`${
                        medication?.status === 'overdue' ? 'text-error' : 'text-muted-foreground'
                      }`}>
                        {getTimeUntilDue(medication?.scheduledTime)}
                      </div>
                    )}
                    
                    <div>
                      <span className="text-muted-foreground">Enfermero/a:</span>
                      <span className="font-medium ml-1">{medication?.nurse}</span>
                    </div>
                  </div>
                </div>
                {/* Interactions and Allergies */}
                {(showInteractions && (medication?.interactions?.length > 0 || medication?.allergies?.length > 0)) && (
                  <div className="mt-3 pt-3 border-t border-border">
                    {medication?.interactions?.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name="alert-triangle" size={14} className="text-warning" />
                          <span className="text-sm font-medium text-warning">Interacciones:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {medication?.interactions?.map((interaction, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-sm"
                            >
                              {interaction}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {medication?.allergies?.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name="alert-octagon" size={14} className="text-error" />
                          <span className="text-sm font-medium text-error">Alergias:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {medication?.allergies?.map((allergy, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-error/20 text-error text-xs rounded-sm"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredMedications?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="check-circle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">
              No hay medicaciones pendientes
            </h4>
            <p className="text-muted-foreground">
              Todas las medicaciones están al día
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationSafetyTracker;