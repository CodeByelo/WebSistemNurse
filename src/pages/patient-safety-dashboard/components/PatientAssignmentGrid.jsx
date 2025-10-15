import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PatientAssignmentGrid = ({ selectedUnit, onAssignmentChange }) => {
  const [assignments, setAssignments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [draggedPatient, setDraggedPatient] = useState(null);
  const [showWorkloadDetails, setShowWorkloadDetails] = useState(false);

  useEffect(() => {
    const mockNurses = [
      {
        id: 'N001',
        name: 'Carmen López',
        shift: 'day',
        experience: 'senior',
        specialization: 'Critical Care',
        maxPatients: 4,
        currentLoad: 3,
        status: 'available',
        certifications: ['ACLS', 'PALS']
      },
      {
        id: 'N002',
        name: 'Ana Ruiz',
        shift: 'day',
        experience: 'intermediate',
        specialization: 'Medical-Surgical',
        maxPatients: 5,
        currentLoad: 4,
        status: 'busy',
        certifications: ['BLS']
      },
      {
        id: 'N003',
        name: 'Pedro Sánchez',
        shift: 'day',
        experience: 'senior',
        specialization: 'Cardiac Care',
        maxPatients: 4,
        currentLoad: 2,
        status: 'available',
        certifications: ['ACLS', 'CCRN']
      },
      {
        id: 'N004',
        name: 'Laura García',
        shift: 'day',
        experience: 'junior',
        specialization: 'General',
        maxPatients: 6,
        currentLoad: 5,
        status: 'overloaded',
        certifications: ['BLS']
      }
    ];

    const mockAssignments = [
      {
        nurseId: 'N001',
        patients: [
          {
            id: 'P001',
            name: 'María González',
            room: '101A',
            acuity: 5,
            diagnosis: 'Neumonía severa',
            admissionDate: '2025-09-28',
            carePlan: 'Intensive monitoring',
            workloadScore: 8.5
          },
          {
            id: 'P005',
            name: 'Isabel Fernández',
            room: '105A',
            acuity: 5,
            diagnosis: 'Sepsis',
            admissionDate: '2025-09-29',
            carePlan: 'Critical care protocol',
            workloadScore: 9.2
          },
          {
            id: 'P007',
            name: 'Roberto Díaz',
            room: '107A',
            acuity: 3,
            diagnosis: 'Post-operatorio',
            admissionDate: '2025-09-30',
            carePlan: 'Standard recovery',
            workloadScore: 4.1
          }
        ]
      },
      {
        nurseId: 'N002',
        patients: [
          {
            id: 'P002',
            name: 'Juan Martínez',
            room: '102B',
            acuity: 3,
            diagnosis: 'Post-operatorio',
            admissionDate: '2025-09-27',
            carePlan: 'Pain management',
            workloadScore: 5.2
          },
          {
            id: 'P006',
            name: 'Miguel Torres',
            room: '106B',
            acuity: 3,
            diagnosis: 'Diabetes descompensada',
            admissionDate: '2025-09-29',
            carePlan: 'Glucose monitoring',
            workloadScore: 4.8
          },
          {
            id: 'P008',
            name: 'Elena Morales',
            room: '108B',
            acuity: 2,
            diagnosis: 'Observación',
            admissionDate: '2025-10-01',
            carePlan: 'Routine monitoring',
            workloadScore: 2.5
          },
          {
            id: 'P009',
            name: 'Carlos Vega',
            room: '109A',
            acuity: 4,
            diagnosis: 'Insuficiencia renal',
            admissionDate: '2025-09-30',
            carePlan: 'Dialysis preparation',
            workloadScore: 6.8
          }
        ]
      },
      {
        nurseId: 'N003',
        patients: [
          {
            id: 'P003',
            name: 'Carmen Rodríguez',
            room: '103A',
            acuity: 4,
            diagnosis: 'Insuficiencia cardíaca',
            admissionDate: '2025-09-26',
            carePlan: 'Cardiac monitoring',
            workloadScore: 7.1
          },
          {
            id: 'P010',
            name: 'Francisco Herrera',
            room: '110B',
            acuity: 3,
            diagnosis: 'Hipertensión',
            admissionDate: '2025-10-01',
            carePlan: 'Blood pressure control',
            workloadScore: 3.9
          }
        ]
      },
      {
        nurseId: 'N004',
        patients: [
          {
            id: 'P004',
            name: 'Antonio Silva',
            room: '104B',
            acuity: 2,
            diagnosis: 'Observación',
            admissionDate: '2025-09-30',
            carePlan: 'Routine care',
            workloadScore: 2.1
          },
          {
            id: 'P011',
            name: 'Lucía Jiménez',
            room: '111A',
            acuity: 2,
            diagnosis: 'Recuperación',
            admissionDate: '2025-10-01',
            carePlan: 'Discharge planning',
            workloadScore: 1.8
          },
          {
            id: 'P012',
            name: 'Manuel Castro',
            room: '112B',
            acuity: 3,
            diagnosis: 'Gastroenteritis',
            admissionDate: '2025-09-29',
            carePlan: 'Hydration therapy',
            workloadScore: 3.5
          },
          {
            id: 'P013',
            name: 'Rosa Delgado',
            room: '113A',
            acuity: 2,
            diagnosis: 'Control rutinario',
            admissionDate: '2025-10-01',
            carePlan: 'Medication adjustment',
            workloadScore: 2.2
          },
          {
            id: 'P014',
            name: 'Diego Ramírez',
            room: '114B',
            acuity: 3,
            diagnosis: 'Bronquitis',
            admissionDate: '2025-09-28',
            carePlan: 'Respiratory therapy',
            workloadScore: 4.3
          }
        ]
      }
    ];

    setNurses(mockNurses);
    setAssignments(mockAssignments);
  }, [selectedUnit]);

  const getNurseWorkload = (nurseId) => {
    const assignment = assignments?.find(a => a?.nurseId === nurseId);
    if (!assignment) return { totalScore: 0, patientCount: 0 };
    
    const totalScore = assignment?.patients?.reduce((sum, patient) => sum + patient?.workloadScore, 0);
    return {
      totalScore: totalScore?.toFixed(1),
      patientCount: assignment?.patients?.length
    };
  };

  const getWorkloadStatus = (nurse) => {
    const workload = getNurseWorkload(nurse?.id);
    const ratio = workload?.patientCount / nurse?.maxPatients;
    
    if (ratio >= 1) return 'overloaded';
    if (ratio >= 0.8) return 'busy';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overloaded': return 'bg-error text-error-foreground';
      case 'busy': return 'bg-warning text-warning-foreground';
      case 'available': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAcuityColor = (acuity) => {
    if (acuity >= 4) return 'text-error';
    if (acuity >= 3) return 'text-warning';
    return 'text-success';
  };

  const handleDragStart = (e, patient, sourceNurseId) => {
    setDraggedPatient({ ...patient, sourceNurseId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetNurseId) => {
    e?.preventDefault();
    
    if (!draggedPatient || draggedPatient?.sourceNurseId === targetNurseId) {
      setDraggedPatient(null);
      return;
    }

    // Update assignments
    setAssignments(prev => {
      const newAssignments = [...prev];
      
      // Remove patient from source nurse
      const sourceAssignment = newAssignments?.find(a => a?.nurseId === draggedPatient?.sourceNurseId);
      if (sourceAssignment) {
        sourceAssignment.patients = sourceAssignment?.patients?.filter(p => p?.id !== draggedPatient?.id);
      }
      
      // Add patient to target nurse
      let targetAssignment = newAssignments?.find(a => a?.nurseId === targetNurseId);
      if (!targetAssignment) {
        targetAssignment = { nurseId: targetNurseId, patients: [] };
        newAssignments?.push(targetAssignment);
      }
      targetAssignment?.patients?.push(draggedPatient);
      
      return newAssignments;
    });

    onAssignmentChange?.(draggedPatient, draggedPatient?.sourceNurseId, targetNurseId);
    setDraggedPatient(null);
  };

  const getExperienceIcon = (experience) => {
    switch (experience) {
      case 'senior': return 'star';
      case 'intermediate': return 'circle';
      case 'junior': return 'minus';
      default: return 'help-circle';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Asignación de Pacientes
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWorkloadDetails(!showWorkloadDetails)}
              className={`p-2 rounded-sm transition-colors ${
                showWorkloadDetails ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
              title="Mostrar detalles de carga de trabajo"
            >
              <Icon name="bar-chart-3" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Enfermeros/as</span>
            </div>
            <p className="text-2xl font-bold text-primary">{nurses?.length}</p>
          </div>
          
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="user-check" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Disponibles</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {nurses?.filter(n => getWorkloadStatus(n) === 'available')?.length}
            </p>
          </div>
          
          <div className="p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="user-minus" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Ocupados</span>
            </div>
            <p className="text-2xl font-bold text-warning">
              {nurses?.filter(n => getWorkloadStatus(n) === 'busy')?.length}
            </p>
          </div>
          
          <div className="p-3 bg-error/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="user-x" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Sobrecargados</span>
            </div>
            <p className="text-2xl font-bold text-error">
              {nurses?.filter(n => getWorkloadStatus(n) === 'overloaded')?.length}
            </p>
          </div>
        </div>

        {/* Nurse Assignment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nurses?.map((nurse) => {
            const assignment = assignments?.find(a => a?.nurseId === nurse?.id);
            const workload = getNurseWorkload(nurse?.id);
            const status = getWorkloadStatus(nurse);
            
            return (
              <div
                key={nurse?.id}
                className="border border-border rounded-lg overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, nurse?.id)}
              >
                {/* Nurse Header */}
                <div className={`p-4 ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name={getExperienceIcon(nurse?.experience)} size={20} />
                      <div>
                        <h4 className="font-semibold">{nurse?.name}</h4>
                        <p className="text-sm opacity-90">
                          {nurse?.specialization} • {nurse?.experience}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">
                        {workload?.patientCount}/{nurse?.maxPatients} pacientes
                      </div>
                      {showWorkloadDetails && (
                        <div className="text-xs opacity-75">
                          Carga: {workload?.totalScore}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {nurse?.certifications?.map((cert, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 rounded-sm text-xs"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Patient List */}
                <div className="p-4 bg-card min-h-[200px]">
                  {assignment?.patients?.length > 0 ? (
                    <div className="space-y-3">
                      {assignment?.patients?.map((patient) => (
                        <div
                          key={patient?.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, patient, nurse?.id)}
                          className="p-3 border border-border rounded-lg cursor-move hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-foreground">{patient?.name}</h5>
                              <p className="text-sm text-muted-foreground">{patient?.room}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="activity" size={14} className={getAcuityColor(patient?.acuity)} />
                              <span className={`text-sm font-medium ${getAcuityColor(patient?.acuity)}`}>
                                {patient?.acuity}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            {patient?.diagnosis}
                          </div>
                          
                          {showWorkloadDetails && (
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Carga: {patient?.workloadScore}</span>
                              <span>Ingreso: {new Date(patient.admissionDate)?.toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <Icon name="user-plus" size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Sin pacientes asignados</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Instrucciones:</p>
              <p>Arrastra y suelta pacientes entre enfermeros/as para reasignar. El sistema calculará automáticamente la carga de trabajo y mostrará alertas si se excede la capacidad recomendada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAssignmentGrid;