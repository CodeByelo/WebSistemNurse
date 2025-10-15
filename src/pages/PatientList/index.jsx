import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Layout from './Layout';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setPatients(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-6">Cargando pacientes...</p>;

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Pacientes Registrados</h1>
            <button onClick={() => navigate('/patients/register')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Alta Paciente</button>
          </div>
          <div className="grid gap-4">
            {patients.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{p.full_name}</div>
                    <div className="text-sm text-muted-foreground">DNI: {p.dni} | Habitación: {p.room} | Cama: {p.bed_id}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.risk_level === 'critical' ? 'bg-red-100 text-red-700' :
                    p.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                    p.risk_level === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>{p.risk_level.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientList;