import React, { useState, useEffect } from 'react';

import Icon from '../../../components/AppIcon';

const PatientRiskMatrix = ({ selectedUnit, acuityLevel, onPatientSelect }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock patient data with risk scores and acuity levels
  useEffect(() => {
    const mockPatients = [
      {
        id: 'P001',
        name: 'María González',
        room: '101A',
        acuity: 5,
        riskScore: 85,
        age: 67,
        diagnosis: 'Neumonía severa',
        alerts: ['Presión arterial alta', 'Saturación O2 baja'],
        nurse: 'Enf. Carmen López',
        lastVitals: '14:25',
        status: 'critical'
      },
      {
        id: 'P002',
        name: 'Juan Martínez',
        room: '102B',
        acuity: 3,
        riskScore: 45,
        age: 54,
        diagnosis: 'Post-operatorio',
        alerts: ['Dolor moderado'],
        nurse: 'Enf. Ana Ruiz',
        lastVitals: '14:20',
        status: 'stable'
      },
      {
        id: 'P003',
        name: 'Carmen Rodríguez',
        room: '103A',
        acuity: 4,
        riskScore: 72,
        age: 78,
        diagnosis: 'Insuficiencia cardíaca',
        alerts: ['Frecuencia cardíaca irregular', 'Edema'],
        nurse: 'Enf. Pedro Sánchez',
        lastVitals: '14:18',
        status: 'warning'
      },
      {
        id: 'P004',
        name: 'Antonio Silva',
        room: '104B',
        acuity: 2,
        riskScore: 28,
        age: 42,
        diagnosis: 'Observación',
        alerts: [],
        nurse: 'Enf. Laura García',
        lastVitals: '14:15',
        status: 'stable'
      },
      {
        id: 'P005',
        name: 'Isabel Fernández',
        room: '105A',
        acuity: 5,
        riskScore: 92,
        age: 71,
        diagnosis: 'Sepsis',
        alerts: ['Fiebre alta', 'Presión arterial baja', 'Taquicardia'],
        nurse: 'Enf. Carmen López',
        lastVitals: '14:30',
        status: 'critical'
      },
      {
        id: 'P006',
        name: 'Miguel Torres',
        room: '106B',
        acuity: 3,
        riskScore: 55,
        age: 59,
        diagnosis: 'Diabetes descompensada',
        alerts: ['Glucosa elevada'],
        nurse: 'Enf. Ana Ruiz',
        lastVitals: '14:12',
        status: 'warning'
      }
    ];

    // Filter by acuity level if specified
    const filteredPatients = acuityLevel === 'all' 
      ? mockPatients 
      : mockPatients?.filter(p => p?.acuity === parseInt(acuityLevel));

    setPatients(filteredPatients);
  }, [selectedUnit, acuityLevel]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
    onPatientSelect?.(patient);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'stable': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAcuityIcon = (acuity) => {
    if (acuity >= 4) return 'alert-triangle';
    if (acuity >= 3) return 'alert-circle';
    return 'info';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'Alto';
    if (score >= 50) return 'Medio';
    return 'Bajo';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Matriz de Riesgo de Pacientes
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="clock" size={16} />
            <span>Actualizado: {new Date()?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Risk Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {patients?.map((patient) => (
            <div
              key={patient?.id}
              onClick={() => handlePatientClick(patient)}
              className="p-4 border border-border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(patient?.status)?.split(' ')?.[0]}`} />
                  <span className="font-medium text-foreground">{patient?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name={getAcuityIcon(patient?.acuity)} size={16} className="text-warning" />
                  <span className="text-sm font-medium">{patient?.acuity}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Habitación:</span>
                  <span className="font-medium">{patient?.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Riesgo:</span>
                  <span className={`font-medium ${
                    patient?.riskScore >= 80 ? 'text-error' : 
                    patient?.riskScore >= 50 ? 'text-warning' : 'text-success'
                  }`}>
                    {patient?.riskScore}% ({getRiskLevel(patient?.riskScore)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enfermero/a:</span>
                  <span className="font-medium text-xs">{patient?.nurse}</span>
                </div>
              </div>

              {patient?.alerts?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-1 mb-2">
                    <Icon name="alert-triangle" size={14} className="text-error" />
                    <span className="text-xs font-medium text-error">
                      {patient?.alerts?.length} Alerta{patient?.alerts?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient?.alerts?.[0]}
                    {patient?.alerts?.length > 1 && ` +${patient?.alerts?.length - 1} más`}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-error" />
            <span className="text-sm text-muted-foreground">Crítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Precaución</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Estable</span>
          </div>
        </div>
      </div>
      {/* Patient Details Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-foreground">
                  Detalles del Paciente
                </h4>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 hover:bg-muted rounded-sm transition-colors"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedPatient?.status)?.split(' ')?.[0]}`} />
                <div>
                  <h5 className="font-semibold text-foreground">{selectedPatient?.name}</h5>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient?.age} años • {selectedPatient?.room}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Acuidad:</span>
                  <div className="flex items-center space-x-1">
                    <Icon name={getAcuityIcon(selectedPatient?.acuity)} size={16} className="text-warning" />
                    <span className="font-medium">{selectedPatient?.acuity}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Riesgo:</span>
                  <p className={`font-medium ${
                    selectedPatient?.riskScore >= 80 ? 'text-error' : 
                    selectedPatient?.riskScore >= 50 ? 'text-warning' : 'text-success'
                  }`}>
                    {selectedPatient?.riskScore}%
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Diagnóstico:</span>
                <p className="font-medium text-foreground">{selectedPatient?.diagnosis}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Enfermero/a asignado/a:</span>
                <p className="font-medium text-foreground">{selectedPatient?.nurse}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Últimos signos vitales:</span>
                <p className="font-medium text-foreground">{selectedPatient?.lastVitals}</p>
              </div>

              {selectedPatient?.alerts?.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Alertas activas:</span>
                  <div className="mt-2 space-y-2">
                    {selectedPatient?.alerts?.map((alert, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-error/10 rounded-sm">
                        <Icon name="alert-triangle" size={14} className="text-error" />
                        <span className="text-sm text-error">{alert}</span>
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
  );
};

export default PatientRiskMatrix;