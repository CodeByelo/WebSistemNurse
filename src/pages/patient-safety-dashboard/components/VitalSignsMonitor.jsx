import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const VitalSignsMonitor = ({ selectedPatient, alertThresholds }) => {
  const [vitalData, setVitalData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState('heartRate');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRealTime, setIsRealTime] = useState(true);

  const parameters = {
    heartRate: {
      label: 'Frecuencia Cardíaca',
      unit: 'bpm',
      color: '#ef4444',
      icon: 'heart',
      normal: { min: 60, max: 100 },
      critical: { min: 40, max: 150 }
    },
    bloodPressure: {
      label: 'Presión Arterial',
      unit: 'mmHg',
      color: '#3b82f6',
      icon: 'activity',
      normal: { min: 90, max: 140 },
      critical: { min: 70, max: 180 }
    },
    oxygenSaturation: {
      label: 'Saturación O2',
      unit: '%',
      color: '#10b981',
      icon: 'wind',
      normal: { min: 95, max: 100 },
      critical: { min: 85, max: 100 }
    },
    temperature: {
      label: 'Temperatura',
      unit: '°C',
      color: '#f59e0b',
      icon: 'thermometer',
      normal: { min: 36.1, max: 37.2 },
      critical: { min: 35.0, max: 39.0 }
    },
    respiratoryRate: {
      label: 'Frecuencia Respiratoria',
      unit: 'rpm',
      color: '#8b5cf6',
      icon: 'waves',
      normal: { min: 12, max: 20 },
      critical: { min: 8, max: 30 }
    }
  };

  // Generate mock vital signs data
  useEffect(() => {
    const generateVitalData = () => {
      const now = new Date();
      const data = [];
      const points = timeRange === '1h' ? 12 : timeRange === '4h' ? 48 : 144;
      const interval = timeRange === '1h' ? 5 : timeRange === '4h' ? 5 : 10;

      for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * interval * 60000));
        const baseValues = {
          heartRate: 75 + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 8,
          bloodPressure: 120 + Math.sin(i * 0.15) * 15 + (Math.random() - 0.5) * 10,
          oxygenSaturation: 98 + Math.sin(i * 0.05) * 2 + (Math.random() - 0.5) * 1,
          temperature: 36.8 + Math.sin(i * 0.08) * 0.5 + (Math.random() - 0.5) * 0.3,
          respiratoryRate: 16 + Math.sin(i * 0.12) * 3 + (Math.random() - 0.5) * 2
        };

        data?.push({
          time: time?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time,
          ...baseValues
        });
      }

      return data;
    };

    setVitalData(generateVitalData());

    // Real-time updates
    if (isRealTime) {
      const interval = setInterval(() => {
        setVitalData(prev => {
          const newData = [...prev];
          const now = new Date();
          const lastValue = newData?.[newData?.length - 1];
          
          const newPoint = {
            time: now?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            timestamp: now,
            heartRate: lastValue?.heartRate + (Math.random() - 0.5) * 4,
            bloodPressure: lastValue?.bloodPressure + (Math.random() - 0.5) * 6,
            oxygenSaturation: Math.max(85, Math.min(100, lastValue?.oxygenSaturation + (Math.random() - 0.5) * 1)),
            temperature: lastValue?.temperature + (Math.random() - 0.5) * 0.2,
            respiratoryRate: lastValue?.respiratoryRate + (Math.random() - 0.5) * 2
          };

          newData?.push(newPoint);
          return newData?.slice(-50); // Keep last 50 points
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [timeRange, isRealTime, selectedPatient]);

  const getCurrentValue = () => {
    if (vitalData?.length === 0) return null;
    return vitalData?.[vitalData?.length - 1]?.[selectedParameter];
  };

  const getParameterStatus = (value, parameter) => {
    const config = parameters?.[parameter];
    if (value < config?.critical?.min || value > config?.critical?.max) {
      return 'critical';
    }
    if (value < config?.normal?.min || value > config?.normal?.max) {
      return 'warning';
    }
    return 'normal';
  };

  const currentValue = getCurrentValue();
  const currentStatus = currentValue ? getParameterStatus(currentValue, selectedParameter) : 'normal';
  const currentParameter = parameters?.[selectedParameter];

  const formatValue = (value) => {
    if (selectedParameter === 'temperature') {
      return value?.toFixed(1);
    }
    return Math.round(value);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="activity" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Monitor de Signos Vitales
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`p-2 rounded-sm transition-colors ${
                isRealTime ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}
              title={isRealTime ? 'Tiempo real activo' : 'Tiempo real pausado'}
            >
              <Icon name={isRealTime ? 'play' : 'pause'} size={16} />
            </button>
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(parameters)?.map(([key, param]) => (
            <button
              key={key}
              onClick={() => setSelectedParameter(key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                selectedParameter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={param?.icon} size={16} />
              <span>{param?.label}</span>
            </button>
          ))}
        </div>

        {/* Time Range Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rango:</span>
          {['1h', '4h', '12h']?.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 rounded-sm text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {/* Current Value Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name={currentParameter?.icon} size={20} style={{ color: currentParameter?.color }} />
              <span className="text-lg font-semibold text-foreground">
                {currentParameter?.label}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'critical' ? 'bg-error text-error-foreground' :
              currentStatus === 'warning' ? 'bg-warning text-warning-foreground' :
              'bg-success text-success-foreground'
            }`}>
              {currentStatus === 'critical' ? 'Crítico' :
               currentStatus === 'warning' ? 'Precaución' : 'Normal'}
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold" style={{ color: currentParameter?.color }}>
              {currentValue ? formatValue(currentValue) : '--'}
            </span>
            <span className="text-lg text-muted-foreground">
              {currentParameter?.unit}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">
            Normal: {currentParameter?.normal?.min} - {currentParameter?.normal?.max} {currentParameter?.unit}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [formatValue(value), currentParameter?.label]}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              
              {/* Normal range reference lines */}
              <ReferenceLine 
                y={currentParameter?.normal?.min} 
                stroke="#10b981" 
                strokeDasharray="5 5" 
                strokeOpacity={0.6}
              />
              <ReferenceLine 
                y={currentParameter?.normal?.max} 
                stroke="#10b981" 
                strokeDasharray="5 5" 
                strokeOpacity={0.6}
              />
              
              {/* Critical range reference lines */}
              <ReferenceLine 
                y={currentParameter?.critical?.min} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                strokeOpacity={0.8}
              />
              <ReferenceLine 
                y={currentParameter?.critical?.max} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                strokeOpacity={0.8}
              />
              
              <Line
                type="monotone"
                dataKey={selectedParameter}
                stroke={currentParameter?.color}
                strokeWidth={2}
                dot={{ fill: currentParameter?.color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: currentParameter?.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Thresholds */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-success rounded" />
                <span className="text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-error rounded" style={{ borderStyle: 'dashed' }} />
                <span className="text-muted-foreground">Crítico</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              Última actualización: {new Date()?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsMonitor;