import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CambiarContrasenaModalProps {
  show: boolean;
  onClose: () => void;
}

const CambiarContrasenaModal: React.FC<CambiarContrasenaModalProps> = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  if (!show) return null;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        setPasswordError('No se encontró información del usuario. Inicia sesión nuevamente.');
        return;
      }
      const userData = JSON.parse(userDataString);
      const userId = userData.id;
      if (!userId) {
        setPasswordError('No se encontró el ID del usuario.');
        return;
      }
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setPasswordError('No se encontró el token de autenticación. Inicia sesión nuevamente.');
        return;
      }
      // Obtener datos actuales del usuario
      const getResponse = await fetch(`https://188.68.59.176:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (!getResponse.ok) {
        setPasswordError('No se pudo obtener la información del usuario.');
        return;
      }
      const userInfo = await getResponse.json();
      // Preparar datos para actualizar
      const updateData = {
        tipo: userInfo.tipo,
        nombre: userInfo.nombre,
        email: userInfo.email,
        password: passwordData.newPassword,
        telefono: userInfo.telefono,
        fecha_nacimiento: userInfo.fecha_nacimiento?.split('T')[0] || '',
        is_active: userInfo.is_active === 1 || userInfo.is_active === true,
        habilidades: userInfo.habilidades,
        experiencia: userInfo.experiencia,
        profile_picture: userInfo.profile_picture
      };
      // Actualizar usuario con nueva contraseña
      const putResponse = await fetch(`https://188.68.59.176:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(updateData),
      });
      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        setPasswordError(`Error al actualizar la contraseña: ${putResponse.status} - ${errorText}`);
        return;
      }
      alert('Contraseña actualizada exitosamente');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      navigate('/');
    } catch (error) {
      setPasswordError('Error al actualizar la contraseña. Intenta de nuevo.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            <i className="fas fa-key" style={{ marginRight: '10px', color: '#1976d2' }}></i>
            Cambiar Contraseña
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px'
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              style={{
                width: '95%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              style={{
                width: '95%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          {passwordError && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {passwordError}
            </div>
          )}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#f5f5f5',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasenaModal; 
