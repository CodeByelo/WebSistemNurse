import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const StaffLeaderboard = ({ dateRange, selectedDepartments }) => {
  const [selectedCategory, setSelectedCategory] = useState('overall');

  const staffData = [
    {
      id: 1,
      name: 'Ana García Ruiz',
      position: 'Enfermera Senior',
      department: 'UCI',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      overallScore: 96,
      patientCare: 98,
      documentation: 94,
      teamwork: 95,
      efficiency: 97,
      certifications: ['BLS', 'ACLS', 'CCRN'],
      yearsExperience: 8,
      shiftPreference: 'day',
      recentAchievements: ['Empleado del Mes', 'Certificación CCRN']
    },
    {
      id: 2,
      name: 'Carlos López Mendoza',
      position: 'Enfermero Especialista',
      department: 'Emergencias',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      overallScore: 94,
      patientCare: 96,
      documentation: 92,
      teamwork: 94,
      efficiency: 94,
      certifications: ['BLS', 'ACLS', 'TNCC'],
      yearsExperience: 6,
      shiftPreference: 'evening',
      recentAchievements: ['Reconocimiento Excelencia', 'Mentor Junior']
    },
    {
      id: 3,
      name: 'María Rodríguez Silva',
      position: 'Enfermera Jefe',
      department: 'Cardiología',
      avatar: 'https://images.unsplash.com/photo-1594824388853-e4d2d8b3c8b0?w=150&h=150&fit=crop&crop=face',
      overallScore: 93,
      patientCare: 95,
      documentation: 96,
      teamwork: 92,
      efficiency: 89,
      certifications: ['BLS', 'ACLS', 'CCRN', 'MSN'],
      yearsExperience: 12,
      shiftPreference: 'day',
      recentAchievements: ['Liderazgo Destacado', 'Proyecto Mejora']
    },
    {
      id: 4,
      name: 'José Martínez Torres',
      position: 'Enfermero',
      department: 'Cirugía',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      overallScore: 91,
      patientCare: 93,
      documentation: 88,
      teamwork: 92,
      efficiency: 91,
      certifications: ['BLS', 'ACLS'],
      yearsExperience: 4,
      shiftPreference: 'night',
      recentAchievements: ['Capacitación Completada']
    },
    {
      id: 5,
      name: 'Laura Sánchez Vega',
      position: 'Enfermera Pediatra',
      department: 'Pediatría',
      avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face',
      overallScore: 95,
      patientCare: 97,
      documentation: 93,
      teamwork: 96,
      efficiency: 94,
      certifications: ['BLS', 'PALS', 'CPN'],
      yearsExperience: 7,
      shiftPreference: 'day',
      recentAchievements: ['Especialización Pediatría', 'Satisfacción 5/5']
    },
    {
      id: 6,
      name: 'Roberto Fernández Cruz',
      position: 'Enfermero Senior',
      department: 'Medicina Interna',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
      overallScore: 89,
      patientCare: 91,
      documentation: 87,
      teamwork: 88,
      efficiency: 90,
      certifications: ['BLS', 'ACLS'],
      yearsExperience: 5,
      shiftPreference: 'evening',
      recentAchievements: ['Mejora Continua']
    }
  ];

  const categories = [
    { value: 'overall', label: 'General', icon: 'award' },
    { value: 'patientCare', label: 'Cuidado Paciente', icon: 'heart' },
    { value: 'documentation', label: 'Documentación', icon: 'clipboard-check' },
    { value: 'teamwork', label: 'Trabajo Equipo', icon: 'users' },
    { value: 'efficiency', label: 'Eficiencia', icon: 'zap' }
  ];

  const getSortedStaff = () => {
    return [...staffData]?.sort((a, b) => b?.[selectedCategory] - a?.[selectedCategory]);
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-success';
    if (score >= 90) return 'text-primary';
    if (score >= 85) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressColor = (score) => {
    if (score >= 95) return 'bg-success';
    if (score >= 90) return 'bg-primary';
    if (score >= 85) return 'bg-warning';
    return 'bg-muted';
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return { icon: 'crown', color: 'text-yellow-500' };
      case 1:
        return { icon: 'medal', color: 'text-gray-400' };
      case 2:
        return { icon: 'award', color: 'text-amber-600' };
      default:
        return { icon: 'user', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ranking de Personal
          </h3>
          <p className="text-sm text-muted-foreground">
            Clasificación por rendimiento y métricas clave
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="text-sm text-muted-foreground">Categoría:</span>
          <div className="flex bg-muted rounded-lg p-1">
            {categories?.slice(0, 3)?.map((category) => (
              <button
                key={category?.value}
                onClick={() => setSelectedCategory(category?.value)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category?.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={category?.icon} size={14} />
                <span className="hidden sm:inline">{category?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {getSortedStaff()?.map((staff, index) => {
          const rankIcon = getRankIcon(index);
          const score = staff?.[selectedCategory];
          
          return (
            <div
              key={staff?.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                index < 3 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {index < 3 ? (
                    <Icon 
                      name={rankIcon?.icon} 
                      size={20} 
                      className={rankIcon?.color} 
                    />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <Image
                    src={staff?.avatar}
                    alt={staff?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {staff?.certifications?.length > 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="star" size={12} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {staff?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {staff?.position} • {staff?.department}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {staff?.yearsExperience} años exp.
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center space-x-1">
                        {staff?.certifications?.slice(0, 3)?.map((cert, certIndex) => (
                          <span
                            key={certIndex}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                          >
                            {cert}
                          </span>
                        ))}
                        {staff?.certifications?.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{staff?.certifications?.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                    
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {staff?.recentAchievements?.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Icon name="trophy" size={12} className="text-warning" />
                    <span className="text-xs text-muted-foreground">
                      {staff?.recentAchievements?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {staffData?.length}
            </p>
            <p className="text-xs text-muted-foreground">Personal Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {staffData?.filter(s => s?.overallScore >= 95)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Excelente (&gt;95)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {staffData?.filter(s => s?.overallScore >= 90 && s?.overallScore < 95)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Bueno (90-94)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">
              {staffData?.reduce((sum, s) => sum + s?.certifications?.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Certificaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLeaderboard;