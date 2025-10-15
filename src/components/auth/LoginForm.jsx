import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const { error: authError } = await signIn(formData?.email, formData?.password);
      
      if (authError) {
        // Handle specific Supabase auth errors
        if (authError?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (authError?.message?.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else if (authError?.message?.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a moment before trying again.');
        } else {
          setError(authError?.message || 'An error occurred during sign in. Please try again.');
        }
        return;
      }

      // Success - navigate to dashboard
      navigate('/patient-care-overview');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setError('');

    try {
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        setError('Demo login failed. The demo account may not be available.');
        return;
      }

      navigate('/patient-care-overview');
    } catch (err) {
      setError('Network error during demo login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Icon name="activity" size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Healthcare Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your healthcare dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                <Icon name="alert-circle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData?.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
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
                  placeholder="Enter your password"
                  className="w-full pr-10"
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
                    className="text-gray-400 hover:text-gray-600" 
                  />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Icon name="key" size={16} />
              Demo Credentials
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Administrator</p>
                    <p className="text-xs text-gray-600">admin@hospital.com / admin123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('admin@hospital.com', 'admin123')}
                    disabled={loading}
                  >
                    Login
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Doctor</p>
                    <p className="text-xs text-gray-600">doctor@hospital.com / doctor123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('doctor@hospital.com', 'doctor123')}
                    disabled={loading}
                  >
                    Login
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nurse</p>
                    <p className="text-xs text-gray-600">nurse@hospital.com / nurse123</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('nurse@hospital.com', 'nurse123')}
                    disabled={loading}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Secure healthcare management system powered by Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;