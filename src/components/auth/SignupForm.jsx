import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const INVITE_CODE = import.meta.env.VITE_NURSE_INVITE_CODE; 

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const { signup } = useAuth();

    const onSubmit = async (data) => {
        if (!INVITE_CODE || data.inviteCode !== INVITE_CODE) {
            setError("inviteCode", {
                type: "manual",
                message: "El código de acceso secreto es incorrecto. Pide autorización."
            });
            return;
        }

        try {
            console.log("Registro exitoso simulado para:", data.email); 
            
            alert('Cuenta creada con éxito. Redirigiendo a Login.');
            navigate('/login');

        } catch (error) {
            alert(`Error al registrar: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Encabezado con estilo ISUM */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Icon name="user-plus" size={28} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="bg-gradient-to-r from-blue-700 to-orange-600 bg-clip-text text-transparent">
                            Registro ISUM
                        </span>
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-orange-200 shadow-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">Crear Cuenta de Enfermería</p>
                    </div>
                </div>

                {/* Formulario de Registro */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-orange-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* Campo de Correo Electrónico */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico Institucional
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="usuario@isum.edu.ve"
                                {...register("email", { 
                                    required: "El correo electrónico es obligatorio.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Ingrese un correo electrónico válido"
                                    }
                                })}
                                error={errors.email?.message}
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                {...register("password", { 
                                    required: "La contraseña es obligatoria.",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres"
                                    }
                                })}
                                error={errors.password?.message}
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>

                        {/* 🔑 Campo de Código Secreto */}
                        <div>
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <Icon name="shield" size={16} className="text-orange-500" />
                                    Código de Acceso Secreto
                                </span>
                            </label>
                            <Input
                                id="inviteCode"
                                type="text"
                                placeholder="Ingresa el código de invitación"
                                {...register("inviteCode", { 
                                    required: "El código de acceso secreto es obligatorio." 
                                })}
                                error={errors.inviteCode?.message}
                                className="border-orange-200 focus:border-orange-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Solo personal autorizado del ISUM puede crear cuentas
                            </p>
                        </div>
                        
                        {/* Botón de Registro */}
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Icon name="user-check" size={18} />
                                Crear Cuenta
                            </span>
                        </Button>

                        {/* Enlace para volver al Login */}
                        <div className="text-center pt-4 border-t border-orange-200">
                            <p className="text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/login')}
                                    className="font-medium text-orange-600 hover:text-orange-500 underline transition-colors"
                                >
                                    Inicia Sesión
                                </button>
                            </p>
                        </div>
                    </form>

                    {/* Información de seguridad */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                            <Icon name="info" size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Registro Seguro</h4>
                                <p className="text-xs text-gray-600">
                                    Todas las cuentas requieren verificación y aprobación administrativa. 
                                    Los datos están protegidos bajo los estándares del ISUM.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pie de página */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 bg-white py-2 px-3 rounded-lg border border-orange-200">
                            Sistema de Gestión de Enfermería - ISUM Universidad
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;