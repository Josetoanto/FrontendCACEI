import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !value.includes('@')) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value === '') {
      setPasswordError('Por favor, ingresa tu contraseña');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar email antes de enviar
    if (!email.includes('@')) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    // Validar contraseña antes de enviar
    if (!password.trim()) {
      setPasswordError('Por favor, ingresa tu contraseña');
      return;
    }
    
    const apiUrl = 'https://egresados.it2id.cc/api/users/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle non-200 responses
        Swal.fire({
          icon: 'error',
          title: 'Error en el inicio de sesión',
          text: 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      const data = await response.json();

      if (data && data.token && data.payload) {
        // Save data to localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.payload));

        // Redirect based on user type
        const userType = data.payload.tipo;
        switch (userType) {
          case 'Administrador':
            navigate('/home');
            break;
          case 'Egresado':
            navigate('/egresado');
            break;
          case 'Empleador':
            navigate('/evaluador');
            break;
          default:
            Swal.fire({
              icon: 'warning',
              title: 'Tipo de usuario desconocido',
              text: 'Redirigiendo a la página principal.',
              confirmButtonText: 'Aceptar'
            });
            navigate('/'); // Fallback to home or a default page
        }

              } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en el inicio de sesión',
            text: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }

    } catch (error) {
      console.error('Error al conectar con la API:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0ebf8',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '350px',
      }}>
        <h2 style={{
          marginBottom: '30px',
          color: '#333',
        }}>Inicio de sesion</h2>
        <form onSubmit={handleLogin}>
          <div style={{
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
              fontSize: '0.9em',
            }}>Correo</label>
            <input
              type="email"
              id="email"
              style={{
                width: '100%',
                padding: '10px',
                border: emailError ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <div style={{
                color: '#dc3545',
                fontSize: '0.8em',
                marginTop: '5px',
                textAlign: 'left'
              }}>
                {emailError}
              </div>
            )}
          </div>
          <div style={{
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
              fontSize: '0.9em',
            }}>Contraseña</label>
            <input
              type="password"
              id="password"
              style={{
                width: '100%',
                padding: '10px',
                border: passwordError ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <div style={{
                color: '#dc3545',
                fontSize: '0.8em',
                marginTop: '5px',
                textAlign: 'left'
              }}>
                {passwordError}
              </div>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: '20px',
            }}
          >
            Siguiente
          </button>
        </form>
        
        <p style={{ fontSize: '0.9em' }}>
          <Link to="/ingresar-codigo" style={{ color: '#007bff', textDecoration: 'none' }}>
            Ingresar con código de encuesta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
