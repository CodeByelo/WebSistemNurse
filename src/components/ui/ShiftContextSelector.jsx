import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';
import Select from './Select';

const ShiftContext = createContext();

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};

const ShiftContextSelector = ({ children, showSelector = true, className = '' }) => {
  const [currentShift, setCurrentShift] = useState('day');
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [shiftData, setShiftData] = useState({});

  const shiftOptions = [
    { value: 'day', label: 'Día (7:00 - 19:00)', icon: 'sun' },
    { value: 'evening', label: 'Tarde (19:00 - 23:00)', icon: 'sunset' },
    { value: 'night', label: 'Noche (23:00 - 7:00)', icon: 'moon' }
  ];

  // Auto-detect shift based on current time
  const detectCurrentShift = () => {
    const hour = new Date()?.getHours();
    if (hour >= 7 && hour < 19) {
      return 'day';
    } else if (hour >= 19 && hour < 23) {
      return 'evening';
    } else {
      return 'night';
    }
  };

  // Initialize shift context
  useEffect(() => {
    const savedShift = localStorage.getItem('selectedShift');
    const savedAutoDetect = localStorage.getItem('shiftAutoDetect') === 'true';
    
    setIsAutoDetect(savedAutoDetect);
    
    if (savedAutoDetect || !savedShift) {
      const detectedShift = detectCurrentShift();
      setCurrentShift(detectedShift);
    } else {
      setCurrentShift(savedShift);
    }
  }, []);

  // Auto-detect shift changes
  useEffect(() => {
    if (!isAutoDetect) return;

    const detectShift = () => {
      const detectedShift = detectCurrentShift();
      if (detectedShift !== currentShift) {
        setCurrentShift(detectedShift);
      }
    };

    detectShift();
    const interval = setInterval(detectShift, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentShift, isAutoDetect]);

  const handleShiftChange = (newShift) => {
    setCurrentShift(newShift);
    setIsAutoDetect(false);
    localStorage.setItem('selectedShift', newShift);
    localStorage.setItem('shiftAutoDetect', 'false');
    
    // Trigger data refresh for new shift context
    refreshShiftData(newShift);
  };

  const toggleAutoDetect = () => {
    const newAutoDetect = !isAutoDetect;
    setIsAutoDetect(newAutoDetect);
    localStorage.setItem('shiftAutoDetect', newAutoDetect?.toString());
    
    if (newAutoDetect) {
      const detectedShift = detectCurrentShift();
      setCurrentShift(detectedShift);
      localStorage.removeItem('selectedShift');
    }
  };

  const refreshShiftData = (shift = currentShift) => {
    // This would typically trigger API calls to refresh data for the selected shift
    console.log(`Refreshing data for ${shift} shift`);
    
    // Simulate data loading
    setShiftData(prev => ({
      ...prev,
      [shift]: {
        lastUpdated: new Date()?.toISOString(),
        loading: true
      }
    }));

    // Simulate API call completion
    setTimeout(() => {
      setShiftData(prev => ({
        ...prev,
        [shift]: {
          lastUpdated: new Date()?.toISOString(),
          loading: false
        }
      }));
    }, 1000);
  };

  const getShiftInfo = (shift = currentShift) => {
    const shiftConfig = shiftOptions?.find(s => s?.value === shift);
    return {
      ...shiftConfig,
      isActive: shift === currentShift,
      data: shiftData?.[shift] || {},
      timeRange: getShiftTimeRange(shift)
    };
  };

  const getShiftTimeRange = (shift) => {
    const ranges = {
      day: { start: '07:00', end: '19:00' },
      evening: { start: '19:00', end: '23:00' },
      night: { start: '23:00', end: '07:00' }
    };
    return ranges?.[shift];
  };

  const contextValue = {
    currentShift,
    isAutoDetect,
    shiftOptions,
    shiftData,
    handleShiftChange,
    toggleAutoDetect,
    refreshShiftData,
    getShiftInfo,
    getShiftTimeRange
  };

  const ShiftSelector = () => {
    if (!showSelector) return null;

    const currentShiftInfo = getShiftInfo();

    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <Icon 
            name={currentShiftInfo?.icon} 
            size={16} 
            className="text-muted-foreground" 
          />
          <span className="text-sm text-muted-foreground">Turno:</span>
        </div>
        <Select
          value={currentShift}
          onChange={handleShiftChange}
          options={shiftOptions?.map(option => ({
            value: option?.value,
            label: option?.label
          }))}
          className="min-w-[180px]"
        />
        <button
          onClick={toggleAutoDetect}
          className={`p-1 rounded-clinical-sm transition-all duration-200 ${
            isAutoDetect 
              ? 'text-primary hover:bg-primary/10' :'text-muted-foreground hover:bg-muted'
          }`}
          title={isAutoDetect ? 'Detección automática activada' : 'Detección automática desactivada'}
        >
          <Icon 
            name={isAutoDetect ? 'clock' : 'clock-off'} 
            size={16} 
          />
        </button>
        {shiftData?.[currentShift]?.loading && (
          <Icon 
            name="loader-2" 
            size={16} 
            className="animate-spin text-primary" 
          />
        )}
      </div>
    );
  };

  return (
    <ShiftContext.Provider value={contextValue}>
      {children}
      {showSelector && <ShiftSelector />}
    </ShiftContext.Provider>
  );
};

export default ShiftContextSelector;
export { ShiftContext };