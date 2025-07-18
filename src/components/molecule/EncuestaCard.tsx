import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

interface EncuestaCardProps {
  title: string;
  createdAt: string;
  imageSrc: string;
  id: number;
  onDeleteSuccess: () => void;
  isFuture?: boolean;
  inicio?: Date;
  userType?: string;
}

const EncuestaCard: React.FC<EncuestaCardProps> = ({ title, createdAt, imageSrc, id, onDeleteSuccess, isFuture, inicio, userType }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!isFuture) {
      if (userType === 'Administrador') {
        navigate(`/crearEncuesta/${id}`);
      } else if (userType === 'Egresado' || userType === 'Evaluador' || userType === 'Empleador') {
        navigate(`/responderEncuesta/${id}`);
      }
    }
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No estás autenticado para realizar esta acción.', 'error');
        return;
      }

      const apiUrl = `https://egresados.it2id.cc/api/surveys/${id}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          Swal.fire('¡Eliminada!', 'La encuesta ha sido eliminada.', 'success');
          onDeleteSuccess();
        } else {
          const errorText = await response.text();
          Swal.fire('Error', `Error al eliminar la encuesta: ${response.status} - ${errorText}`, 'error');
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        Swal.fire('Error', 'Error de red al intentar eliminar la encuesta.', 'error');
      }
    }
  };

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);

    // Nuevo formulario para clonar encuesta con selección de tipo y anonimato
    const { value: formValues } = await Swal.fire({
      title: 'Clonar encuesta',
      html:
        '<input id="swal-input-title" class="swal2-input" placeholder="Nuevo nombre para la encuesta" style="width:80%">' +
        '<select id="swal-input-type" class="swal2-select" style="margin-top:10px;width:80%">' +
        '<option value="egresado">Egresado</option>' +
        '<option value="evaluador">Evaluador</option>' +
        '<option value="anonima">Anónima</option>' +
        '</select>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Clonar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        const tipo = (document.getElementById('swal-input-type') as HTMLSelectElement).value;
        if (!title) {
          Swal.showValidationMessage('Debes ingresar un nombre');
          return null;
        }
        return { title, tipo };
      }
    });

    if (!formValues) return;
    const { title: newTitle, tipo: newTipo } = formValues;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      Swal.fire('Error', 'No estás autenticado para realizar esta acción.', 'error');
      return;
    }

    Swal.fire({
      title: 'Clonando encuesta...',
      text: 'Por favor espera mientras se clona la encuesta y sus preguntas.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // 1. Obtener datos de la encuesta original
      const surveyRes = await fetch(`https://egresados.it2id.cc/api/surveys/${id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!surveyRes.ok) throw new Error('No se pudo obtener la encuesta original');
      const originalSurvey = await surveyRes.json();

      // 2. Obtener preguntas de la encuesta original
      const questionsRes = await fetch(`https://egresados.it2id.cc/api/questions/survey/${id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!questionsRes.ok) throw new Error('No se pudieron obtener las preguntas');
      const originalQuestions = await questionsRes.json();

      // 3. Crear nueva encuesta con el nuevo nombre, tipo y anonimato
      function formatToApiDate(dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      let tipoFinal = newTipo;
      let anonimaFinal = 0;
      if (newTipo === 'anonima') {
        tipoFinal = 'autoevaluacion';
        anonimaFinal = 1;
      }
      const newSurveyBody = {
        titulo: newTitle,
        descripcion: originalSurvey.descripcion,
        tipo: tipoFinal,
        anonima: anonimaFinal,
        inicio: formatToApiDate(originalSurvey.inicio),
        fin: formatToApiDate(originalSurvey.fin)
      };
      const createSurveyRes = await fetch('https://egresados.it2id.cc/api/surveys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSurveyBody),
      });
      if (!createSurveyRes.ok) throw new Error('No se pudo crear la encuesta clonada');
      const newSurvey = await createSurveyRes.json();

      // 4. Clonar preguntas
      for (const q of originalQuestions) {
        const questionPayload = {
          encuesta_id: newSurvey.id,
          tipo: q.tipo,
          texto: q.texto,
          orden: q.orden,
          competencia_asociada: q.competencia_asociada,
          campo_educacional_numero: q.campo_educacional_numero || 0,
        };
        let optionsPayload = [];
        if (q.tipo === 'multiple' || q.tipo === 'checkbox') {
          optionsPayload = q.opciones.map((opt: any, idx: number) => ({
            valor: (idx + 1).toString(),
            etiqueta: opt.etiqueta,
            peso: idx + 1
          }));
        } else if (q.tipo === 'likert') {
          optionsPayload = Array.from({ length: q.opciones.length > 0 ? q.opciones.length : 5 }, (_, i) => ({
            valor: (i + 1).toString(),
            etiqueta: (i + 1).toString(),
            peso: i + 1
          }));
        }
        const requestBody = {
          question: questionPayload,
          options: optionsPayload
        };
        await fetch(`https://egresados.it2id.cc/api/questions/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      }

      Swal.fire('¡Clonada!', 'La encuesta ha sido clonada exitosamente.', 'success');
      onDeleteSuccess(); // Refrescar lista
    } catch (error: any) {
      console.error('Error al clonar la encuesta:', error);
      Swal.fire('Error', error.message || 'Error al clonar la encuesta.', 'error');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      style={{
        width: "600px",
        display: "flex",
        alignItems: "center",
        padding: "15px",
        cursor: isFuture ? "default" : "pointer",
      }}
    >
      {/* Imagen */}
      <img 
        src={imageSrc} 
        alt="Encuesta ilustrativa" 
        style={{ width: "300px", borderRadius: "8px", marginRight: "15px" }}
        onClick={handleClick}
      />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {/* Encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <h2 style={{
            fontSize: "16px", 
            margin: 0, 
            cursor: isFuture ? "default" : "pointer",
            color: isFuture ? "#A9A9A9" : "inherit"
          }} onClick={handleClick}>{title}</h2>
          {userType === 'Administrador' && (
            <i 
              className="fas fa-ellipsis-v" 
              style={{ cursor: "pointer", color: "#555" , marginLeft:"10px"}}
              onClick={handleToggleMenu}
            ></i>
          )}
          {showMenu && userType === 'Administrador' && (
            <div 
              ref={menuRef} 
              style={{
                position: "absolute",
                top: "25px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                padding: "5px 0",
                minWidth: "120px",
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                opacity: showMenu ? 1 : 0,
                transform: showMenu ? "scale(1)" : "scale(0.95)",
                transformOrigin: "top right",
              }}
            >
              <div 
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  borderBottom: "1px solid #eee"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                onClick={handleClone}
              >
                Clonar
              </div>
              <div 
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                onClick={handleDelete}
              >
                Eliminar
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        {isFuture && inicio ? (
          <p style={{ fontSize: "14px", color: "#A9A9A9", marginBottom: "10px" }}>Activa el {inicio.toLocaleDateString()}</p>
        ) : (
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Creada el {createdAt}</p>
        )}
      </div>
    </div>
  );
};

export default EncuestaCard;
