import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

interface EmailData {
  id: number;
  email: string;
  nombre: string | null;
  creado_en: string;
  actualizado_en: string;
}

interface InvitationData {
  id: number;
  encuesta_id: number;
  codigo: string;
  email: string;
  respondido: number;
  respondido_en: string | null;
  creado_en: string;
}

interface CorreosAutorizadosProps {
  surveyId?: number;
  isEditMode?: boolean;
}

const CorreosAutorizados: React.FC<CorreosAutorizadosProps> = ({ surveyId, isEditMode = false }) => {
  const [correos, setCorreos] = useState<EmailData[]>([]);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [multipleEmails, setMultipleEmails] = useState("");
  const [showMultipleInput, setShowMultipleInput] = useState(false);
  const [invitaciones, setInvitaciones] = useState<InvitationData[]>([]);
  const [loadingInvitaciones, setLoadingInvitaciones] = useState(false);

  // Validar formato de correo
  const validarCorreo = (correo: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  // Cargar correos existentes
  const cargarCorreos = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No se encontró el token de usuario', 'error');
        return;
      }

      const response = await fetch('https://188.68.59.176:8000/anonymous-emails', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar correos: ${response.statusText}`);
      }

      const data: EmailData[] = await response.json();
      setCorreos(data);
    } catch (error: any) {
      console.error('Error al cargar correos:', error);
      Swal.fire('Error', 'No se pudieron cargar los correos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Agregar nuevo correo
  const handleAgregarCorreo = async () => {
    if (!validarCorreo(nuevoCorreo)) {
      setCorreoError("Correo inválido");
      return;
    }
    if (correos.some(c => c.email === nuevoCorreo)) {
      setCorreoError("El correo ya está en la lista");
      return;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No se encontró el token de usuario', 'error');
        return;
      }

      const response = await fetch('https://188.68.59.176:8000/anonymous-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          email: nuevoCorreo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al agregar correo: ${JSON.stringify(errorData)}`);
      }

      const nuevoEmail: EmailData = await response.json();
      setCorreos([...correos, nuevoEmail]);
      setNuevoCorreo("");
      setCorreoError("");
      Swal.fire('¡Éxito!', 'Correo agregado correctamente', 'success');
    } catch (error: any) {
      console.error('Error al agregar correo:', error);
      Swal.fire('Error', error.message || 'No se pudo agregar el correo', 'error');
    }
  };

  // Iniciar edición
  const iniciarEdicion = (correo: EmailData) => {
    setEditingId(correo.id);
    setEditingEmail(correo.email);
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!validarCorreo(editingEmail)) {
      setCorreoError("Correo inválido");
      return;
    }
    if (correos.some(c => c.email === editingEmail && c.id !== editingId)) {
      setCorreoError("El correo ya está en la lista");
      return;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No se encontró el token de usuario', 'error');
        return;
      }

      console.log('Estado actual antes de actualizar:', correos);
      console.log('Enviando actualización para ID:', editingId, 'con email:', editingEmail);

      const response = await fetch(`https://188.68.59.176:8000/anonymous-emails/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          email: editingEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar correo: ${JSON.stringify(errorData)}`);
      }

      console.log('Respuesta exitosa de la API');

      // Actualizar el estado de forma más simple y directa
      const correoActualizado = {
        id: editingId!,
        email: editingEmail,
        nombre: null,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
      };

      console.log('Correo actualizado que se va a usar:', correoActualizado);

      setCorreos(prevCorreos => {
        const nuevosCorreos = prevCorreos.map(c => 
          c.id === editingId ? correoActualizado : c
        );
        console.log('Nuevo estado de correos:', nuevosCorreos);
        return nuevosCorreos;
      });

      // Limpiar el estado de edición
      setEditingId(null);
      setEditingEmail("");
      setCorreoError("");
      
      console.log('Estado de edición limpiado');
      Swal.fire('¡Éxito!', 'Correo actualizado correctamente', 'success');
    } catch (error: any) {
      console.error('Error al actualizar correo:', error);
      Swal.fire('Error', error.message || 'No se pudo actualizar el correo', 'error');
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditingId(null);
    setEditingEmail("");
    setCorreoError("");
  };

  // Eliminar correo
  const handleEliminarCorreo = async (correo: EmailData) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el correo ${correo.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
          Swal.fire('Error', 'No se encontró el token de usuario', 'error');
          return;
        }

        const response = await fetch(`https://188.68.59.176:8000/anonymous-emails/${correo.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar correo: ${response.statusText}`);
        }

        setCorreos(correos.filter(c => c.id !== correo.id));
        Swal.fire('¡Eliminado!', 'El correo ha sido eliminado correctamente', 'success');
      } catch (error: any) {
        console.error('Error al eliminar correo:', error);
        Swal.fire('Error', error.message || 'No se pudo eliminar el correo', 'error');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditMode) {
        handleAgregarCorreoYEnviar();
      } else {
        handleAgregarCorreo();
      }
    }
  };

  // Filtrar correos basado en el término de búsqueda
  const correosFiltrados = correos.filter(correo =>
    correo.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Procesar múltiples correos
  const handleAgregarMultiples = async () => {
    if (!multipleEmails.trim()) {
      setCorreoError("Por favor ingresa al menos un correo");
      return;
    }

    // Separar correos por comas, espacios o saltos de línea
    const emailsArray = multipleEmails
      .split(/[,\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailsArray.length === 0) {
      setCorreoError("No se encontraron correos válidos");
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      Swal.fire('Error', 'No se encontró el token de usuario', 'error');
      return;
    }

    // Validar cada correo
    const correosValidos = emailsArray.filter(validarCorreo);
    const correosInvalidos = emailsArray.filter(email => !validarCorreo(email));
    
    // Verificar duplicados
    const correosExistentes = correosValidos.filter(email => 
      correos.some(c => c.email === email)
    );
    const correosNuevos = correosValidos.filter(email => 
      !correos.some(c => c.email === email)
    );

    if (correosNuevos.length === 0) {
      Swal.fire('Atención', 'Todos los correos ya existen en la lista', 'warning');
      return;
    }

    // Mostrar resumen antes de agregar
    const resumen = `Se agregarán ${correosNuevos.length} correo${correosNuevos.length !== 1 ? 's' : ''} nuevos.\n\n` +
      (correosExistentes.length > 0 ? `${correosExistentes.length} correo${correosExistentes.length !== 1 ? 's' : ''} ya existen.\n\n` : '') +
      (correosInvalidos.length > 0 ? `${correosInvalidos.length} correo${correosInvalidos.length !== 1 ? 's' : ''} tienen formato inválido.\n\n` : '');

    const result = await Swal.fire({
      title: 'Confirmar agregar múltiples correos',
      text: resumen + '¿Deseas continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6c63ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        let agregados = 0;
        let errores = 0;

        for (const email of correosNuevos) {
          try {
            const response = await fetch('https://188.68.59.176:8000/anonymous-emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ email })
            });

            if (response.ok) {
              const nuevoEmail: EmailData = await response.json();
              setCorreos(prev => [...prev, nuevoEmail]);
              agregados++;
            } else {
              errores++;
            }
          } catch (error) {
            errores++;
          }
        }

        // Mostrar resultado final
        let mensaje = `Se agregaron ${agregados} correo${agregados !== 1 ? 's' : ''} exitosamente.`;
        if (errores > 0) {
          mensaje += `\n${errores} correo${errores !== 1 ? 's' : ''} no se pudieron agregar.`;
        }

        Swal.fire('Resultado', mensaje, agregados > 0 ? 'success' : 'error');
        
        // Limpiar el formulario
        setMultipleEmails("");
        setShowMultipleInput(false);
        setCorreoError("");
      } catch (error: any) {
        console.error('Error al agregar múltiples correos:', error);
        Swal.fire('Error', 'Hubo un error al agregar los correos', 'error');
      }
    }
  };

  // Agregar correo individual y enviar invitación
  const handleAgregarCorreoYEnviar = async () => {
    if (!validarCorreo(nuevoCorreo)) {
      setCorreoError("Correo inválido");
      return;
    }
    if (correos.some(c => c.email === nuevoCorreo)) {
      setCorreoError("El correo ya está en la lista");
      return;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No se encontró el token de usuario', 'error');
        return;
      }

      // Agregar el correo a la lista de autorizados
      const response = await fetch('https://188.68.59.176:8000/anonymous-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          email: nuevoCorreo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al agregar correo: ${JSON.stringify(errorData)}`);
      }

      const nuevoEmail: EmailData = await response.json();
      setCorreos([...correos, nuevoEmail]);

      // Enviar invitación inmediatamente si estamos en modo edición
      if (isEditMode && surveyId) {
        try {
          const invitationResponse = await fetch('https://188.68.59.176:8000/anonymous-invitations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
              encuesta_id: surveyId,
              email: nuevoCorreo
            })
          });

          if (invitationResponse.ok) {
            // Enviar notificación después de crear la invitación exitosamente
            try {
              const notiBody = {
                encuesta_id: surveyId,
                mensaje: '¡Tienes una nueva notificación sobre la encuesta!'
              };
              console.log('Enviando notificación con body:', notiBody);
              const notiResp = await fetch('https://188.68.59.176:8000/notifications/anonymous', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(notiBody)
              });
              const notiData = await notiResp.json();
              console.log('Respuesta de notificación:', notiData);
            } catch (notificationError) {
              console.error('Error al enviar la notificación:', notificationError);
            }
            // Recargar invitaciones para mostrar la nueva
            await cargarInvitaciones();
            Swal.fire('¡Éxito!', 'Correo agregado e invitación enviada correctamente', 'success');
          } else {
            Swal.fire('¡Éxito!', 'Correo agregado correctamente, pero no se pudo enviar la invitación', 'warning');
          }
        } catch (invitationError) {
          console.error('Error al enviar invitación:', invitationError);
          Swal.fire('¡Éxito!', 'Correo agregado correctamente, pero no se pudo enviar la invitación', 'warning');
        }
      } else {
        Swal.fire('¡Éxito!', 'Correo agregado correctamente', 'success');
      }

      setNuevoCorreo("");
      setCorreoError("");
    } catch (error: any) {
      console.error('Error al agregar correo:', error);
      Swal.fire('Error', error.message || 'No se pudo agregar el correo', 'error');
    }
  };

  // Agregar múltiples correos y enviar invitaciones
  const handleAgregarMultiplesYEnviar = async () => {
    if (!multipleEmails.trim()) {
      setCorreoError("Por favor ingresa al menos un correo");
      return;
    }

    // Separar correos por comas, espacios o saltos de línea
    const emailsArray = multipleEmails
      .split(/[,\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailsArray.length === 0) {
      setCorreoError("No se encontraron correos válidos");
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      Swal.fire('Error', 'No se encontró el token de usuario', 'error');
      return;
    }

    // Validar cada correo
    const correosValidos = emailsArray.filter(validarCorreo);
    const correosInvalidos = emailsArray.filter(email => !validarCorreo(email));
    
    // Verificar duplicados
    const correosExistentes = correosValidos.filter(email => 
      correos.some(c => c.email === email)
    );
    const correosNuevos = correosValidos.filter(email => 
      !correos.some(c => c.email === email)
    );

    if (correosNuevos.length === 0) {
      Swal.fire('Atención', 'Todos los correos ya existen en la lista', 'warning');
      return;
    }

    // Mostrar resumen antes de agregar
    const resumen = `Se agregarán ${correosNuevos.length} correo${correosNuevos.length !== 1 ? 's' : ''} nuevos y se enviarán invitaciones.\n\n` +
      (correosExistentes.length > 0 ? `${correosExistentes.length} correo${correosExistentes.length !== 1 ? 's' : ''} ya existen.\n\n` : '') +
      (correosInvalidos.length > 0 ? `${correosInvalidos.length} correo${correosInvalidos.length !== 1 ? 's' : ''} tienen formato inválido.\n\n` : '');

    const result = await Swal.fire({
      title: 'Confirmar agregar correos y enviar invitaciones',
      text: resumen + '¿Deseas continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, agregar y enviar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        let agregados = 0;
        let errores = 0;
        let invitacionesEnviadas = 0;

        for (const email of correosNuevos) {
          try {
            // Agregar correo a la lista de autorizados
            const response = await fetch('https://188.68.59.176:8000/anonymous-emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ email })
            });

            if (response.ok) {
              const nuevoEmail: EmailData = await response.json();
              setCorreos(prev => [...prev, nuevoEmail]);
              agregados++;

              // Enviar invitación si estamos en modo edición
              if (isEditMode && surveyId) {
                try {
                  const invitationResponse = await fetch('https://188.68.59.176:8000/anonymous-invitations', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${userToken}`
                    },
                    body: JSON.stringify({
                      encuesta_id: surveyId,
                      email
                    })
                  });

                  if (invitationResponse.ok) {
                    invitacionesEnviadas++;
                    // Enviar notificación después de crear la invitación exitosamente
                    try {
                      const notiBody = {
                        encuesta_id: surveyId,
                        mensaje: '¡Tienes una nueva notificación sobre la encuesta!'
                      };
                      console.log('Enviando notificación con body:', notiBody);
                      const notiResp = await fetch('https://188.68.59.176:8000/notifications/anonymous', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${userToken}`
                        },
                        body: JSON.stringify(notiBody)
                      });
                      const notiData = await notiResp.json();
                      console.log('Respuesta de notificación:', notiData);
                    } catch (notificationError) {
                      console.error('Error al enviar la notificación:', notificationError);
                    }
                  }
                } catch (invitationError) {
                  console.error('Error al enviar invitación para:', email, invitationError);
                }
              }
            } else {
              errores++;
            }
          } catch (error) {
            errores++;
          }
        }

        // Recargar invitaciones si estamos en modo edición
        if (isEditMode && surveyId) {
          await cargarInvitaciones();
        }

        // Mostrar resultado final
        let mensaje = `Se agregaron ${agregados} correo${agregados !== 1 ? 's' : ''} exitosamente.`;
        if (isEditMode && surveyId) {
          mensaje += `\nSe enviaron ${invitacionesEnviadas} invitaciones.`;
        }
        if (errores > 0) {
          mensaje += `\n${errores} correo${errores !== 1 ? 's' : ''} no se pudieron agregar.`;
        }

        Swal.fire('Resultado', mensaje, agregados > 0 ? 'success' : 'error');
        
        // Limpiar el formulario
        setMultipleEmails("");
        setShowMultipleInput(false);
        setCorreoError("");
      } catch (error: any) {
        console.error('Error al agregar múltiples correos:', error);
        Swal.fire('Error', 'Hubo un error al agregar los correos', 'error');
      }
    }
  };

  // Cargar correos al montar el componente
  useEffect(() => {
    cargarCorreos();
  }, []);

  // Cargar invitaciones si estamos en modo edición
  useEffect(() => {
    if (isEditMode && surveyId) {
      cargarInvitaciones();
    }
  }, [isEditMode, surveyId]);

  // Función para cargar invitaciones de la encuesta
  const cargarInvitaciones = async () => {
    try {
      setLoadingInvitaciones(true);
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        console.warn('No se encontró el token de usuario para cargar invitaciones');
        return;
      }

      const response = await fetch(`https://188.68.59.176:8000/anonymous-invitations/survey/${surveyId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        console.warn('Error al cargar invitaciones:', await response.text());
        return;
      }

      const data: InvitationData[] = await response.json();
      setInvitaciones(data);
      console.log('Invitaciones cargadas:', data);
    } catch (error) {
      console.error('Error al cargar invitaciones:', error);
    } finally {
      setLoadingInvitaciones(false);
    }
  };

  // Log para debuggear el estado en cada render
  useEffect(() => {
    console.log('Estado de correos en render:', correos);
  }, [correos]);

  // Función para enviar nuevas invitaciones
  
  if (loading) {
    return (
      <div style={{
        background: "#ffffff",
        padding: "32px",
        borderRadius: "12px",
        maxWidth: "800px",
        margin: "32px auto",
        boxShadow: "0 4px 16px 0 #ece6f6",
        marginBottom: "64px",
        textAlign: "center"
      }}>
        <div>Cargando correos...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#ffffff",
      padding: "32px",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "32px auto",
      boxShadow: "0 4px 16px 0 #ece6f6",
      marginBottom: "64px"
    }}>
      <h2 style={{ fontWeight: "bold", fontSize: "22px", marginBottom: "32px" }}>
        {isEditMode ? "Invitaciones de la Encuesta" : "Correos Autorizados"}
      </h2>
      <hr style={{ border: "none", borderTop: "1px solid #ece6f6", margin: "32px 0" }} />
      
      {isEditMode ? (
        /* Modo edición - Mostrar invitaciones */
        <div>
          <div style={{ fontWeight: "bold", fontSize: "17px", marginBottom: "16px" }}>
            Estado de las invitaciones ({invitaciones.length})
          </div>

          {/* Sección para agregar nuevos correos */}
          <div style={{ 
            background: "#f8f9fa", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "24px",
            border: "1px solid #e9ecef"
          }}>
            <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "12px" }}>
              Agregar nuevos correos autorizados
            </div>
            <div style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
              Agrega nuevos correos a la lista de autorizados y envíales invitaciones inmediatamente
            </div>
            
            {/* Botón para alternar entre modo individual y múltiple */}
            <div style={{ marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowMultipleInput(!showMultipleInput)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: "#6c63ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                {showMultipleInput ? "Modo individual" : "Agregar múltiples"}
              </button>
            </div>
            
            {showMultipleInput ? (
              /* Modo múltiple */
              <div style={{ marginBottom: "8px" }}>
                <textarea
                  placeholder="Ingresa varios correos separados por comas, espacios o saltos de línea&#10;Ejemplo:&#10;correo1@ejemplo.com&#10;correo2@ejemplo.com, correo3@ejemplo.com"
                  value={multipleEmails}
                  onChange={(e) => { setMultipleEmails(e.target.value); setCorreoError(""); }}
                  style={{
                    width: "96%",
                    minHeight: "120px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "16px",
                    background: "#fff",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
                <div style={{ display: "flex", gap: "12px", marginTop: "8px", justifyContent: "right" }}>
                  <button
                    type="button"
                    onClick={handleAgregarMultiplesYEnviar}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "6px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Agregar y enviar invitaciones
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMultipleEmails(""); setCorreoError(""); }}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "6px",
                      background: "#6c757d",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo individual */
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={nuevoCorreo}
                  onChange={(e) => { setNuevoCorreo(e.target.value); setCorreoError(""); }}
                  onKeyPress={handleKeyPress}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "16px",
                    background: "#fff"
                  }}
                />
                <button
                  type="button"
                  onClick={handleAgregarCorreoYEnviar}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  Agregar y enviar
                </button>
              </div>
            )}
            
            {correoError && (
              <div style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "16px" }}>
                {correoError}
              </div>
            )}
          </div>
          
          {loadingInvitaciones ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#888", 
              fontSize: "16px"
            }}>
              Cargando invitaciones...
            </div>
          ) : invitaciones.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#888", 
              fontSize: "16px",
              background: "#f8f9fa",
              borderRadius: "8px"
            }}>
              No hay invitaciones para esta encuesta
            </div>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {invitaciones.map((invitacion, index) => (
                <div
                  key={invitacion.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f3f0fa",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "8px",
                    border: "1px solid #e8e4f7"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                    <span style={{ 
                      background: "#6c63ff", 
                      color: "#fff", 
                      borderRadius: "50%", 
                      width: "24px", 
                      height: "24px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {index + 1}
                    </span>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "4px" }}>
                        {invitacion.email}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Código: {invitacion.codigo}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background: invitacion.respondido === 1 ? "#28a745" : "#ffc107",
                      color: invitacion.respondido === 1 ? "#fff" : "#000"
                    }}>
                      {invitacion.respondido === 1 ? "Respondida" : "Pendiente"}
                    </span>
                    
                    {invitacion.respondido === 1 && invitacion.respondido_en && (
                      <div style={{ fontSize: "11px", color: "#666", textAlign: "right" }}>
                        {new Date(invitacion.respondido_en).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Resumen de estadísticas */}
          {invitaciones.length > 0 && (
            <div style={{ 
              marginTop: "24px", 
              padding: "16px", 
              background: "#e3f2fd", 
              borderRadius: "8px",
              fontSize: "14px"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Resumen:</div>
              <div style={{ display: "flex", gap: "24px" }}>
                <span>Total: {invitaciones.length}</span>
                <span style={{ color: "#28a745" }}>
                  Respondidas: {invitaciones.filter(i => i.respondido === 1).length}
                </span>
                <span style={{ color: "#ffc107" }}>
                  Pendientes: {invitaciones.filter(i => i.respondido === 0).length}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Modo creación - Funcionalidad original */
        <>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontWeight: "bold", fontSize: "17px", marginBottom: "8px" }}>Agregar correo</div>
            <div style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
              Solo los correos de esta lista podrán responder la encuesta anónima
            </div>
            
            {/* Botón para alternar entre modo individual y múltiple */}
            <div style={{ marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowMultipleInput(!showMultipleInput)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: "#6c63ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                {showMultipleInput ? "Modo individual" : "Agregar múltiples"}
              </button>
            </div>
            
            {showMultipleInput ? (
              /* Modo múltiple */
              <div style={{ marginBottom: "8px" }}>
                <textarea
                  placeholder="Ingresa varios correos separados por comas, espacios o saltos de línea&#10;Ejemplo:&#10;correo1@ejemplo.com&#10;correo2@ejemplo.com, correo3@ejemplo.com"
                  value={multipleEmails}
                  onChange={(e) => { setMultipleEmails(e.target.value); setCorreoError(""); }}
                  style={{
                    width: "96%",
                    minHeight: "120px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "16px",
                    background: "#fff",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" , justifyContent:"right"}}>
                  <button
                    type="button"
                    onClick={handleAgregarMultiples}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "6px",
                      background: "#6c63ff",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Agregar múltiples
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMultipleEmails(""); setCorreoError(""); }}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "6px",
                      background: "#6c757d",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo individual */
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={nuevoCorreo}
                  onChange={(e) => { setNuevoCorreo(e.target.value); setCorreoError(""); }}
                  onKeyPress={handleKeyPress}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "16px",
                    background: "#fff"
                  }}
                />
                <button
                  type="button"
                  onClick={handleAgregarCorreo}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: "#6c63ff",
                    color: "#fff",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  Agregar
                </button>
              </div>
            )}
            
            {correoError && (
              <div style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "16px" }}>
                {correoError}
              </div>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #ece6f6", margin: "32px 0" }} />

          <div>
            <div style={{ fontWeight: "bold", fontSize: "17px", marginBottom: "16px" }}>
              Lista de correos autorizados ({correosFiltrados.length} de {correos.length})
            </div>
            
            {/* Barra de búsqueda */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar correos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "96%",
                  padding: "12px 16px",
                  paddingRight: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "16px",
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              
            </div>
            
            {/* Indicador de resultados de búsqueda */}
            {searchTerm && (
              <div style={{ 
                marginBottom: "12px", 
                padding: "8px 12px", 
                background: "#e3f2fd", 
                borderRadius: "6px",
                fontSize: "14px",
                color: "#1976d2"
              }}>
                {correosFiltrados.length > 0 
                  ? `Se encontraron ${correosFiltrados.length} correo${correosFiltrados.length !== 1 ? 's' : ''} que coinciden con "${searchTerm}"`
                  : `No se encontraron correos que coincidan con "${searchTerm}"`
                }
              </div>
            )}
            
            {correosFiltrados.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px", 
                color: "#888", 
                fontSize: "16px",
                background: "#f8f9fa",
                borderRadius: "8px"
              }}>
                {searchTerm ? `No se encontraron correos que coincidan con "${searchTerm}"` : 'No hay correos agregados aún'}
              </div>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {correosFiltrados.map((correo, index) => {
                  console.log(`Renderizando correo ${index}:`, correo);
                  return (
                    <div
                      key={correo.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#f3f0fa",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "8px",
                        border: "1px solid #e8e4f7"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <span style={{ 
                          background: "#6c63ff", 
                          color: "#fff", 
                          borderRadius: "50%", 
                          width: "24px", 
                          height: "24px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}>
                          {index + 1}
                        </span>
                        
                        {editingId === correo.id ? (
                          <input
                            type="email"
                            value={editingEmail}
                            onChange={(e) => { setEditingEmail(e.target.value); setCorreoError(""); }}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                              fontSize: "14px",
                              margin:"6px"
                
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "16px", fontWeight: "500", flex: 1 }}>
                            {correo.email || 'Email vacío'}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        {editingId === correo.id ? (
                          <>
                            <button
                              type="button"
                              onClick={guardarEdicion}
                              style={{
                                background: "#6c63ff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold"
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={cancelarEdicion}
                              style={{
                                background: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold"
                              }}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => iniciarEdicion(correo)}
                              style={{
                                background: "#6c63ff",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold"
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarCorreo(correo)}
                              style={{
                                background: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold"
                              }}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CorreosAutorizados; 
