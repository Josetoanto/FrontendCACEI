import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import InfoEncuesta from "../molecule/InfoEncuesta";
import Pregunta from "../molecule/Pregunta";

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

  // Obtener el ID del usuario actual del localStorage
  const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;

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
    if (!userToken) {
      setError('No autenticado.');
      setIsLoading(false);
      return;
    }

    try {
      const surveyResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/surveys/${surveyId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
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
  }, [surveyId]);

  const fetchQuestionsData = useCallback(async () => {
    if (!surveyId) {
      setError('ID de encuesta no proporcionado.');
      setIsLoading(false);
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      setError('No autenticado.');
      setIsLoading(false);
      return;
    }

    try {
      const questionsResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/survey/${surveyId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
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
  }, [surveyId]);

  // Nueva función para verificar si el usuario ya respondió la encuesta
  const fetchUserResponse = useCallback(async () => {
    if (!surveyId || !currentUserId) return;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;

    try {
      const response = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/responses/survey/${surveyId}`, {
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
  }, [surveyId, currentUserId, questions]); // `questions` es una dependencia para pre-cargar respuestas

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
    if (!surveyId) {
      setError('ID de encuesta no proporcionado.');
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      setError('No autenticado.');
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
    const method = hasResponded ? 'PUT' : 'POST';
    const apiUrl = hasResponded 
      ? `https://gcl58kpp-8000.use2.devtunnels.ms/responses/${userResponseId}` // Si ya respondió, PUT a su ID de respuesta
      : `https://gcl58kpp-8000.use2.devtunnels.ms/responses/`; // Si no, POST
    
    const bodyToSend = hasResponded ? { details: responseDetails } : requestBody; // Si es PUT, solo los detalles

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ${hasResponded ? 'actualizar' : 'enviar'} las respuestas: ${response.status} - ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      alert(`Respuestas ${hasResponded ? 'actualizadas' : 'enviadas'} correctamente.`);
      console.log(`Respuestas ${hasResponded ? 'actualizadas' : 'enviadas'} correctamente:`, data);
      // Opcional: Volver a cargar la respuesta del usuario para asegurar el estado más reciente
      fetchUserResponse();
    } catch (err: any) {
      console.error('Error al enviar respuestas:', err);
      alert(`Error al enviar respuestas: ${err.message}`);
    }
  }, [surveyId, answers, questions, hasResponded, userResponseId, fetchUserResponse]);

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
        <InfoEncuesta editable={!hasResponded} surveyData={displaySurveyData} />
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
            disabled={hasResponded} 
            style={{
            background: "#6c3fc2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 32px",
            fontSize: "16px",
            cursor: hasResponded ? "not-allowed" : "pointer",
            opacity: hasResponded ? 0.7 : 1,
          }}>
            {hasResponded ? "Encuesta Respondida" : "Enviar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponderEncuesta;
