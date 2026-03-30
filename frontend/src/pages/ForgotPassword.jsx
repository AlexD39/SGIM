import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Validación simple de email para accesibilidad
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid) return;

        setIsLoading(true);
        try {
            // NOTA: Asegúrate de tener configurado axios.defaults.baseURL en tu index.js o api.js
            await axios.post('/api/auth/forgot', { email });

            await Swal.fire({
                icon: 'success',
                title: 'Solicitud procesada',
                text: 'Si el correo ingresado coincide con una cuenta activa, recibirás instrucciones en breve.',
                confirmButtonColor: '#1e88e5',
                customClass: { popup: 'swal2-motion-in' }
            });
            navigate('/login');
        } catch (error) {
            // Mensaje neutro alineado con BE para evitar enumeración de usuarios
            Swal.fire({
                icon: 'info',
                title: 'Información',
                text: 'Se ha procesado tu solicitud. Revisa tu bandeja de entrada o spam.',
                confirmButtonColor: '#1e88e5',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="session-management-section" role="main" style={{ maxWidth: '450px', margin: '3rem auto' }}>
            <h2 style={{ color: '#1e88e5', textAlign: 'center' }}>Recuperar Contraseña</h2>
            <p className="session-help-text" style={{ textAlign: 'center' }}>
                Introduce tu correo para enviarte un enlace de acceso seguro.
            </p>
            
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                        aria-required="true"
                        aria-invalid={email !== '' && !isEmailValid}
                        aria-describedby="email-error"
                        disabled={isLoading}
                    />
                    {email !== '' && !isEmailValid && (
                        <span id="email-error" className="auth-error-msg" style={{ marginTop: '5px' }}>
                            Formato de correo no válido.
                        </span>
                    )}
                </div>

                <button 
                    type="submit" 
                    className={isLoading || !isEmailValid ? "btn-disabled" : "btn-logout-others"} 
                    style={{ 
                        width: '100%', 
                        backgroundColor: (isLoading || !isEmailValid) ? '#ccc' : '#1e88e5', 
                        color: 'white', 
                        border: 'none',
                        padding: '0.8rem'
                    }}
                    disabled={isLoading || !isEmailValid}
                    aria-busy={isLoading}
                >
                    {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/login" className="session-help-text" style={{ color: '#1e88e5', fontWeight: '500' }}>
                        Ir al inicio de sesión
                    </Link>
                </div>
            </form>
        </div>
    );
};
// Fix deployment casing
export default ForgotPassword;