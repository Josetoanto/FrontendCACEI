import React, { useState, useEffect } from 'react';
import Header from '../organisms/Header';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface CampoEducacional {
  id: number;
  numero: number;
  nombre: string;
  descripcion: string;
}

const API_URL = 'https://egresados.it2id.cc/api';

const GestionCamposEducacionales: React.FC = () => {
  const [camposEducacionales, setCamposEducacionales] = useState<CampoEducacional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampo, setEditingCampo] = useState<CampoEducacional | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: ''
  });
  const [formError, setFormError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  const [currentPage, setCurrentPage] = useState(1);
  const camposPerPage = 10;

  // Cargar campos educacionales
  const fetchCamposEducacionales = async () => {
    setLoading(true);
    try {
      console.log('Intentando obtener secciones de la encuesta...');
      console.log('Token:', token ? 'Presente' : 'Ausente');
      
      // Intentar primero con autenticación
      let res = await fetch(`${API_URL}/educational-fields`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Respuesta del servidor (con auth):', res.status, res.statusText);
      
      // Si falla con auth, intentar sin auth
      if (!res.ok && res.status === 401) {
        console.log('Intentando sin autenticación...');
        res = await fetch(`${API_URL}/educational-fields`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Respuesta del servidor (sin auth):', res.status, res.statusText);
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error en la respuesta:', errorText);
        setFetchError(`Error ${res.status}: ${errorText}`);
        setCamposEducacionales([]);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log('Datos recibidos:', data);
      
      // Manejar diferentes estructuras de respuesta
      let campos = [];
      if (Array.isArray(data)) {
        campos = data;
      } else if (data && Array.isArray(data.data)) {
        campos = data.data;
      } else if (data && Array.isArray(data.educational_fields)) {
        campos = data.educational_fields;
      } else if (data && Array.isArray(data.campos)) {
        campos = data.campos;
      } else {
        console.warn('Estructura de datos inesperada:', data);
        campos = [];
      }
      
      console.log('Campos procesados:', campos);
      setCamposEducacionales(campos);
      setFetchError(''); // Limpiar error si la carga fue exitosa
    } catch (e) {
      console.error('Error al obtener secciones de la encuesta:', e);
      setFetchError(`Error de conexión: ${e instanceof Error ? e.message : 'Error desconocido'}`);
      setCamposEducacionales([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Verificar conectividad antes de cargar datos
    const testConnection = async () => {
      try {
        console.log('Probando conectividad con:', `${API_URL}/educational-fields`);
        const testRes = await fetch(`${API_URL}/educational-fields`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Test de conectividad:', testRes.status, testRes.statusText);
      } catch (e) {
        console.error('Error de conectividad:', e);
      }
    };
    
    testConnection();
    fetchCamposEducacionales();
  }, []);

  const handleBackToConfig = () => {
    navigate('/configuracion');
  };

  // Función para obtener campo por número (posición)
 
  // MODAL AGREGAR CAMPO EDUCATIVO
  const openAddModal = () => {
    setForm({
      nombre: '',
      descripcion: ''
    });
    setFormError('');
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  const handleAddCampo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    // Asignar posición automáticamente (siguiente número disponible)
    const nextPosition = camposEducacionales.length + 1;
    const formDataWithPosition = {
      ...form,
      numero: nextPosition
    };

    try {
      const res = await fetch(`${API_URL}/educational-fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataWithPosition)
      });

      if (!res.ok) {
        const err = await res.text();
        setFormError(err);
        return;
      }

      closeAddModal();
      fetchCamposEducacionales();
      Swal.fire('Éxito', 'Sección de la encuesta agregada correctamente', 'success');
    } catch (e) {
      setFormError('Error al agregar la sección de la encuesta');
    }
  };

  // MODAL EDITAR CAMPO EDUCATIVO
  const openEditModal = (campo: CampoEducacional) => {
    // Prevenir edición del campo con número 0
    if (campo.numero === 0) {
      Swal.fire('Error', 'No se puede editar la sección de la encuesta por defecto.', 'error');
      return;
    }
    
    setEditingCampo(campo);
    setForm({
      nombre: campo.nombre,
      descripcion: campo.descripcion
    });
    setFormError('');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCampo(null);
  };

  const handleEditCampo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    if (!editingCampo) return;

    try {
      // Mantener la posición original al editar
      const formDataWithOriginalPosition = {
        ...form,
        numero: editingCampo.numero
      };

      const res = await fetch(`${API_URL}/educational-fields/${editingCampo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataWithOriginalPosition)
      });

      if (!res.ok) {
        const err = await res.text();
        setFormError(err);
        return;
      }

      closeEditModal();
      fetchCamposEducacionales();
      Swal.fire('Éxito', 'Sección de la encuesta actualizada correctamente', 'success');
    } catch (e) {
      setFormError('Error al actualizar la sección de la encuesta');
    }
  };

  // ELIMINAR CAMPO EDUCATIVO
  const handleDeleteCampo = async (campoId: number) => {
    // Encontrar el campo que se quiere eliminar
    const campoAEliminar = camposEducacionales.find(campo => campo.id === campoId);
    
    // Prevenir eliminación del campo con número 0
    if (campoAEliminar && campoAEliminar.numero === 0) {
      Swal.fire('Error', 'No se puede eliminar la sección de la encuesta por defecto.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la sección de la encuesta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/educational-fields/${campoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        Swal.fire('Error', 'Error al eliminar la sección de la encuesta', 'error');
        return;
      }

      fetchCamposEducacionales();
      Swal.fire('Eliminado', 'La sección de la encuesta ha sido eliminado.', 'success');
    } catch (e) {
      Swal.fire('Error', 'Error al eliminar la sección de la encuesta', 'error');
    }
  };

  const filteredCampos = camposEducacionales.filter(campo =>
    campo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampos.length / camposPerPage);
  const paginatedCampos = filteredCampos.slice(
    (currentPage - 1) * camposPerPage, 
    currentPage * camposPerPage
  );

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchTerm]);

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
                Gestión de Secciones de la Encuesta
              </h1>
            </div>
            <button
              onClick={openAddModal}
              style={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-plus"></i>
              Agregar Secciones de la Encuesta
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Buscar secciones de la encuesta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '98%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Mostrar error de carga si existe */}
          {fetchError && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2'
            }}>
              <strong>Error al cargar secciones de la encuesta:</strong> {fetchError}
              <button
                onClick={() => {
                  setFetchError('');
                  fetchCamposEducacionales();
                }}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#c62828',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Tabla */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2em', color: '#666' }}></i>
              <p style={{ marginTop: '10px', color: '#666' }}>Cargando secciones de la encuesta...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: '#ffffff'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Nombre</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Descripción</th>
                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e9ecef' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCampos.map((campo) => (
                    <tr key={campo.id} style={{ 
                      borderBottom: '1px solid #e9ecef',
                      backgroundColor: campo.numero === 0 ? '#f8f9fa' : 'transparent'
                    }}>
                      <td style={{ padding: '15px', fontWeight: '500' }}>
                        {campo.nombre}
                        {campo.numero === 0 && (
                          <span style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            marginLeft: '8px',
                            fontWeight: 'normal'
                          }}>
                            Por defecto
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>{campo.descripcion}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {campo.numero === 0 ? (
                          <span style={{ 
                            color: '#999', 
                            fontSize: '12px',
                            fontStyle: 'italic'
                          }}>
                            No editable
                          </span>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => openEditModal(campo)}
                              style={{
                                backgroundColor: '#ff9800',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCampo(campo.id)}
                              style={{
                                backgroundColor: '#f44336',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedCampos.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <i className="fas fa-inbox" style={{ fontSize: '3em', marginBottom: '10px' }}></i>
                  <p>No se encontraron secciones de la encuesta</p>
                </div>
              )}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : '#ffffff',
                  color: currentPage === 1 ? '#ccc' : '#333',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <span style={{ color: '#666' }}>
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#ffffff',
                  color: currentPage === totalPages ? '#ccc' : '#333',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar campo educativo */}
      {showAddModal && (
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
            maxWidth: '500px',
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
                <i className="fas fa-plus" style={{ marginRight: '10px', color: '#1976d2' }}></i>
                Agregar Secciones de la Encuesta
              </h2>
              <button
                onClick={closeAddModal}
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

            <form onSubmit={handleAddCampo}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: Seccion 1"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe la sección de la encuesta..."
                />
              </div>

              {formError && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  {formError}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={closeAddModal}
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
                  Agregar Campo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar campo educativo */}
      {showEditModal && editingCampo && (
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
            maxWidth: '500px',
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
                <i className="fas fa-edit" style={{ marginRight: '10px', color: '#ff9800' }}></i>
                Editar Secciones de la Encuesta
              </h2>
              <button
                onClick={closeEditModal}
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

            <form onSubmit={handleEditCampo}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                  style={{
                    width: '95%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: Seccion 1"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={4}
                  style={{
                    width: '95%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe la sección de la encuesta..."
                />
              </div>

              {formError && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  {formError}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={closeEditModal}
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
                    backgroundColor: '#ff9800',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Actualizar Secciones de la Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCamposEducacionales; 