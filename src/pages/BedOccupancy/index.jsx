import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Layout from './Layout'; // ← Importación agregada

const BedOccupancy = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('room, bed_id, full_name, risk_level')
        .not('bed_id', 'is', null);

      if (!error) setBeds(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-6">Cargando camas...</p>;

  return (
    <Layout> {/* ← Envuelto con Layout */}
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ocupación de Camas</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beds.map((b) => (
              <div
                key={`${b.room}-${b.bed_id}`}
                className={`border rounded-lg p-4 text-center ${
                  b.risk_level === 'critical' ? 'bg-red-50 border-red-200' :
                  b.risk_level === 'high' ? 'bg-orange-50 border-orange-200' :
                  b.risk_level === 'medium' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="font-bold text-lg">{b.bed_id}</div>
                <div className="text-sm text-muted-foreground">Hab. {b.room}</div>
                <div className="text-sm font-medium mt-1">{b.full_name}</div>
                <div className="text-xs uppercase mt-1">{b.risk_level}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout> // ← Cierre de Layout
  );
};

export default BedOccupancy;