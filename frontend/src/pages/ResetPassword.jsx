import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Protección: Si no hay token, redirigir
    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Acceso no válido',
                text: 'Se requiere un token de seguridad para esta acción.',
                confirmButtonColor: '#1e88e5'
            });
            navigate('/login');
        }
    }, [token, navigate]);

    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) return;

        setIsLoading(true);
        try {
            await axios.post('/api/auth/reset-password', {
                token,
                password: formData.password
            });

            await Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Tu nueva contraseña ha sido guardada. Ya puedes iniciar sesión.',
                confirmButtonColor: '#1e88e5'
            });
            navigate('/login');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: error.response?.data?.message || 'El enlace ha expirado o no es válido.',
                confirmButtonColor: '#d32f2f'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="session-management-section" style={{ maxWidth: '450px', margin: '3rem auto' }}>
            <h2 style={{ color: '#1e88e5', textAlign: 'center' }}>Nueva Contraseña</h2>
            <p className="session-help-text" style={{ textAlign: 'center' }}>Crea una contraseña segura para tu cuenta.</p>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Nueva Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        aria-invalid={formData.password.length > 0 && formData.password.length < 8}
                    />
                    {formData.password.length > 0 && formData.password.length < 8 && (
                        <span className="auth-error-msg" style={{fontSize: '0.8rem', marginTop: '5px'}}>Mínimo 8 caracteres.</span>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                        aria-invalid={formData.confirmPassword !== '' && !passwordsMatch}
                    />
                    {formData.confirmPassword !== '' && !passwordsMatch && (
                        <span className="auth-error-msg" style={{fontSize: '0.8rem', marginTop: '5px'}}>Las contraseñas no coinciden.</span>
                    )}
                </div>

                <button 
                    type="submit" 
                    className={isLoading || !passwordsMatch ? "btn-disabled" : "btn-logout-others"}
                    style={{ 
                        width: '100%', 
                        backgroundColor: (isLoading || !passwordsMatch) ? '#ccc' : '#1e88e5', 
                        color: 'white', 
                        border: 'none',
                        padding: '0.8rem'
                    }}
                    disabled={isLoading || !passwordsMatch || !token}
                    aria-busy={isLoading}
                >
                    {isLoading ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
            </form>
        </div>
    );
};
// Fix deployment casing
export default ResetPassword;