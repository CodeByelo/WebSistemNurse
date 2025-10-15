import React, { useEffect } from 'react';
import Routes from './Routes';
import './styles/tailwind.css';
import { supabase } from './lib/supabase';

const App = () => {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('patients').select('*');
      console.log('✅ Pacientes reales:', data);
      console.log('❌ Error:', error);
    })();
  }, []);

  return <Routes />;
};

export default App;