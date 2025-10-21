import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const NuevaConsulta = () => {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    tipoUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    carnet: '',
    carrera: '',
    semestre: '',
    codigoEmpleado: '',
    departamento: '',
    categoria: '',
    cargo: '',
    extension: '',
    motivo: '',
    sintomas: '',
    diagnostico: '',
    medicamentos: [],
    notas: '',
    prioridad: 'normal'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSiguiente = () => {
    if (paso === 1 && formData.tipoUsuario === '') {
      alert('⚠️ Por favor selecciona un tipo de usuario antes de continuar.');
      return;
    }
    if (paso < 4) setPaso(prev => prev + 1);
  };

  const handleAnterior = () => {
    if (paso > 1) setPaso(prev => prev - 1);
  };

  // --- FUNCIÓN CORREGIDA (URL SIN ERROR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- CAMBIO AQUÍ: URL CORRECTA ---
      const respuesta = await fetch('http://localhost:3001/api/pacientes', {
      // --- FIN CAMBIO ---
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          carnet: formData.carnet,
          carrera: formData.carrera,
        })
      });

      const resultado = await respuesta.json();
      if (respuesta.ok) {
        alert('✅ Consulta y paciente registrados con éxito!');
        console.log('Datos guardados en Neon:', resultado.paciente);
      } else {
        alert('❌ Error: ' + resultado.error);
      }
    } catch (error) {
      alert('❌ Error conectando con el servidor: ' + error.message);
      console.error('Error:', error);
    }
  };
  // --- FIN DE LA FUNCIÓN CORREGIDA ---

  const renderCamposEspecificos = () => {
    const inputStyle =
      'w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300';
    const selectStyle =
      'w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300';

    if (!formData.tipoUsuario) {
      return (
        <p className="text-center text-gray-600 text-lg py-6">
          ⚠️ Primero selecciona el tipo de usuario en el paso anterior.
        </p>
      );
    }

    switch (formData.tipoUsuario) {
      case 'estudiante':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="carnet"
              placeholder="Carnet Universitario"
              value={formData.carnet}
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="carrera"
              placeholder="Carrera/Mención"
              value={formData.carrera}
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="semestre"
              placeholder="Semestre/Año"
              value={formData.semestre}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        );
      case 'profesor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="codigoEmpleado"
              placeholder="Código de Empleado"
              value={formData.codigoEmpleado}
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="departamento"
              placeholder="Departamento/Facultad"
              value={formData.departamento}
              onChange={handleChange}
              className={inputStyle}
            />
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={selectStyle}
            >
              <option value="">Seleccione categoría</option>
              <option value="auxiliar">Auxiliar</option>
              <option value="asociado">Asociado</option>
              <option value="titular">Titular</option>
            </select>
          </div>
        );
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="cargo"
              placeholder="Cargo/Departamento"
              value={formData.cargo}
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="extension"
              placeholder="Extensión Telefónica"
              value={formData.extension}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-600 opacity-10 blur-3xl"></div>
            <h1 className="text-4xl font-bold text-gray-900">
              Nueva Consulta
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Sistema de Atención Médica ISUM
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mt-4 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">En Línea</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg transition-all duration-500 ${
                      paso >= num
                        ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {num}
                  </div>
                  {paso > num && (
                    <Icon
                      name="check"
                      size={16}
                      className="absolute -right-1 -top-1 text-green-500 bg-white rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(paso / 4) * 100}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600 mt-3 font-medium">
              Paso {paso} de 4:{' '}
              {paso === 1 && '📋 Información del Usuario'}
              {paso === 2 && '🎯 Datos Específicos'}
              {paso === 3 && '🩺 Consulta Médica'}
              {paso === 4 && '💊 Tratamiento y Notas'}
            </div>
          </div>

          {paso === 1 && (
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center glow-effect">
                  <Icon name="user" size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Información del Usuario
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  name="tipoUsuario"
                  value={formData.tipoUsuario}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                  required
                >
                  <option value="">Seleccione tipo de usuario</option>
                  <option value="estudiante">🎓 Estudiante</option>
                  <option value="profesor">👨‍🏫 Profesor</option>
                  <option value="personal">👨‍💼 Personal Administrativo</option>
                </select>
                <Input
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center glow-effect">
                  <Icon name="id-card" size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Datos Específicos
                </h2>
              </div>
              {renderCamposEspecificos()}
            </div>
          )}

          {paso === 3 && (
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center glow-effect">
                  <Icon name="stethoscope" size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Consulta Médica
                </h2>
              </div>
              <div className="space-y-6">
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                >
                  <option value="normal">🟢 Normal</option>
                  <option value="urgente">🔴 Urgente</option>
                </select>
                <textarea
                  name="motivo"
                  placeholder="Motivo de consulta"
                  value={formData.motivo}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                />
                <textarea
                  name="sintomas"
                  placeholder="Síntomas presentados"
                  value={formData.sintomas}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                />
                <textarea
                  name="diagnostico"
                  placeholder="Diagnóstico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center glow-effect">
                  <Icon name="pill" size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tratamiento y Notas
                </h2>
              </div>
              <div className="space-y-6">
                <textarea
                  name="medicamentos"
                  placeholder="Medicamentos entregados (uno por línea)"
                  value={formData.medicamentos.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicamentos: e.target.value.split('\n')
                    })
                  }
                  rows="5"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                />
                <textarea
                  name="notas"
                  placeholder="Notas y recomendaciones"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20 transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10">
            <button
              onClick={handleAnterior}
              disabled={paso === 1}
              className="group relative px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-orange-400 hover:text-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Icon name="arrow-left" size={18} />
                Anterior
              </span>
            </button>

            <button
              onClick={paso < 4 ? handleSiguiente : handleSubmit}
              className="group relative px-8 py-3 bg-blue-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                {paso < 4 ? 'Siguiente' : 'Registrar Consulta'}
                <Icon
                  name={paso < 4 ? 'arrow-right' : 'check-circle'}
                  size={18}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default NuevaConsulta;