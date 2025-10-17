import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FORZAR VERIFICACIÓN DE AUTENTICACIÓN AL INICIAR
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('nurse_user');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // ✅ SI ES ACCESO DIRECTO, PERMITIR NAVEGACIÓN
          if (userData.isDirectAccess) {
            setUser(userData);
            console.log('✅ Acceso directo activo');
            
            // Si está en login, redirigir al panel
            if (location.pathname === '/login') {
              navigate('/patient-care-overview');
            }
          } else {
            // ✅ PARA USUARIOS NORMALES, VERIFICAR AUTENTICACIÓN REAL
            // Aquí iría tu lógica de verificación con Supabase
            console.log('Usuario normal detectado');
          }
        } else {
          // ✅ NO HAY USUARIO, FORZAR LOGIN
          console.log('🔐 No hay usuario, forzando login');
          if (location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // En caso de error, forzar login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  const signIn = async (email, password) => {
    try {
      // Simular login exitoso
      const userData = {
        email: email,
        name: 'Usuario ISUM',
        role: 'user',
        isDirectAccess: false
      };
      
      setUser(userData);
      localStorage.setItem('nurse_user', JSON.stringify(userData));
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (userData) => {
    console.log('Registrando usuario:', userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nurse_user');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const value = {
    user,
    signIn,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}