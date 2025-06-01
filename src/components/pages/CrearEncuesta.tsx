import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchSurveyData = async () => {
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
        setSurveyData(survey);

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
    };

    fetchSurveyData();
  }, [id, isEditMode]); // Añadir isEditMode a las dependencias

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando encuesta...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f0ebf8", minHeight: "100vh", paddingBottom: "12px" }}>
      <HeaderEncuesta activo={activo} setActivo={setActivo} surveyTitle={surveyData?.titulo || "Nueva Encuesta"} isEditMode={isEditMode} />
      {activo === "Preguntas" && <CreacionDeEncuesta questions={questionsData} surveyData={surveyData} />}
      {activo === "Respuestas" && <RespuestaCard></RespuestaCard>}
      {activo === "Configuración" && <ConfiguracionEncuesta surveyData={surveyData} />}
    </div>
  );
};

export default CrearEncuesta;
  