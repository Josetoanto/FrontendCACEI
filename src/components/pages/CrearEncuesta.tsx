import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderEncuesta from "../organisms/HeaderEncuesta";
import CreacionDeEncuesta from "../organisms/CreacionDeEncuesta";
import ConfiguracionEncuesta from "../molecule/ConfiguracionEncuesta";
import RespuestaDisplay from "../molecule/RespuestaCard";
import Swal from 'sweetalert2'; // Importar SweetAlert2
import CorreosAutorizados from "../molecule/CorreosAutorizados";

interface Survey {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'egresado' | 'empleador' | 'autoevaluacion';
  anonima: 0 | 1; // 0 para no anónima, 1 para anónima
  inicio: string;
  fin: string;
}

interface Option {
  id: number;
  pregunta_id: number;
  valor: string;
  etiqueta: string;
  peso: number;
}

interface Question {
  id: number;
  encuesta_id: number;
  tipo: 'abierta' | 'multiple' | 'likert';
  texto: string;
  orden: number;
  competencia_asociada: string;
  opciones: Option[];
  tempClientId?: number;
}

const CrearEncuesta: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const isEditMode = !!id; // Determinar si estamos en modo edición
  const [activo, setActivo] = useState("Preguntas");
  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsToDelete, setQuestionsToDelete] = useState<number[]>([]); // Nuevo estado para IDs de preguntas a eliminar
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Ref para almacenar el surveyData más reciente
  const latestSurveyData = useRef(surveyData);
  useEffect(() => {
    latestSurveyData.current = surveyData;
  }, [surveyData]);

  // Helper function to format date to YYYY-MM-DD HH:MM:SS
  const formatToApiDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const fetchSurveyData = useCallback(async () => {
    if (!isEditMode) {
      // Initialize surveyData with default values for new survey creation
      setSurveyData({
        id: 0, // Placeholder, will be updated by API
        titulo: "Encuesta sin título",
        descripcion: "Descripción de la encuesta...",
        tipo: 'egresado', // Default type for new surveys (adjust if needed)
        anonima: 0, // Default to not anonymous
        inicio: '', // Will be set by user via ConfiguracionEncuesta
        fin: '',     // Will be set by user via ConfiguracionEncuesta
      });
      setLoading(false);
      return; // If no ID, it's a new survey, nothing to fetch
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      Swal.fire('¡Atención!', 'No se encontró el token de usuario. Por favor, inicie sesión.', 'warning');
      setLoading(false);
      return;
    }

    try {
      // Fetch Survey Details
      const surveyResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/surveys/${id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!surveyResponse.ok) throw new Error(`Error al cargar la encuesta: ${surveyResponse.statusText}`);
      const survey: Survey = await surveyResponse.json();

      // Convertir las fechas al formato 'YYYY-MM-DD HH:MM:SS' directamente al cargar
      const formattedSurvey = {
        ...survey,
        inicio: survey.inicio ? new Date(survey.inicio).toISOString().replace('T', ' ').substring(0, 19) : '',
        fin: survey.fin ? new Date(survey.fin).toISOString().replace('T', ' ').substring(0, 19) : '',
      };
      setSurveyData(formattedSurvey);
      console.log('Datos de encuesta cargados/actualizados:', formattedSurvey);

      // Fetch Questions
      const questionsResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/survey/${id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!questionsResponse.ok) throw new Error(`Error al cargar las preguntas: ${questionsResponse.statusText}`);
      const questions: Question[] = await questionsResponse.json();
      setQuestionsData(questions);
      setQuestionsToDelete([]); // Limpiar la lista de preguntas a eliminar al cargar

    } catch (err: any) {
      console.error('Error al obtener datos:', err);
      setError(err.message || 'Error al cargar los datos de la encuesta.');
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode, setSurveyData, setQuestionsData]);

  useEffect(() => {
    fetchSurveyData();
  }, [fetchSurveyData]);

  const handleQuestionsChange = (updatedQuestions: Question[]) => {
    setQuestionsData(updatedQuestions);
  };

  const handleSave = async () => {
    if (isSaving) return; // Evita doble ejecución
    setIsSaving(true);
    if (!latestSurveyData.current) return;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      Swal.fire('¡Atención!', 'No se encontró el token de usuario. Por favor, inicie sesión.', 'warning');
      setIsSaving(false);
      return;
    }

    // NEW: Check for mandatory dates for creation mode
    if (!isEditMode) { // Only for new survey creation
        if (!latestSurveyData.current.inicio || !latestSurveyData.current.fin) {
            Swal.fire('¡Atención!', 'Las fechas de inicio y fin son obligatorias para crear una nueva encuesta.', 'warning');
            setIsSaving(false);
            return;
        }
    }

    try {
      let surveyIdToUse = latestSurveyData.current.id; // Default to existing ID for edit mode

      if (!isEditMode) {
          // Creation Mode: POST survey first
          console.log('Creando nueva encuesta:', latestSurveyData.current);
          const createSurveyResponse = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/surveys/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({
                  titulo: latestSurveyData.current.titulo,
                  descripcion: latestSurveyData.current.descripcion,
                  tipo: latestSurveyData.current.tipo, // Send type
                  anonima: latestSurveyData.current.anonima === 1,
                  inicio: formatToApiDate(latestSurveyData.current.inicio),
                  fin: formatToApiDate(latestSurveyData.current.fin)
              })
          });

          if (!createSurveyResponse.ok) {
              let errorMessage = `Error al crear la encuesta: ${createSurveyResponse.status} ${createSurveyResponse.statusText}`;
              try {
                  const errorBody = await createSurveyResponse.json();
                  errorMessage = `Error al crear la encuesta: ${JSON.stringify(errorBody)}`;
              } catch (jsonError) {
                  const errorText = await createSurveyResponse.text();
                  errorMessage = `Error al crear la encuesta (texto): ${errorText}`;
              }
              throw new Error(errorMessage);
          }
          const newSurvey = await createSurveyResponse.json();
          surveyIdToUse = newSurvey.id; // Get the new ID for questions
          
          // Crear notificación para la nueva encuesta
          try {
            const notificationResponse = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({
                encuesta_id: newSurvey.id,
                mensaje: "¡Tienes una nueva notificación sobre la encuesta!"
              })
            });

            if (!notificationResponse.ok) {
              console.warn('Error al crear la notificación:', await notificationResponse.text());
              // No lanzamos error aquí para no interrumpir el flujo principal
            } else {
              console.log('Notificación creada exitosamente para la encuesta:', newSurvey.id);
            }
          } catch (notificationError) {
            console.warn('Error al crear la notificación:', notificationError);
            // No lanzamos error aquí para no interrumpir el flujo principal
          }
          
          // Enviar invitaciones si la encuesta es anónima
          if (latestSurveyData.current.anonima === 1) {
            console.log('Encuesta anónima creada, enviando invitaciones...');
            try {
              const result = await enviarInvitaciones(newSurvey.id);
              console.log('Resultados de invitaciones:', result);
              // Mostrar mensaje con información de invitaciones
              let mensaje = 'Encuesta creada exitosamente!';
              if (result.total > 0) {
                mensaje += `\n\nSe enviaron ${result.exitosas} invitaciones de ${result.total} correos autorizados.`;
                if (result.fallidas > 0) {
                  mensaje += `\n${result.fallidas} invitaciones no se pudieron enviar.`;
                }
              } else {
                mensaje += '\n\nNo hay correos autorizados para enviar invitaciones.';
              }
              Swal.fire('¡Éxito!', mensaje, 'success');
            } catch (invitationError) {
              console.error('Error al enviar invitaciones:', invitationError);
              Swal.fire('¡Éxito!', 'Encuesta creada exitosamente, pero hubo un problema al enviar las invitaciones.', 'success');
            }
          } else {
            Swal.fire('¡Éxito!', 'Encuesta creada exitosamente!', 'success');
          }
          
          // Update surveyData with the new ID y otros campos retornados por la API
          setSurveyData(prev => prev ? { ...prev, ...newSurvey, id: newSurvey.id } : newSurvey);
      } else {
          // Edit Mode: PUT survey
          console.log('Actualizando encuesta existente:', latestSurveyData.current);
          const surveyResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/surveys/${latestSurveyData.current.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({
                  titulo: latestSurveyData.current.titulo,
                  descripcion: latestSurveyData.current.descripcion,
                  anonima: latestSurveyData.current.anonima === 1, // Convert 0/1 to true/false for API
                  inicio: formatToApiDate(latestSurveyData.current.inicio),
                  fin: formatToApiDate(latestSurveyData.current.fin)
              })
          });

          if (!surveyResponse.ok) {
              let errorMessage = `Error al guardar la encuesta: ${surveyResponse.status} ${surveyResponse.statusText}`;
              try {
                  const errorBody = await surveyResponse.json();
                  errorMessage = `Error al guardar la encuesta: ${JSON.stringify(errorBody)}`;
              } catch (jsonError) {
                  const errorText = await surveyResponse.text();
                  errorMessage = `Error al guardar la encuesta (texto): ${errorText}`;
              }
              throw new Error(errorMessage);
          }
      }

      // Process questions (both for creation and edit)
      for (const question of questionsData) {
        const questionTypeApi: 'abierta' | 'multiple' | 'likert' = question.tipo;

        let optionsPayload: Option[] = [];
        if (questionTypeApi === 'multiple') {
          optionsPayload = question.opciones.map((opt, index) => ({
            pregunta_id: question.id || 0, // Will be updated by API if it's a new question
            valor: (index + 1).toString(),
            etiqueta: opt.etiqueta,
            peso: index + 1,
            id: opt.id || 0,
          }));
        } else if (questionTypeApi === 'likert') {
          optionsPayload = Array.from({ length: question.opciones.length > 0 ? question.opciones.length : 5 }, (_, i) => ({
            pregunta_id: question.id || 0, // Will be updated by API
            valor: (i + 1).toString(),
            etiqueta: (i + 1).toString(),
            peso: i + 1,
            id: question.opciones[i]?.id || 0,
          }));
        }

        const questionPayload = {
          encuesta_id: surveyIdToUse, // Use the new ID for new surveys
          tipo: questionTypeApi,
          texto: question.texto,
          orden: question.orden,
          competencia_asociada: question.competencia_asociada,
        };

        const requestBody = {
          question: questionPayload,
          options: optionsPayload,
        };

        if (question.id && question.id !== 0) { // If question has an ID, update it
          console.log(`Actualizando pregunta ${question.id}:`, question);
          const questionResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/${question.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!questionResponse.ok) {
            const errorBody = await questionResponse.json();
            throw new Error(`Error al actualizar la pregunta ${question.id}: ${JSON.stringify(errorBody)}`);
          }
        } else { // If question doesn't have an ID, create it (new)
          console.log('Creando nueva pregunta:', question);
          const createQuestionResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!createQuestionResponse.ok) {
            const errorBody = await createQuestionResponse.json();
            throw new Error(`Error al crear nueva pregunta: ${JSON.stringify(errorBody)}`);
          }
        }
      }

      // Delete questions marked for deletion
      for (const questionId of questionsToDelete) {
        console.log(`Eliminando pregunta con ID: ${questionId}`);
        const deleteQuestionResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/${questionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
        if (!deleteQuestionResponse.ok) {
          console.error(`Error al eliminar la pregunta ${questionId}:`, await deleteQuestionResponse.text());
          throw new Error(`Error al eliminar la pregunta ${questionId}`);
        }
      }

      Swal.fire('¡Éxito!', `Encuesta ${isEditMode ? 'actualizada' : 'creada'} exitosamente!`, 'success');
      navigate('/home'); // Redirigir al usuario después de guardar exitosamente

    } catch (err: any) {
      console.error('Error al guardar la encuesta:', err);
      Swal.fire('Error', err.message || 'Hubo un error al guardar la encuesta.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para enviar invitaciones a correos autorizados
  const enviarInvitaciones = async (surveyId: number): Promise<{exitosas: number, fallidas: number, total: number}> => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        console.warn('No se encontró el token de usuario para enviar invitaciones');
        return { exitosas: 0, fallidas: 0, total: 0 };
      }

      // Obtener la lista de correos autorizados
      const emailsResponse = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/anonymous-emails', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!emailsResponse.ok) {
        console.warn('Error al obtener correos autorizados:', await emailsResponse.text());
        return { exitosas: 0, fallidas: 0, total: 0 };
      }

      let emails: Array<{id: number, email: string}> = await emailsResponse.json();
      const uniqueEmails = Array.from(new Set(emails.map(e => e.email)));

      console.log("Correos únicos a invitar:", uniqueEmails);

      if (uniqueEmails.length === 0) {
        console.log('No hay correos autorizados para enviar invitaciones');
        return { exitosas: 0, fallidas: 0, total: 0 };
      }

      let invitacionesExitosas = 0;
      let invitacionesFallidas = 0;

      for (const email of uniqueEmails) {
        try {
          console.log("Enviando invitación a:", email);
          const invitationResponse = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/anonymous-invitations', {
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
            invitacionesExitosas++;
          } else {
            invitacionesFallidas++;
          }
        } catch (error) {
          invitacionesFallidas++;
        }
      }

      return { 
        exitosas: invitacionesExitosas, 
        fallidas: invitacionesFallidas, 
        total: uniqueEmails.length 
      };

    } catch (error) {
      console.error('Error al enviar invitaciones:', error);
      return { exitosas: 0, fallidas: 0, total: 0 };
    }
  };

  // Log para saber si la función se llama más de una vez
  console.log("Función enviarInvitaciones definida");

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando encuesta...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f0ebf8", minHeight: "100vh", paddingBottom: "12px" }}>
      <HeaderEncuesta 
        activo={activo} 
        setActivo={setActivo} 
        surveyTitle={surveyData?.titulo || "Nueva Encuesta"} 
        isEditMode={isEditMode} 
        onSave={handleSave}
        isAnonima={surveyData?.anonima === 1 || surveyData?.tipo === 'autoevaluacion'}
        isSaving={isSaving}
      />
      {activo === "Preguntas" && <CreacionDeEncuesta questions={questionsData} surveyData={surveyData} setSurveyData={setSurveyData} onQuestionsChange={handleQuestionsChange} questionsToDelete={questionsToDelete} setQuestionsToDelete={setQuestionsToDelete} />}
      {activo === "Respuestas" && <RespuestaDisplay surveyId={surveyData?.id || null} questions={questionsData} />}
      {activo === "Configuración" && <ConfiguracionEncuesta surveyData={surveyData} setSurveyData={setSurveyData} isEditMode={isEditMode} />}
      {activo === "Correos" && (surveyData?.anonima === 1 || surveyData?.tipo === 'autoevaluacion') && 
        <CorreosAutorizados surveyId={isEditMode ? surveyData?.id : undefined} isEditMode={isEditMode} />}
    </div>
  );
};

export default CrearEncuesta;
  