import { supabase } from '../lib/supabase';

// Healthcare Service - Centralized data operations for healthcare management
class HealthcareService {
  
  // Patient Management
  async getPatients(filters = {}) {
    try {
      let query = supabase?.from('patients')?.select(`
          *,
          patient_admissions!inner (
            id,
            admission_date,
            discharge_date,
            diagnosis,
            is_active,
            beds (
              bed_number,
              hospital_units (
                name,
                departments (name, type)
              )
            ),
            attending_doctor:user_profiles!attending_doctor_id (
              full_name,
              role
            )
          )
        `);

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.department) {
        query = query?.eq('patient_admissions.beds.hospital_units.departments.type', filters?.department);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getPatientById(patientId) {
    try {
      const { data, error } = await supabase?.from('patients')?.select(`
          *,
          patient_admissions (
            *,
            beds (
              bed_number,
              hospital_units (
                name,
                departments (name, type)
              )
            ),
            attending_doctor:user_profiles!attending_doctor_id (
              full_name,
              role,
              department
            )
          ),
          medical_records (
            *,
            doctor:user_profiles!doctor_id (
              full_name,
              role
            )
          )
        `)?.eq('id', patientId)?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createPatient(patientData) {
    try {
      const { data, error } = await supabase?.from('patients')?.insert([patientData])?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updatePatient(patientId, updates) {
    try {
      const { data, error } = await supabase?.from('patients')?.update(updates)?.eq('id', patientId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Bed Management
  async getBeds(filters = {}) {
    try {
      let query = supabase?.from('beds')?.select(`
          *,
          hospital_units (
            name,
            floor_number,
            departments (name, type)
          ),
          patients (
            patient_id,
            first_name,
            last_name,
            status
          )
        `);

      if (filters?.unit_id) {
        query = query?.eq('unit_id', filters?.unit_id);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.department) {
        query = query?.eq('hospital_units.departments.type', filters?.department);
      }

      const { data, error } = await query?.order('bed_number');
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateBedStatus(bedId, status, patientId = null) {
    try {
      const updates = { status };
      if (patientId !== null) {
        updates.patient_id = patientId;
      }

      const { data, error } = await supabase?.from('beds')?.update(updates)?.eq('id', bedId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Staff Management
  async getStaff(filters = {}) {
    try {
      let query = supabase?.from('user_profiles')?.select(`
          *,
          staff_shifts (
            shift_type,
            start_time,
            end_time,
            is_active
          )
        `)?.eq('is_active', true);

      if (filters?.role) {
        query = query?.eq('role', filters?.role);
      }

      if (filters?.department) {
        query = query?.eq('department', filters?.department);
      }

      const { data, error } = await query?.order('full_name');
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createStaffShift(shiftData) {
    try {
      const { data, error } = await supabase?.from('staff_shifts')?.insert([shiftData])?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Department and Unit Management
  async getDepartments() {
    try {
      const { data, error } = await supabase?.from('departments')?.select(`
          *,
          head_user:user_profiles!head_user_id (
            full_name,
            role
          ),
          hospital_units (
            id,
            name,
            floor_number,
            total_beds
          )
        `)?.eq('is_active', true)?.order('name');

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getHospitalUnits(departmentId = null) {
    try {
      let query = supabase?.from('hospital_units')?.select(`
          *,
          departments (
            name,
            type
          ),
          beds (
            id,
            bed_number,
            status
          )
        `)?.eq('is_active', true);

      if (departmentId) {
        query = query?.eq('department_id', departmentId);
      }

      const { data, error } = await query?.order('name');
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Alert Management
  async getAlerts(filters = {}) {
    try {
      let query = supabase?.from('alerts')?.select(`
          *,
          patients (
            patient_id,
            first_name,
            last_name
          ),
          user_profiles!user_id (
            full_name,
            role
          ),
          resolved_by:user_profiles!resolved_by_id (
            full_name
          )
        `);

      if (filters?.severity) {
        query = query?.eq('severity', filters?.severity);
      }

      if (filters?.is_resolved !== undefined) {
        query = query?.eq('is_resolved', filters?.is_resolved);
      }

      if (filters?.patient_id) {
        query = query?.eq('patient_id', filters?.patient_id);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createAlert(alertData) {
    try {
      const { data, error } = await supabase?.from('alerts')?.insert([alertData])?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async resolveAlert(alertId, resolvedById) {
    try {
      const { data, error } = await supabase?.from('alerts')?.update({
          is_resolved: true,
          resolved_by_id: resolvedById,
          resolved_at: new Date()?.toISOString()
        })?.eq('id', alertId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Medical Records
  async getMedicalRecords(patientId) {
    try {
      const { data, error } = await supabase?.from('medical_records')?.select(`
          *,
          doctor:user_profiles!doctor_id (
            full_name,
            role,
            department
          ),
          patients (
            patient_id,
            first_name,
            last_name
          )
        `)?.eq('patient_id', patientId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createMedicalRecord(recordData) {
    try {
      const { data, error } = await supabase?.from('medical_records')?.insert([recordData])?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Equipment Management
  async getEquipment(filters = {}) {
    try {
      let query = supabase?.from('equipment')?.select(`
          *,
          departments (
            name,
            type
          )
        `);

      if (filters?.department_id) {
        query = query?.eq('department_id', filters?.department_id);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.equipment_type) {
        query = query?.eq('equipment_type', filters?.equipment_type);
      }

      const { data, error } = await query?.order('name');
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateEquipmentStatus(equipmentId, status) {
    try {
      const { data, error } = await supabase?.from('equipment')?.update({ status })?.eq('id', equipmentId)?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Dashboard Analytics
  async getDashboardStats() {
    try {
      // Get bed occupancy
      const { data: beds, error: bedsError } = await supabase?.from('beds')?.select('status');

      if (bedsError) throw bedsError;

      // Get active patients
      const { data: patients, error: patientsError } = await supabase?.from('patients')?.select('status')?.eq('status', 'active');

      if (patientsError) throw patientsError;

      // Get unresolved alerts by severity
      const { data: alerts, error: alertsError } = await supabase?.from('alerts')?.select('severity')?.eq('is_resolved', false);

      if (alertsError) throw alertsError;

      // Get current staff on duty
      const { data: staff, error: staffError } = await supabase?.from('staff_shifts')?.select(`
          user_profiles (role, department)
        `)?.eq('is_active', true)?.gte('end_time', new Date()?.toISOString());

      if (staffError) throw staffError;

      // Calculate statistics
      const totalBeds = beds?.length || 0;
      const occupiedBeds = beds?.filter(bed => bed?.status === 'occupied')?.length || 0;
      const availableBeds = beds?.filter(bed => bed?.status === 'available')?.length || 0;
      const totalPatients = patients?.length || 0;
      
      const criticalAlerts = alerts?.filter(alert => alert?.severity === 'critical')?.length || 0;
      const highAlerts = alerts?.filter(alert => alert?.severity === 'high')?.length || 0;
      const totalAlerts = alerts?.length || 0;

      const activeStaff = staff?.length || 0;

      return {
        data: {
          bedOccupancy: {
            total: totalBeds,
            occupied: occupiedBeds,
            available: availableBeds,
            occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
          },
          patients: {
            total: totalPatients,
            active: totalPatients
          },
          alerts: {
            total: totalAlerts,
            critical: criticalAlerts,
            high: highAlerts
          },
          staff: {
            onDuty: activeStaff
          }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Real-time subscriptions
  subscribeToAlerts(callback) {
    return supabase?.channel('alerts')?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' }, 
        callback
      )?.subscribe();
  }

  subscribeToBeds(callback) {
    return supabase?.channel('beds')?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'beds' }, 
        callback
      )?.subscribe();
  }

  subscribeToPatients(callback) {
    return supabase?.channel('patients')?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' }, 
        callback
      )?.subscribe();
  }

  // Utility methods
  unsubscribeAll() {
    return supabase?.removeAllChannels();
  }
}

export const healthcareService = new HealthcareService();
export default healthcareService;