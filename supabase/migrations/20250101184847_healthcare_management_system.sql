-- Location: supabase/migrations/20250101184847_healthcare_management_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete healthcare management system
-- Dependencies: auth.users (Supabase managed)

-- 1. Create Types
CREATE TYPE public.user_role AS ENUM ('admin', 'doctor', 'nurse', 'staff_manager', 'technician');
CREATE TYPE public.patient_status AS ENUM ('active', 'discharged', 'transferred', 'deceased');
CREATE TYPE public.bed_status AS ENUM ('occupied', 'available', 'maintenance', 'cleaning');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.shift_type AS ENUM ('day', 'evening', 'night');
CREATE TYPE public.department_type AS ENUM ('emergency', 'icu', 'general_ward', 'surgery', 'cardiology', 'pediatrics', 'oncology');

-- 2. Core Tables - User Profiles (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'nurse'::public.user_role,
    department public.department_type NOT NULL,
    employee_id TEXT UNIQUE,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Department and Unit Management
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type public.department_type NOT NULL,
    head_user_id UUID REFERENCES public.user_profiles(id),
    total_beds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.hospital_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    floor_number INTEGER,
    total_beds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Patient Management
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    phone TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_number TEXT,
    status public.patient_status DEFAULT 'active'::public.patient_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bed Management
CREATE TABLE public.beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bed_number TEXT NOT NULL,
    unit_id UUID REFERENCES public.hospital_units(id) ON DELETE CASCADE,
    status public.bed_status DEFAULT 'available'::public.bed_status,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Patient Admissions
CREATE TABLE public.patient_admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    bed_id UUID REFERENCES public.beds(id),
    attending_doctor_id UUID REFERENCES public.user_profiles(id),
    admission_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMPTZ,
    diagnosis TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Medical Records
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.user_profiles(id),
    record_type TEXT NOT NULL,
    description TEXT NOT NULL,
    vital_signs JSONB,
    medications JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Staff Shifts
CREATE TABLE public.staff_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id),
    shift_type public.shift_type NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Alerts and Notifications
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    user_id UUID REFERENCES public.user_profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity public.alert_severity DEFAULT 'medium'::public.alert_severity,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by_id UUID REFERENCES public.user_profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Equipment and Resources
CREATE TABLE public.equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    equipment_type TEXT NOT NULL,
    model TEXT,
    serial_number TEXT UNIQUE,
    department_id UUID REFERENCES public.departments(id),
    status TEXT DEFAULT 'available',
    last_maintenance TIMESTAMPTZ,
    next_maintenance TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);
CREATE INDEX idx_patients_status ON public.patients(status);
CREATE INDEX idx_beds_status ON public.beds(status);
CREATE INDEX idx_beds_unit_id ON public.beds(unit_id);
CREATE INDEX idx_patient_admissions_patient_id ON public.patient_admissions(patient_id);
CREATE INDEX idx_patient_admissions_active ON public.patient_admissions(is_active);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX idx_staff_shifts_user_id ON public.staff_shifts(user_id);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_resolved ON public.alerts(is_resolved);

-- 12. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- 13. Helper Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_admin_or_doctor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'doctor')
    AND up.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.is_same_department(target_department public.department_type)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.department = target_department
    AND up.is_active = true
)
$$;

-- 14. RLS Policies Using Correct Patterns

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6A: Role-based access for departments (Admin access)
CREATE POLICY "admin_full_access_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

CREATE POLICY "staff_read_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

-- Pattern 6A: Role-based access for hospital units
CREATE POLICY "admin_full_access_hospital_units"
ON public.hospital_units
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

CREATE POLICY "staff_read_hospital_units"
ON public.hospital_units
FOR SELECT
TO authenticated
USING (true);

-- Pattern 6A: Role-based access for patients
CREATE POLICY "admin_doctor_full_access_patients"
ON public.patients
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

CREATE POLICY "staff_read_patients"
ON public.patients
FOR SELECT
TO authenticated
USING (true);

-- Pattern 4: Public read for beds (staff can see all beds)
CREATE POLICY "staff_read_beds"
ON public.beds
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_doctor_manage_beds"
ON public.beds
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

-- Pattern 6A: Role-based access for patient admissions
CREATE POLICY "admin_doctor_full_access_admissions"
ON public.patient_admissions
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

CREATE POLICY "staff_read_admissions"
ON public.patient_admissions
FOR SELECT
TO authenticated
USING (true);

-- Pattern 6A: Role-based access for medical records
CREATE POLICY "admin_doctor_full_access_medical_records"
ON public.medical_records
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

CREATE POLICY "staff_read_medical_records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (true);

-- Pattern 2: Simple user ownership for staff shifts
CREATE POLICY "users_manage_own_staff_shifts"
ON public.staff_shifts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, admin manage for alerts
CREATE POLICY "staff_read_alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_alerts"
ON public.alerts
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

-- Pattern 4: Public read, admin manage for equipment
CREATE POLICY "staff_read_equipment"
ON public.equipment
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_equipment"
ON public.equipment
FOR ALL
TO authenticated
USING (public.is_admin_or_doctor())
WITH CHECK (public.is_admin_or_doctor());

-- 15. Automatic profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, department)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'nurse')::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'department', 'general_ward')::public.department_type
  );  
  RETURN NEW;
END;
$$;

-- 16. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Mock Data for Healthcare System
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    doctor_uuid UUID := gen_random_uuid();
    nurse_uuid UUID := gen_random_uuid();
    icu_dept_id UUID := gen_random_uuid();
    general_dept_id UUID := gen_random_uuid();
    icu_unit_id UUID := gen_random_uuid();
    general_unit_id UUID := gen_random_uuid();
    patient1_id UUID := gen_random_uuid();
    patient2_id UUID := gen_random_uuid();
    bed1_id UUID := gen_random_uuid();
    bed2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@hospital.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Hospital Administrator", "role": "admin", "department": "general_ward"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (doctor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'doctor@hospital.com', crypt('doctor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Johnson", "role": "doctor", "department": "icu"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (nurse_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'nurse@hospital.com', crypt('nurse123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Maria Rodriguez", "role": "nurse", "department": "general_ward"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create departments
    INSERT INTO public.departments (id, name, type, head_user_id, total_beds) VALUES
        (icu_dept_id, 'Intensive Care Unit', 'icu'::public.department_type, doctor_uuid, 20),
        (general_dept_id, 'General Ward', 'general_ward'::public.department_type, admin_uuid, 100);

    -- Create hospital units
    INSERT INTO public.hospital_units (id, name, department_id, floor_number, total_beds) VALUES
        (icu_unit_id, 'ICU East Wing', icu_dept_id, 3, 20),
        (general_unit_id, 'General Ward A', general_dept_id, 2, 50);

    -- Create patients
    INSERT INTO public.patients (id, patient_id, first_name, last_name, date_of_birth, gender, phone, emergency_contact_name, emergency_contact_phone) VALUES
        (patient1_id, 'PAT001', 'John', 'Smith', '1980-05-15', 'Male', '+1234567890', 'Jane Smith', '+1234567891'),
        (patient2_id, 'PAT002', 'Emily', 'Davis', '1975-12-22', 'Female', '+1234567892', 'Robert Davis', '+1234567893');

    -- Create beds
    INSERT INTO public.beds (id, bed_number, unit_id, status, patient_id) VALUES
        (bed1_id, 'ICU-01', icu_unit_id, 'occupied'::public.bed_status, patient1_id),
        (bed2_id, 'GW-A-15', general_unit_id, 'occupied'::public.bed_status, patient2_id);

    -- Create patient admissions
    INSERT INTO public.patient_admissions (patient_id, bed_id, attending_doctor_id, diagnosis, notes) VALUES
        (patient1_id, bed1_id, doctor_uuid, 'Acute myocardial infarction', 'Patient stabilized, monitoring required'),
        (patient2_id, bed2_id, doctor_uuid, 'Pneumonia', 'Responding well to treatment');

    -- Create medical records
    INSERT INTO public.medical_records (patient_id, doctor_id, record_type, description, vital_signs) VALUES
        (patient1_id, doctor_uuid, 'Assessment', 'Initial cardiac assessment', '{"heart_rate": 85, "blood_pressure": "140/90", "temperature": 98.6, "oxygen_saturation": 96}'::jsonb),
        (patient2_id, doctor_uuid, 'Progress Note', 'Patient showing improvement', '{"heart_rate": 78, "blood_pressure": "120/80", "temperature": 99.2, "oxygen_saturation": 98}'::jsonb);

    -- Create staff shifts
    INSERT INTO public.staff_shifts (user_id, department_id, shift_type, start_time, end_time) VALUES
        (doctor_uuid, icu_dept_id, 'day'::public.shift_type, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
        (nurse_uuid, general_dept_id, 'day'::public.shift_type, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '12 hours');

    -- Create alerts
    INSERT INTO public.alerts (patient_id, user_id, title, message, severity) VALUES
        (patient1_id, doctor_uuid, 'Medication Alert', 'Patient requires cardiac medication in 30 minutes', 'high'::public.alert_severity),
        (patient2_id, nurse_uuid, 'Vital Signs Check', 'Schedule vital signs check', 'medium'::public.alert_severity);

    -- Create equipment
    INSERT INTO public.equipment (name, equipment_type, model, serial_number, department_id, status) VALUES
        ('Cardiac Monitor A1', 'Monitor', 'CM-2000', 'SN001234', icu_dept_id, 'available'),
        ('Ventilator B2', 'Life Support', 'VENT-3000', 'SN005678', icu_dept_id, 'in_use');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;