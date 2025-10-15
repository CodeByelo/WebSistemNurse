import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Layout from './Layout';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', dni: '', room: '', bed_id: '', risk_level: 'medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);
    const { data, error } = await supabase.from('patients').insert([form]);
    if (error) setError(error.message); else { setSuccess(true); setTimeout(() => navigate('/'), 1500); }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Alta de Paciente</h1>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">¡Paciente guardado!</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="full_name" placeholder="Nombre completo" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="dni" placeholder="DNI" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="room" placeholder="Habitación" onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="bed_id" placeholder="Cama" onChange={handleChange} className="w-full p-2 border rounded" />
            <select name="risk_level" onChange={handleChange} className="w-full p-2 border rounded">
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="critical">Crítico</option>
            </select>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PatientRegistration;