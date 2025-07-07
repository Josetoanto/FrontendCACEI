import React, { useState, useEffect } from 'react';
import Header from '../organisms/Header';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import Swal from 'sweetalert2';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  estado: string;
  fecha_creacion: string;
  telefono?: string;
  fecha_nacimiento?: string;
  habilidades?: string;
  experiencia?: string;
  profile_picture?: string;
}

const API_URL = 'https://egresados.it2id.cc/api';

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [formError, setFormError] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState('Egresado');
  const [, setImportResult] = useState<{success: number, fail: number, errors: string[]}>({success: 0, fail: 0, errors: []});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  // Cargar usuarios reales (temporal: consulta del 1 al 50)
  const fetchUsuarios = async () => {
    setLoading(true);
    const promises = [];
    for (let i = 1; i <= 50; i++) {
      promises.push(
        fetch(`${API_URL}/users/${i}`)
          .then(async res => {
            if (!res.ok) return null;
            try {
              const data = await res.json();
              return data;
            } catch {
              return null;
            }
          })
          .catch(() => null)
      );
    }
    const results = await Promise.all(promises);
    const users = results.filter(Boolean).map((u: any) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      tipo: u.tipo,
      estado: u.is_active === 1 || u.is_active === true ? 'Activo' : 'Inactivo',
      fecha_creacion: u.creado_en ? u.creado_en.split('T')[0] : '',
      telefono: u.telefono,
      fecha_nacimiento: u.fecha_nacimiento ? u.fecha_nacimiento.split('T')[0] : '',
      habilidades: u.habilidades,
      experiencia: u.experiencia,
      profile_picture: u.profile_picture
    }));
    
    setUsuarios(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const handleBackToConfig = () => {
    navigate('/configuracion');
  };

  // MODAL AGREGAR USUARIO
  const openAddModal = () => {
    setForm({
      tipo: 'Empleador',
      nombre: '',
      email: '',
      password: '',
    });
    setFormError('');
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    // Valores predeterminados
    const defaultValues = {
      telefono: '555-1234',
      fecha_nacimiento: '1990-01-01',
      is_active: true,
      habilidades: 'JavaScript, TypeScript',
      experiencia: '3 años en desarrollo web',
      profile_picture: 'https://example.com/profile.jpg'
    };
    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, ...defaultValues })
      });
      if (!res.ok) {
        const err = await res.text();
        setFormError(err);
        return;
      }
      closeAddModal();
      fetchUsuarios();
    } catch (e) {
      setFormError('Error al agregar usuario');
    }
  };

  // MODAL EDITAR USUARIO

  // ELIMINAR USUARIO
  const handleDeleteUser = async (userId: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsuarios();
      Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
    } catch (e) {
      Swal.fire('Error', 'Error al eliminar usuario', 'error');
    }
  };

  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || user.tipo === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '20px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <button 
                onClick={handleBackToConfig}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.2em',
                  cursor: 'pointer',
                  marginRight: '15px',
                  color: '#666'
                }}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 style={{ 
                margin: '0', 
                fontSize: '28px', 
                color: '#333',
                display: 'inline-block'
              }}>
                Gestión de Usuarios
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={openAddModal} style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                Agregar Usuario
              </button>
              <button onClick={() => setShowImportModal(true)} style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <i className="fas fa-file-csv" style={{ marginRight: '8px' }}></i>
                Importar CSV
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '99%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minWidth: '150px'
                }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="Egresado">Egresados</option>
                <option value="Empleador">Empleadores</option>
                <option value="Administrador">Administradores</option>
              </select>
            </div>
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2em', color: '#666' }}></i>
              <p style={{ marginTop: '10px', color: '#666' }}>Cargando usuarios...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Estado</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Fecha Creación</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{user.id}</td>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{user.nombre}</td>
                      <td style={{ padding: '12px' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: user.tipo === 'Egresado' ? '#e3f2fd' : 
                                           user.tipo === 'Empleador' ? '#f3e5f5' : '#fff3e0',
                          color: user.tipo === 'Egresado' ? '#1976d2' : 
                                 user.tipo === 'Empleador' ? '#7b1fa2' : '#f57c00'
                        }}>
                          {user.tipo}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: user.estado === 'Activo' ? '#e8f5e8' : '#ffebee',
                          color: user.estado === 'Activo' ? '#2e7d32' : '#c62828'
                        }}>
                          {user.estado}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {user.fecha_creacion}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsuarios.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <i className="fas fa-users" style={{ fontSize: '3em', marginBottom: '15px', opacity: '0.5' }}></i>
                  <p>No se encontraron usuarios que coincidan con los filtros</p>
                </div>
              )}
            </div>
          )}

          {/* MODAL AGREGAR USUARIO */}
          {showAddModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <form onSubmit={handleAddUser} style={{ background: '#fff', padding: 30, borderRadius: 10, minWidth: 350, maxWidth: 400 }}>
                <h2 style={{ marginBottom: 20 }}>Agregar Usuario</h2>
                <div style={{ marginBottom: 10 }}>
                  <label>Tipo</label>
                  <select required value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
                    <option value="Egresado">Egresado</option>
                    <option value="Empleador">Empleador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div style={{ marginBottom: 10, width:"95%" }}>
                  <label>Nombre</label>
                  <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: 10, width:"95%"  }}>
                  <label>Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: 20, width:"95%"  }}>
                  <label>Contraseña</label>
                  <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                </div>
                {formError && <div style={{ color: 'red', marginBottom: 15 }}>{formError}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={closeAddModal} style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#ccc', color: '#333', cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>Agregar</button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL IMPORTAR CSV */}
          {showImportModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <form style={{ background: '#fff', padding: 30, borderRadius: 10, minWidth: 350, maxWidth: 400 }} onSubmit={async (e) => {
                e.preventDefault();
                if (!csvFile) {
                  Swal.fire('Error', 'Por favor selecciona un archivo CSV.', 'error');
                  return;
                }
                Papa.parse(csvFile, {
                  header: true,
                  skipEmptyLines: true,
                  complete: async (results: any) => {
                    let success = 0, fail = 0;
                    for (const row of results.data) {
                      if (!row.Nombre || !row.Email) {
                        fail++;
                        continue;
                      }
                      const userData = {
                        tipo: importType,
                        nombre: row.Nombre,
                        email: row.Email,
                        password: 'password123',
                        telefono: '555-1234',
                        fecha_nacimiento: '1990-01-01',
                        is_active: true,
                        habilidades: 'JavaScript, TypeScript',
                        experiencia: '3 años en desarrollo web',
                        profile_picture: 'https://example.com/profile.jpg'
                      };
                      try {
                        const res = await fetch(`${API_URL}/users/`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify(userData)
                        });
                        if (res.ok) {
                          success++;
                        } else {
                          fail++;
                        }
                      } catch (e) {
                        fail++;
                      }
                    }
                    setShowImportModal(false);
                    setCsvFile(null);
                    setImportResult({success:0,fail:0,errors:[]});
                    fetchUsuarios();
                    if (success > 0 && fail === 0) {
                      Swal.fire('¡Éxito!', `Se agregaron ${success} usuarios correctamente.`, 'success');
                    } else if (success > 0 && fail > 0) {
                      Swal.fire('Parcialmente exitoso', `Se agregaron ${success} usuarios. Algunos usuarios no se pudieron agregar.`, 'warning');
                    } else {
                      Swal.fire('Error', `No se pudo agregar ningún usuario.`, 'error');
                    }
                  }
                });
              }}>
                <h2 style={{ marginBottom: 20 }}>Importar Usuarios desde CSV</h2>
                <div style={{ marginBottom: 15, background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #e5e8eb', fontSize: '0.97em' }}>
                  <strong>Formato requerido:</strong>
                  <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                    <li>El archivo debe tener las columnas <b>Nombre</b> y <b>Email</b> (con esas cabeceras exactas).</li>
                    <li>Ejemplo:</li>
                  </ul>
                  <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', marginTop: '8px', padding: '6px', fontFamily: 'monospace', fontSize: '0.97em' }}>
                    Nombre,Email<br/>
                    Juan Perez,juan@email.com<br/>
                    Ana Lopez,ana@email.com
                  </div>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label>Tipo de usuario</label>
                  <select value={importType} onChange={e => setImportType(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
                    <option value="Egresado">Egresado</option>
                    <option value="Empleador">Empleador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label>Archivo CSV (Nombre,Email)</label>
                  <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] || null)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => { setShowImportModal(false); setCsvFile(null); }} style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#ccc', color: '#333', cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#28a745', color: 'white', cursor: 'pointer' }}>Aceptar</button>
                </div>
              </form>
            </div>
          )}

          {/* Estadísticas */}
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e5e8eb'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '10px' }}></i>
              Estadísticas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>
                  {usuarios.length}
                </div>
                <div style={{ color: '#666' }}>Total de Usuarios</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>
                  {usuarios.filter(u => u.estado === 'Activo').length}
                </div>
                <div style={{ color: '#666' }}>Usuarios Activos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>
                  {usuarios.filter(u => u.tipo === 'Egresado').length}
                </div>
                <div style={{ color: '#666' }}>Egresados</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#dc3545' }}>
                  {usuarios.filter(u => u.tipo === 'Empleador').length}
                </div>
                <div style={{ color: '#666' }}>Empleadores</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios; 
