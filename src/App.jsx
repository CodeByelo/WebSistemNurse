// src/App.jsx
import React, { useEffect } from 'react';
import Routes from './Routes';
import './styles/tailwind.css';
import api from './services/api'; // ✅ Ya existe

const App = () => {
  useEffect(() => {
    api.get('/pacientes')
      .then(({ data }) => {
        console.log('✅ Pacientes reales:', data);
      })
      .catch(err => {
        console.error('❌ Error cargando pacientes:', err.message);
      });
  }, []);

  return <Routes />;
};

export default App;