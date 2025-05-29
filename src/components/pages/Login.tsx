import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
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
          <input type="email" id="email" style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }} />
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
          <input type="password" id="password" style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }} />
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
        <button style={{
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
        }}>Siguiente</button>
        
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
