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
  tipo: 'abierta' | 'multiple';
  texto: string;
  orden: number;
  competencia_asociada: string;
  opciones: Option[];
}

const CrearEncuesta: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const isEditMode = !!id; // Determinar si estamos en modo edición
  const [activo, setActivo] = useState("Preguntas");
  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!latestSurveyData.current) return;

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert('No se encontró el token de usuario. Por favor, inicie sesión.');
      return;
    }

    console.log('Enviando surveyData:', latestSurveyData.current);

    try {
      const response = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/surveys/${latestSurveyData.current.id}`, {
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

      if (!response.ok) {
        let errorMessage = `Error al guardar la encuesta: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json(); // Intentar leer como JSON
          errorMessage = `Error al guardar la encuesta: ${JSON.stringify(errorBody)}`;
        } catch (jsonError) {
          const errorText = await response.text(); // Si no es JSON, leer como texto
          errorMessage = `Error al guardar la encuesta (texto): ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      alert('Encuesta guardada exitosamente!');
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
      {activo === "Preguntas" && <CreacionDeEncuesta questions={questionsData} surveyData={surveyData} setSurveyData={setSurveyData} />}
      {activo === "Respuestas" && <RespuestaCard></RespuestaCard>}
      {activo === "Configuración" && <ConfiguracionEncuesta surveyData={surveyData} setSurveyData={setSurveyData} />}
    </div>
  );
};

export default CrearEncuesta;
  