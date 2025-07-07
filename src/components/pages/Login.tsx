import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:8000/users/login';

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
        const errorText = await response.text();
        alert(`Error en el inicio de sesión: ${response.status} - ${errorText}`);
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
            alert('Tipo de usuario desconocido. Redirigiendo a la página principal.');
            navigate('/'); // Fallback to home or a default page
        }

      } else {
        alert('Respuesta de API inesperada.');
      }

    } catch (error) {
      console.error('Error al conectar con la API:', error);
      alert('Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
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
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="#" style={{
            display: 'block',
            textAlign: 'right',
            marginTop: '-10px',
            marginBottom: '20px',
            fontSize: '0.8em',
            color: '#007bff',
            textDecoration: 'none',
          }}>Olvidaste tu contraseña?</a>
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
