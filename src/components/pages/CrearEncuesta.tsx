import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderEncuesta from "../organisms/HeaderEncuesta";
import CreacionDeEncuesta from "../organisms/CreacionDeEncuesta";
import RespuestaCard from "../molecule/RespuestaCard";
import ConfiguracionEncuesta from "../molecule/ConfiguracionEncuesta";

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
      setLoading(false);
      return; // Si no hay ID, es una nueva encuesta, no se carga nada
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      setError('No se encontró el token de usuario. Por favor, inicie sesión.');
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
    if (!latestSurveyData.current) return;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert('No se encontró el token de usuario. Por favor, inicie sesión.');
      return;
    }

    console.log('Enviando surveyData:', latestSurveyData.current);

    try {
      // Actualizar los datos de la encuesta
      const surveyResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/surveys/${latestSurveyData.current.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          titulo: latestSurveyData.current.titulo,
          descripcion: latestSurveyData.current.descripcion,
          anonima: latestSurveyData.current.anonima === 1 ? true : false, // Convertir 0/1 a true/false para la API
          inicio: formatToApiDate(latestSurveyData.current.inicio),
          fin: formatToApiDate(latestSurveyData.current.fin)
        })
      });

      if (!surveyResponse.ok) {
        let errorMessage = `Error al guardar la encuesta: ${surveyResponse.status} ${surveyResponse.statusText}`;
        try {
          const errorBody = await surveyResponse.json(); // Intentar leer como JSON
          errorMessage = `Error al guardar la encuesta: ${JSON.stringify(errorBody)}`;
        } catch (jsonError) {
          const errorText = await surveyResponse.text(); // Si no es JSON, leer como texto
          errorMessage = `Error al guardar la encuesta (texto): ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      // Actualizar las preguntas existentes y añadir las nuevas
      for (const question of questionsData) {
        const questionTypeApi: 'abierta' | 'multiple' | 'likert' = question.tipo;

        let optionsPayload: Option[] = [];
        if (questionTypeApi === 'multiple') {
          optionsPayload = question.opciones.map((opt, index) => ({
            pregunta_id: question.id,
            valor: (index + 1).toString(),
            etiqueta: opt.etiqueta,
            peso: index + 1,
            id: opt.id || 0,
          }));
        } else if (questionTypeApi === 'likert') {
          optionsPayload = Array.from({ length: question.opciones.length > 0 ? question.opciones.length : 5 }, (_, i) => ({
            pregunta_id: question.id,
            valor: (i + 1).toString(),
            etiqueta: (i + 1).toString(),
            peso: i + 1,
            id: question.opciones[i]?.id || 0,
          }));
        }

        const questionPayload = {
          encuesta_id: question.encuesta_id || (latestSurveyData.current?.id || 0),
          tipo: questionTypeApi,
          texto: question.texto,
          orden: question.orden,
          competencia_asociada: question.competencia_asociada,
        };

        const requestBody = {
          question: questionPayload,
          options: optionsPayload,
        };

        if (question.id && question.id !== 0) { // Si la pregunta ya tiene un ID, actualizarla
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
        } else { // Si la pregunta no tiene ID, crearla (es nueva)
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

      // Eliminar preguntas marcadas para eliminación
      for (const questionIdToDelete of questionsToDelete) {
        console.log(`Eliminando pregunta ${questionIdToDelete}`);
        const deleteResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/questions/${questionIdToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!deleteResponse.ok) {
          const errorBody = await deleteResponse.json();
          throw new Error(`Error al eliminar pregunta ${questionIdToDelete}: ${JSON.stringify(errorBody)}`);
        }
      }
      setQuestionsToDelete([]); // Limpiar la lista de preguntas a eliminar después de la operación

      alert('Encuesta y preguntas guardadas exitosamente!');
      await fetchSurveyData(); // Recargar los datos después de un guardado exitoso
    } catch (err: any) {
      console.error('Error al guardar datos:', err);
      alert(`Error al guardar la encuesta: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando encuesta...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f0ebf8", minHeight: "100vh", paddingBottom: "12px" }}>
      <HeaderEncuesta activo={activo} setActivo={setActivo} surveyTitle={surveyData?.titulo || "Nueva Encuesta"} isEditMode={isEditMode} onSave={handleSave} />
      {activo === "Preguntas" && <CreacionDeEncuesta questions={questionsData} surveyData={surveyData} setSurveyData={setSurveyData} onQuestionsChange={handleQuestionsChange} questionsToDelete={questionsToDelete} setQuestionsToDelete={setQuestionsToDelete} />}
      {activo === "Respuestas" && <RespuestaCard></RespuestaCard>}
      {activo === "Configuración" && <ConfiguracionEncuesta surveyData={surveyData} setSurveyData={setSurveyData} />}
    </div>
  );
};

export default CrearEncuesta;
  