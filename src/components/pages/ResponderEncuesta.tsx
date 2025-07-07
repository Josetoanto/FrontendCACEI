import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import InfoEncuesta from "../molecule/InfoEncuesta";
import Pregunta from "../molecule/Pregunta";
import Swal from 'sweetalert2';

interface Survey {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'egresado' | 'empleador' | 'autoevaluacion';
  anonima: 0 | 1;
  inicio: string;
  fin: string;
}

interface Question {
  id: number;
  encuesta_id: number;
  tipo: 'abierta' | 'multiple' | 'likert';
  texto: string;
  orden: number;
  competencia_asociada: string;
  opciones: Array<{
    id: number;
    pregunta_id: number;
    valor: string;
    etiqueta: string;
    peso: number;
  }>;
}

const ResponderEncuesta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const surveyId = id ? parseInt(id) : null; // Parsear el ID de la URL

  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string | number}>({}); // Estado para almacenar las respuestas
  const [hasResponded, setHasResponded] = useState(false); // Nuevo estado
  const [userResponseId, setUserResponseId] = useState<number | null>(null); // Nuevo estado para el ID de la respuesta
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar doble envío

  // Obtener el ID del usuario actual del localStorage
  const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;
  const navigate = useNavigate();
  const userType = JSON.parse(localStorage.getItem('userData') || '{}').tipo;

  // Nuevo: obtener el código anónimo si existe
  const [codigoAnonimo] = useState<string | null>(localStorage.getItem('codigoEncuestaAnonima'));

  // Función para manejar el cambio de respuesta de una pregunta individual
  const handleAnswerChange = useCallback((questionId: number, value: string | number) => {
    if (hasResponded) return; // Si ya respondió, no permitir cambios
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  }, [hasResponded]);

  const fetchSurveyData = useCallback(async () => {
    if (!surveyId) {
      setError('ID de encuesta no proporcionado.');
      setIsLoading(false);
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken && !codigoAnonimo) {
      setError('No autenticado.');
      setIsLoading(false);
      return;
    }

    try {
      const surveyResponse = await fetch(`https://egresados.it2id.cc/api/surveys/${surveyId}`, {
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {},
      });

      if (!surveyResponse.ok) {
        throw new Error(`Error al cargar la encuesta: ${surveyResponse.statusText}`);
      }
      const data = await surveyResponse.json();
      setSurveyData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [surveyId, codigoAnonimo]);

  const fetchQuestionsData = useCallback(async () => {
    if (!surveyId) {
      setError('ID de encuesta no proporcionado.');
      setIsLoading(false);
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken && !codigoAnonimo) {
      setError('No autenticado.');
      setIsLoading(false);
      return;
    }

    try {
      const questionsResponse = await fetch(`https://egresados.it2id.cc/api/questions/survey/${surveyId}`, {
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {},
      });

      if (!questionsResponse.ok) {
        throw new Error(`Error al cargar las preguntas: ${questionsResponse.statusText}`);
      }
      const data = await questionsResponse.json();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [surveyId, codigoAnonimo]);

  // Nueva función para verificar si el usuario ya respondió la encuesta
  const fetchUserResponse = useCallback(async () => {
    if (!surveyId || !currentUserId) return;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;
    // No buscar respuestas previas si es anónimo
    if (codigoAnonimo) return;

    try {
      const response = await fetch(`https://egresados.it2id.cc/api/responses/survey/${surveyId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (response.ok) {
        const allResponses = await response.json();
        const userPreviousResponse = allResponses.find((res: any) => res.usuario_id === currentUserId);
        
        if (userPreviousResponse) {
          setHasResponded(true);
          setUserResponseId(userPreviousResponse.id); // Guardar el ID de la respuesta existente

          // Precargar las respuestas existentes
          const initialAnswers: {[key: number]: string | number} = {};
          userPreviousResponse.detalles.forEach((detail: any) => {
            // Asegurarse de que `questions` ya esté cargado para mapear etiquetas a valores numéricos si es necesario
            const question = questions.find(q => q.id === detail.pregunta_id);
            if (question) {
                if (question.tipo === 'abierta') {
                    initialAnswers[detail.pregunta_id] = detail.valor_texto;
                } else if (question.tipo === 'multiple' || question.tipo === 'likert') {
                    // Si es múltiple o likert, y la API devuelve valor_numero, usarlo directamente
                    // Si la API devolviera etiqueta, necesitaríamos buscar el peso correspondiente
                    initialAnswers[detail.pregunta_id] = detail.valor_numero;
                }
            }
          });
          setAnswers(initialAnswers);
        }
      }
    } catch (err) {
      console.error('Error al verificar respuestas previas:', err);
    }
  }, [surveyId, currentUserId, questions, codigoAnonimo]); // `questions` es una dependencia para pre-cargar respuestas

  useEffect(() => {
    fetchSurveyData();
    fetchQuestionsData();
  }, [fetchSurveyData, fetchQuestionsData]);

  // Se ejecuta después de que `questions` se haya cargado
  useEffect(() => {
    if (questions.length > 0 && currentUserId) {
        fetchUserResponse();
    }
  }, [questions, currentUserId, fetchUserResponse]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Evita doble envío
    setIsSubmitting(true);
    if (!surveyId) {
      setError('ID de encuesta no proporcionado.');
      setIsSubmitting(false);
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken && !codigoAnonimo) {
      setError('No autenticado.');
      setIsSubmitting(false);
      return;
    }

    const responseDetails = questions.map(question => {
      const answerValue = answers[question.id];
      if (question.tipo === 'abierta') {
        return {
          pregunta_id: question.id,
          valor_texto: String(answerValue),
        };
      } else if (question.tipo === 'multiple' || question.tipo === 'likert') {
        let valorNumero = null;
        if (typeof answerValue === 'number') {
            valorNumero = answerValue;
        } else if (typeof answerValue === 'string' && question.opciones) {
            const matchingOption = question.opciones.find(opt => opt.etiqueta === answerValue);
            if (matchingOption) {
                valorNumero = matchingOption.peso; 
            } else {
                const parsedNumber = parseInt(answerValue);
                if (!isNaN(parsedNumber)) {
                    valorNumero = parsedNumber;
                }
            }
        }
        return {
          pregunta_id: question.id,
          valor_numero: valorNumero,
        };
      }
      return null; 
    }).filter(detail => detail !== null);

    const requestBody = {
      response: {
        encuesta_id: surveyId,
      },
      details: responseDetails,
    };

    // Determinar el método y la URL de la API
    let method = hasResponded ? 'PUT' : 'POST';
    let apiUrl = hasResponded 
      ? `https://egresados.it2id.cc/api/responses/${userResponseId}`
      : `https://egresados.it2id.cc/api/responses/`;
    
    let bodyToSend = requestBody;
    let headers: any = {
      'Content-Type': 'application/json'
    };
    // Si es anónimo, usar endpoint especial y sin token
    if (codigoAnonimo) {
      apiUrl = 'https://egresados.it2id.cc/api/responses/anonymous/';
      method = 'POST';
      bodyToSend = requestBody;
      headers = { 'Content-Type': 'application/json' };
    } else if (userToken) {
      headers = {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: headers,
        body: JSON.stringify(bodyToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ${hasResponded ? 'actualizar' : 'enviar'} las respuestas: ${response.status} - ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      // Si es anónimo, marcar como respondido
      if (codigoAnonimo) {
        try {
          await fetch(`https://egresados.it2id.cc/api/anonymous-invitations/code/${codigoAnonimo}/mark-responded`, {
            method: 'PUT',
          });
          localStorage.removeItem('codigoEncuestaAnonima');
          await Swal.fire({
            icon: 'success',
            title: '¡Encuesta respondida con éxito!',
            text: 'Gracias por tu participación.',
          });
          // Redirigir al login si es anónimo
          navigate('/login');
          setIsSubmitting(false);
          return;
        } catch (err) {
          console.error('Error al marcar la invitación anónima como respondida:', err);
          setIsSubmitting(false);
        }
      }
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `Respuestas ${hasResponded ? 'actualizadas' : 'enviadas'} correctamente.`,
      });
      
      // Opcional: Volver a cargar la respuesta del usuario para asegurar el estado más reciente
      fetchUserResponse();

      // --- MARCAR NOTIFICACIONES COMO RESPONDIDAS ---
      try {
        const notiRes = await fetch('https://egresados.it2id.cc/api/notifications/user', {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (notiRes.ok) {
          const notificaciones = await notiRes.json();
          const relacionadas = notificaciones.filter((n: any) => n.encuesta_id === surveyId);
          for (const noti of relacionadas) {
            await fetch(`https://egresados.it2id.cc/api/notifications/${noti.id}/mark-responded`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${userToken}` }
            });
          }
        }
      } catch (err) {
        console.error('Error al marcar notificaciones como respondidas:', err);
      }
      // --- FIN MARCAR NOTIFICACIONES ---
    } catch (err: any) {
      console.error('Error al enviar respuestas:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al enviar respuestas: ${err.message}`,
      });
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  }, [surveyId, answers, questions, hasResponded, userResponseId, fetchUserResponse, codigoAnonimo, navigate, isSubmitting]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando encuesta...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!surveyData) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>No se encontraron datos de la encuesta.</div>;
  }

  const displaySurveyData = hasResponded 
    ? { ...surveyData, descripcion: 'Esta encuesta ya fue respondida.' } 
    : surveyData;

  return (
    <div style={{ background: "#fafbfc", minHeight: "100vh", padding: "0 0 80px 0", backgroundColor: "#f0ebf8" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <InfoEncuesta editable={false} surveyData={displaySurveyData} />
        {!hasResponded && questions.length > 0 ? (questions.map((pregunta) => (
          <div
            key={pregunta.id}
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px 0 #ece6f6",
              margin: "32px 0 0 0",
              padding: "0 0 0 0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch"
            }}
          >
            <Pregunta 
              editable={false} 
              id={pregunta.id} 
              initialQuestion={pregunta} 
              surveyId={surveyId!} 
              onAnswerChange={handleAnswerChange}
              initialAnswer={answers[pregunta.id]} 
            />
          </div>
        ))) : (
            hasResponded ? null : <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666', marginTop: '32px' }}>No hay preguntas para esta encuesta.</p>
        )}
      </div>
      {/* Botón de enviar */}
      {!hasResponded && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", width: "100%", maxWidth: "650px", marginLeft: "auto", marginRight: "auto" }}>
          <button 
            onClick={handleSubmit} 
            disabled={hasResponded || isSubmitting} 
            style={{
            background: "#6c3fc2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 32px",
            fontSize: "16px",
            cursor: hasResponded || isSubmitting ? "not-allowed" : "pointer",
            opacity: hasResponded || isSubmitting ? 0.7 : 1,
          }}>
            {isSubmitting ? "Enviando..." : hasResponded ? "Encuesta Respondida" : "Enviar"}
          </button>
        </div>
      )}
      {hasResponded && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", width: "100%", maxWidth: "650px", marginLeft: "auto", marginRight: "auto" }}>
          <button 
            onClick={() => navigate(userType === 'Egresado' ? '/egresado' : '/evaluador')}
            style={{
              background: "#6c3fc2",
              color: "#fff",
              border: "none",
              width: "100%",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Regresar a la página principal
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponderEncuesta;
