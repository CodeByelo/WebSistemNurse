import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import CriticalAlertBanner from './components/CriticalAlertBanner';
import PatientRiskMatrix from './components/PatientRiskMatrix';
import VitalSignsMonitor from './components/VitalSignsMonitor';
import MedicationSafetyTracker from './components/MedicationSafetyTracker';
import PatientAssignmentGrid from './components/PatientAssignmentGrid';
import Layout from './Layout';

const unitOptions = [
  { value: 'all', label: 'Todas las Unidades' },
  { value: 'icu', label: 'UCI - Unidad de Cuidados Intensivos' },
  { value: 'emergency', label: 'Urgencias' },
  { value: 'medical', label: 'Medicina Interna' },
  { value: 'surgical', label: 'Cirugía' },
  { value: 'cardiac', label: 'Cardiología' }
];
const acuityOptions = [
  { value: 'all', label: 'Todos los Niveles' },
  { value: '5', label: 'Nivel 5 - Crítico' },
  { value: '4', label: 'Nivel 4 - Alto' },
  { value: '3', label: 'Nivel 3 - Moderado' },
  { value: '2', label: 'Nivel 2 - Bajo' },
  { value: '1', label: 'Nivel 1 - Mínimo' }
];

const PatientSafetyDashboard = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [acuityLevel, setAcuityLevel] = useState('all');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alertThresholds, setAlertThresholds] = useState({ heartRate: { min: 60, max: 100 }, bloodPressure: { min: 90, max: 140 }, oxygenSaturation: { min: 95, max: 100 }, temperature: { min: 36.1, max: 37.2 } });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const savedEmergencyMode = localStorage.getItem('emergencyMode') === 'true';
    setEmergencyMode(savedEmergencyMode);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEmergencyToggle = () => {
    const newEmergencyMode = !emergencyMode;
    setEmergencyMode(newEmergencyMode);
    localStorage.setItem('emergencyMode', newEmergencyMode.toString());
  };

  const handlePatientSelect = (patient) => setSelectedPatient(patient);
  const handleAlertAction = (alertId, action) => console.log(`Alert ${alertId}: ${action}`);
  const handleAssignmentChange = (patient, fromNurse, toNurse) => console.log(`Patient ${patient?.name} reassigned from ${fromNurse} to ${toNurse}`);
  const navigateToPage = (path) => navigate(path);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="shield-check" size={24} className="text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">Panel de Seguridad del Paciente</h1>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigateToPage('/patient-care-overview')} iconName="activity" iconPosition="left">Cuidados</Button>
                  <Button variant="ghost" size="sm" onClick={() => navigateToPage('/clinical-quality-monitor')} iconName="clipboard-check" iconPosition="left">Calidad</Button>
                  <Button variant="ghost" size="sm" onClick={() => navigateToPage('/staff-performance-analytics')} iconName="users" iconPosition="left">Personal</Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2"><Icon name="building" size={16} className="text-muted-foreground" /><Select value={selectedUnit} onChange={setSelectedUnit} options={unitOptions} className="min-w-[200px]" /></div>
                <div className="flex items-center space-x-2"><Icon name="layers" size={16} className="text-muted-foreground" /><Select value={acuityLevel} onChange={setAcuityLevel} options={acuityOptions} className="min-w-[180px]" /></div>
                <Button variant={emergencyMode ? "destructive" : "outline"} size="sm" onClick={handleEmergencyToggle} iconName={emergencyMode ? "alert-triangle" : "shield"} iconPosition="left" className={emergencyMode ? "animate-pulse-error" : ""}>{emergencyMode ? 'Emergencia Activa' : 'Modo Emergencia'}</Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Icon name="clock" size={16} /><span>Última actualización: {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-success rounded-full animate-pulse" /><span className="text-sm text-success font-medium">Sistema Activo</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <CriticalAlertBanner emergencyMode={emergencyMode} onAlertAction={handleAlertAction} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientRiskMatrix selectedUnit={selectedUnit} acuityLevel={acuityLevel} onPatientSelect={handlePatientSelect} />
            <VitalSignsMonitor selectedPatient={selectedPatient} alertThresholds={alertThresholds} />
          </div>
          <MedicationSafetyTracker selectedUnit={selectedUnit} />
          <PatientAssignmentGrid selectedUnit={selectedUnit} onAssignmentChange={handleAssignmentChange} />
          {emergencyMode && (
            <div className="bg-error/10 border border-error rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4"><Icon name="alert-triangle" size={20} className="text-error" /><h3 className="text-lg font-semibold text-error">Modo Emergencia - Acciones Rápidas</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="destructive" size="lg" iconName="phone" iconPosition="left" className="h-16">Llamar Código Azul</Button>
                <Button variant="destructive" size="lg" iconName="users" iconPosition="left" className="h-16">Activar Equipo de Respuesta</Button>
                <Button variant="destructive" size="lg" iconName="file-text" iconPosition="left" className="h-16">Documentación Rápida</Button>
              </div>
            </div>
          )}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              <div><div className="text-2xl font-bold text-primary">24</div><div className="text-sm text-muted-foreground">Pacientes Totales</div></div>
              <div><div className="text-2xl font-bold text-error">3</div><div className="text-sm text-muted-foreground">Críticos</div></div>
              <div><div className="text-2xl font-bold text-warning">7</div><div className="text-sm text-muted-foreground">Precaución</div></div>
              <div><div className="text-2xl font-bold text-success">14</div><div className="text-sm text-muted-foreground">Estables</div></div>
              <div><div className="text-2xl font-bold text-primary">4</div><div className="text-sm text-muted-foreground">Enfermeros/as</div></div>
              <div><div className="text-2xl font-bold text-success">98%</div><div className="text-sm text-muted-foreground">Cumplimiento</div></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientSafetyDashboard;