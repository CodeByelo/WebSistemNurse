import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const LoginForm = () => {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretAccess, setShowSecretAccess] = useState(false);

  // 🔓 DETECTOR DE TECLAS PARA ACCESO DIRECTO
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        handleDirectAccess();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!formData?.email || !formData?.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const { error: authError } = await signIn(formData?.email, formData?.password);
      
      if (authError) {
        if (authError?.message?.includes('Invalid login credentials')) {
          setError('Correo electrónico o contraseña incorrectos. Por favor verifique sus credenciales.');
        } else if (authError?.message?.includes('Email not confirmed')) {
          setError('Por favor verifique su correo electrónico y confirme su cuenta antes de iniciar sesión.');
        } else if (authError?.message?.includes('Too many requests')) {
          setError('Demasiados intentos de inicio de sesión. Por favor espere un momento antes de intentar nuevamente.');
        } else {
          setError(authError?.message || 'Ocurrió un error durante el inicio de sesión. Por favor intente nuevamente.');
        }
        return;
      }

      // 🎯 REDIRECCIÓN AL NUEVO DASHBOARD DE ENFERMERÍA
      navigate('/dashboard-enfermeria');
    } catch (err) {
      setError('Error de conexión. Por favor verifique su conexión e intente nuevamente.');
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setError('');

    try {
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        setError('El inicio de sesión demo falló. La cuenta demo puede no estar disponible.');
        return;
      }

      // 🎯 REDIRECCIÓN AL NUEVO DASHBOARD DE ENFERMERÍA
      navigate('/dashboard-enfermeria');
    } catch (err) {
      setError('Error de conexión durante el inicio de sesión demo. Por favor intente nuevamente.');
    }
  };

  // 🔓 FUNCIÓN MEJORADA PARA ACCESO DIRECTO
  const handleDirectAccess = () => {
    console.log('🔓 Acceso directo activado - Forzando acceso...');
    
    // Simular usuario logueado con más datos
    const userData = {
      email: 'admin@isum.edu.ve',
      name: 'Administrador ISUM',
      role: 'admin',
      isDirectAccess: true,
      id: 'admin-001',
      avatar: '',
      permissions: ['read', 'write', 'admin']
    };
    
    // Guardar en localStorage de múltiples maneras
    localStorage.setItem('nurse_user', JSON.stringify(userData));
    localStorage.setItem('supabase.auth.token', 'direct-access-token');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'admin');
    
    console.log('✅ Usuario simulado guardado en localStorage');
    
    // 🎯 MÚLTIPLES MÉTODOS DE REDIRECCIÓN
    console.log('🚀 Intentando redirección a dashboard-enfermeria');
    
    // Método 1: Navegación normal
    navigate('/dashboard-enfermeria');
    
    // Método 2: Forzar recarga después de un delay
    setTimeout(() => {
      console.log('🔄 Forzando recarga de la página...');
      window.location.href = '/dashboard-enfermeria';
    }, 100);
    
    // Método 3: Recarga completa como fallback
    setTimeout(() => {
      console.log('⚡ Último intento: recarga completa');
      window.location.reload();
    }, 500);
  };

  // 🔓 ACTIVAR BOTÓN OCULTO CON DOBLE CLIC
  const handleLogoDoubleClick = () => {
    console.log('🎯 Logo activado - Mostrando botón secreto');
    setShowSecretAccess(true);
    
    // Ocultar después de 10 segundos
    setTimeout(() => {
      setShowSecretAccess(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Encabezado con estilo ISUM */}
        <div className="text-center">
          <div 
            className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg cursor-pointer transition-transform hover:scale-105"
            onDoubleClick={handleLogoDoubleClick}
            title="Doble clic para acceso rápido de desarrollo"
          >
            <Icon name="activity" size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-700 to-orange-600 bg-clip-text text-transparent">
              ISUM - Enfermería
            </span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-orange-200 shadow-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <p className="text-sm text-gray-600">Instituto Universitario de Salud</p>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-orange-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                <Icon name="alert-circle" size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-orange-800">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-xs text-orange-600 hover:text-orange-800 mt-1 underline"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData?.email}
                onChange={handleChange}
                placeholder="usuario@isum.edu.ve"
                className="w-full border-orange-200 focus:border-orange-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData?.password}
                  onChange={handleChange}
                  placeholder="Ingrese su contraseña"
                  className="w-full pr-10 border-orange-200 focus:border-orange-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Icon 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={16} 
                    className="text-orange-400 hover:text-orange-600" 
                  />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* 🔓 BOTÓN OCULTO DE ACCESO DIRECTO - MEJORADO */}
          {showSecretAccess && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="zap" size={20} className="text-green-600" />
                  <p className="text-sm font-semibold text-green-800">ACCESO RÁPIDO</p>
                </div>
                <p className="text-xs text-gray-600 mb-3">Para desarrollo y pruebas</p>
                <Button
                  onClick={handleDirectAccess}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                  size="sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="rocket" size={16} />
                    Entrar Directamente al Panel
                  </span>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  También usa: <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">D</kbd>
                </p>
              </div>
            </div>
          )}

          {/* Credenciales de Demo */}
          <div className="mt-8 pt-6 border-t border-orange-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Icon name="key" size={16} className="text-orange-500" />
              Accesos de Prueba
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-3 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Administrador</p>
                    <p className="text-xs text-gray-600">admin@isum.edu.ve / admin123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('admin@hospital.com', 'admin123')}
                    disabled={loading}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Iniciar
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-3 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Doctor</p>
                    <p className="text-xs text-gray-600">doctor@isum.edu.ve / doctor123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('doctor@hospital.com', 'doctor123')}
                    disabled={loading}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Iniciar
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-3 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enfermera/o</p>
                    <p className="text-xs text-gray-600">enfermeria@isum.edu.ve / enfermeria123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('nurse@hospital.com', 'nurse123')}
                    disabled={loading}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Iniciar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 bg-gradient-to-r from-blue-50 to-orange-50 py-2 px-3 rounded-lg border border-orange-200">
              Sistema de Gestión de Enfermería - ISUM Universidad
            </p>
          </div>

          {/* 🔐 ENLACE OCULTO AL REGISTRO */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="text-xs text-orange-500 hover:text-orange-700 underline transition-colors font-medium"
              title="Acceso administrativo - Solo personal autorizado"
            >
              Acceso Administrativo ISUM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;