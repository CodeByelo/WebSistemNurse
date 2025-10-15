import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../AppIcon';

const SignupForm = () => {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'nurse',
    department: 'general_ward',
    employeeId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'staff_manager', label: 'Staff Manager' },
    { value: 'technician', label: 'Technician' }
  ];

  const departmentOptions = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'icu', label: 'Intensive Care Unit' },
    { value: 'general_ward', label: 'General Ward' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' }
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData?.email || !formData?.password || !formData?.fullName) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test(formData?.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const metadata = {
        full_name: formData?.fullName,
        role: formData?.role,
        department: formData?.department,
        employee_id: formData?.employeeId || null
      };

      const { error: authError } = await signUp(formData?.email, formData?.password, metadata);
      
      if (authError) {
        // Handle specific Supabase auth errors
        if (authError?.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (authError?.message?.includes('Password should be at least 6 characters')) {
          setError('Password must be at least 6 characters long.');
        } else if (authError?.message?.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else if (authError?.message?.includes('Signup is disabled')) {
          setError('Account registration is currently disabled. Please contact your administrator.');
        } else {
          setError(authError?.message || 'An error occurred during registration. Please try again.');
        }
        return;
      }

      // Success
      setSuccess('Account created successfully! Please check your email to confirm your account.');
      
      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'nurse',
        department: 'general_ward',
        employeeId: ''
      });

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Icon name="user-plus" size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the healthcare management system
          </p>
        </div>

        {/* Signup Form */}
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

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                <Icon name="check-circle" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-800">{success}</p>
                  <p className="text-xs text-green-600 mt-1">Redirecting to login page...</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData?.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  id="role"
                  name="role"
                  value={formData?.role}
                  onChange={handleChange}
                  options={roleOptions}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select
                  id="department"
                  name="department"
                  value={formData?.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={formData?.employeeId}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData?.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading || success}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Back to Login
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;