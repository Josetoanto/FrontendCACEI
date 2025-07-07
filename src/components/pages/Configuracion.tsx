import React, { useState, useEffect } from 'react';
import Header from '../organisms/Header';
import { useNavigate } from 'react-router-dom';

const Configuracion: React.FC = () => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    lastUpdate: new Date().toLocaleDateString('es-ES'),
    status: 'Operativo',
    uptime: '0 días, 0 horas',
    memoryUsage: '0%',
    cpuUsage: '0%'
  });

  useEffect(() => {
    // Simular información del sistema en tiempo real
    const interval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(now.getTime() - Math.random() * 86400000 * 7); // Simular uptime aleatorio
      const uptimeMs = now.getTime() - startTime.getTime();
      const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setSystemInfo(prev => ({
        ...prev,
        uptime: `${days} días, ${hours} horas`,
        memoryUsage: `${Math.floor(Math.random() * 30 + 40)}%`, // 40-70%
        cpuUsage: `${Math.floor(Math.random() * 20 + 10)}%` // 10-30%
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleGestionUsuarios = () => {
    navigate('/gestion-usuarios');
  };

  const handleEditarPassword = () => {
    setShowPasswordModal(true);
    setPasswordError('');
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
  };

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

    try {
      // Obtener datos del usuario logueado
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

      // Obtener token
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setPasswordError('No se encontró el token de autenticación. Inicia sesión nuevamente.');
        return;
      }

      // Obtener datos actuales del usuario
      const getResponse = await fetch(`http://188.68.59.176:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (!getResponse.ok) {
        setPasswordError('No se pudo obtener la información del usuario.');
        return;
      }
      const userInfo = await getResponse.json();

      // Preparar datos para actualizar (excepto password_hash, usamos password)
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
      const putResponse = await fetch(`http://188.68.59.176:8000/users/${userId}`, {
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
      setShowPasswordModal(false);
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
      // Limpiar sesión y redirigir al login
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      navigate('/');
    } catch (error) {
      setPasswordError('Error al actualizar la contraseña. Intenta de nuevo.');
    }
  };

  const handleCerrarSesion = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    // Redirigir al login
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '20px'
        }}>
          <h1 style={{ 
            margin: '0 0 30px 0', 
            fontSize: '28px', 
            color: '#333',
            borderBottom: '2px solid #e5e8eb',
            paddingBottom: '15px'
          }}>
            Configuración del Sistema
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            <div 
              onClick={handleGestionUsuarios}
              style={{ 
                padding: '20px', 
                border: '1px solid #e5e8eb', 
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>
                <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
                Gestión de Usuarios
              </h3>
              <p style={{ color: '#666', margin: '0' }}>
                Administrar usuarios del sistema, roles y permisos.
              </p>
            </div>

            <div 
              onClick={handleEditarPassword}
              style={{ 
                padding: '20px', 
                border: '1px solid #e5e8eb', 
                borderRadius: '8px',
                backgroundColor: '#f0f8ff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f3ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f8ff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>
                <i className="fas fa-key" style={{ marginRight: '10px' }}></i>
                Cambiar Contraseña
              </h3>
              <p style={{ color: '#666', margin: '0' }}>
                Actualizar tu contraseña de acceso al sistema.
              </p>
            </div>

            <div 
              onClick={handleCerrarSesion}
              style={{ 
                padding: '20px', 
                border: '1px solid #e5e8eb', 
                borderRadius: '8px',
                backgroundColor: '#fff5f5',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffe6e6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff5f5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: '0 0 15px 0', color: '#d32f2f' }}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
                Cerrar Sesión
              </h3>
              <p style={{ color: '#666', margin: '0' }}>
                Cerrar sesión actual y volver al login.
              </p>
            </div>
          </div>

          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e5e8eb'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '10px' }}></i>
              Información del Sistema
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Versión:</strong> {systemInfo.version}
                </p>
              </div>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Última actualización:</strong> {systemInfo.lastUpdate}
                </p>
              </div>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Estado:</strong> <span style={{ color: '#28a745' }}>{systemInfo.status}</span>
                </p>
              </div>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Tiempo activo:</strong> {systemInfo.uptime}
                </p>
              </div>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Uso de memoria:</strong> 
                  <span style={{ 
                    color: parseInt(systemInfo.memoryUsage) > 80 ? '#d32f2f' : 
                           parseInt(systemInfo.memoryUsage) > 60 ? '#f57c00' : '#28a745'
                  }}>
                    {' '}{systemInfo.memoryUsage}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ color: '#666', margin: '0 0 5px 0' }}>
                  <strong>Uso de CPU:</strong> 
                  <span style={{ 
                    color: parseInt(systemInfo.cpuUsage) > 80 ? '#d32f2f' : 
                           parseInt(systemInfo.cpuUsage) > 60 ? '#f57c00' : '#28a745'
                  }}>
                    {' '}{systemInfo.cpuUsage}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Barra de progreso para memoria y CPU */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Memoria</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{systemInfo.memoryUsage}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: systemInfo.memoryUsage, 
                    height: '100%', 
                    backgroundColor: parseInt(systemInfo.memoryUsage) > 80 ? '#d32f2f' : 
                                     parseInt(systemInfo.memoryUsage) > 60 ? '#f57c00' : '#28a745',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>CPU</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{systemInfo.cpuUsage}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: systemInfo.cpuUsage, 
                    height: '100%', 
                    backgroundColor: parseInt(systemInfo.cpuUsage) > 80 ? '#d32f2f' : 
                                     parseInt(systemInfo.cpuUsage) > 60 ? '#f57c00' : '#28a745',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
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
                onClick={() => setShowPasswordModal(false)}
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
                  onClick={() => setShowPasswordModal(false)}
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
      )}
    </div>
  );
};

export default Configuracion; 
