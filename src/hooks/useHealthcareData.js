import { useState, useEffect, useCallback } from 'react';
import { healthcareService } from '../services/healthcareService';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for healthcare data management
export const useHealthcareData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic data fetcher
  const fetchData = useCallback(async (servicMethod, params = {}) => {
    if (!servicMethod) return { data: null, error: 'Service method is required' };

    setLoading(true);
    setError(null);

    try {
      const result = await servicMethod(params);
      setLoading(false);
      
      if (result?.error) {
        setError(result?.error);
        return { data: null, error: result?.error };
      }

      return { data: result?.data, error: null };
    } catch (err) {
      setLoading(false);
      setError(err);
      return { data: null, error: err };
    }
  }, []);

  return {
    loading,
    error,
    fetchData,
    clearError: () => setError(null)
  };
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getDashboardStats();
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setStats(result?.data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for patient management
export const usePatients = (filters = {}) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getPatients(filters);
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setPatients(result?.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createPatient = useCallback(async (patientData) => {
    try {
      const result = await healthcareService?.createPatient(patientData);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchPatients();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchPatients]);

  const updatePatient = useCallback(async (patientId, updates) => {
    try {
      const result = await healthcareService?.updatePatient(patientId, updates);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchPatients();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchPatients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    refetch: fetchPatients
  };
};

// Hook for bed management
export const useBeds = (filters = {}) => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBeds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getBeds(filters);
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setBeds(result?.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateBedStatus = useCallback(async (bedId, status, patientId = null) => {
    try {
      const result = await healthcareService?.updateBedStatus(bedId, status, patientId);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchBeds();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchBeds]);

  useEffect(() => {
    fetchBeds();
  }, [fetchBeds]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = healthcareService?.subscribeToBeds((payload) => {
      fetchBeds(); // Refresh on any bed changes
    });

    return () => {
      if (subscription) {
        healthcareService?.unsubscribeAll();
      }
    };
  }, [fetchBeds]);

  return {
    beds,
    loading,
    error,
    updateBedStatus,
    refetch: fetchBeds
  };
};

// Hook for alerts management
export const useAlerts = (filters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getAlerts(filters);
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setAlerts(result?.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createAlert = useCallback(async (alertData) => {
    try {
      const result = await healthcareService?.createAlert(alertData);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchAlerts();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchAlerts]);

  const resolveAlert = useCallback(async (alertId, resolvedById) => {
    try {
      const result = await healthcareService?.resolveAlert(alertId, resolvedById);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchAlerts();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchAlerts]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = healthcareService?.subscribeToAlerts((payload) => {
      fetchAlerts(); // Refresh on any alert changes
    });

    return () => {
      if (subscription) {
        healthcareService?.unsubscribeAll();
      }
    };
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    createAlert,
    resolveAlert,
    refetch: fetchAlerts
  };
};

// Hook for staff management
export const useStaff = (filters = {}) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getStaff(filters);
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setStaff(result?.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createShift = useCallback(async (shiftData) => {
    try {
      const result = await healthcareService?.createStaffShift(shiftData);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchStaff();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchStaff]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    createShift,
    refetch: fetchStaff
  };
};

// Hook for equipment management
export const useEquipment = (filters = {}) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await healthcareService?.getEquipment(filters);
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setEquipment(result?.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateEquipmentStatus = useCallback(async (equipmentId, status) => {
    try {
      const result = await healthcareService?.updateEquipmentStatus(equipmentId, status);
      
      if (result?.error) {
        setError(result?.error);
        return { success: false, error: result?.error };
      }

      // Refresh the list
      await fetchEquipment();
      return { success: true, data: result?.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  }, [fetchEquipment]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  return {
    equipment,
    loading,
    error,
    updateEquipmentStatus,
    refetch: fetchEquipment
  };
};

export default useHealthcareData;