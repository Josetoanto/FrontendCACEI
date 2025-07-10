import InfoEncuesta from "../molecule/InfoEncuesta";
import Pregunta from "../molecule/Pregunta";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

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
  tipo: 'abierta' | 'multiple' | 'likert' | 'checkbox';
  texto: string;
  orden: number;
  competencia_asociada: string;
  campo_educacional_numero?: number;
  opciones: Option[];
  tempClientId?: number;
}

interface Survey {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'egresado' | 'empleador' | 'autoevaluacion';
  anonima: 0 | 1;
  inicio: string;
  fin: string;
}

interface CreacionDeEncuestaProps {
  questions: Question[];
  surveyData: Survey | null;
  setSurveyData: Dispatch<SetStateAction<Survey | null>>;
  onQuestionsChange: (updatedQuestions: Question[]) => void;
  questionsToDelete: number[];
  setQuestionsToDelete: Dispatch<SetStateAction<number[]>>;
  camposEducacionales: Array<{id: number, numero: number, nombre: string, descripcion: string}>;
  onValidationError?: (errors: string[]) => void;
}

const CreacionDeEncuesta: React.FC<CreacionDeEncuestaProps> = ({ questions, surveyData, setSurveyData, onQuestionsChange, setQuestionsToDelete, camposEducacionales, onValidationError }) => {
    const [preguntas, setPreguntas] = useState<Question[]>([]);
    const nextId = useRef(1);

    useEffect(() => {
      if (questions && questions.length > 0) {
        const sortedQuestions = [...questions].sort((a, b) => a.orden - b.orden);
        setPreguntas(sortedQuestions);
        nextId.current = Math.max(...questions.map(q => q.id)) + 1;
      } else {
        setPreguntas([{ id: 0, encuesta_id: 0, tipo: 'multiple', texto: 'Pregunta sin título', orden: 0, competencia_asociada: '', campo_educacional_numero: 0, opciones: [
          { id: 0, pregunta_id: 0, valor: "1", etiqueta: "Opción 1", peso: 1 },
          { id: 0, pregunta_id: 0, valor: "2", etiqueta: "Opción 2", peso: 2 }
        ], tempClientId: Date.now() }]);
        nextId.current = 1;
      }
    }, [questions]);

    // Función para validar todas las preguntas
    const validateQuestions = () => {
      const errors: string[] = [];
      
      // Validar título de la encuesta
      if (!surveyData?.titulo || surveyData.titulo.trim() === '') {
        errors.push('El título de la encuesta es obligatorio');
      }
      
      // Validar cada pregunta
      preguntas.forEach((pregunta, index) => {
        // Validar título de la pregunta
        if (!pregunta.texto || pregunta.texto.trim() === '') {
          errors.push(`Pregunta ${index + 1}: El título es obligatorio`);
        }
        
        // Validar opciones para preguntas de opción múltiple y checkbox
        if (pregunta.tipo === 'multiple' || pregunta.tipo === 'checkbox') {
          pregunta.opciones.forEach((opcion, opcionIndex) => {
            if (!opcion.etiqueta || opcion.etiqueta.trim() === '') {
              errors.push(`Pregunta ${index + 1}, Opción ${opcionIndex + 1}: La opción no puede estar vacía`);
            }
          });
        }
      });
      
      return errors;
    };

    // Exponer la función de validación al componente padre
    useEffect(() => {
      if (onValidationError) {
        const errors = validateQuestions();
        onValidationError(errors);
      }
    }, [preguntas, surveyData?.titulo, onValidationError]);

    const agregarPregunta = () => {
              const newQuestion: Question = {
          id: 0,
          tempClientId: Date.now(),
          encuesta_id: surveyData?.id || 0,
          tipo: 'multiple',
          texto: "Pregunta sin título",
          orden: preguntas.length + 1,
          competencia_asociada: "",
          campo_educacional_numero: 0,
          opciones: [
            { id: 0, pregunta_id: 0, valor: "1", etiqueta: "Opción 1", peso: 1 },
            { id: 0, pregunta_id: 0, valor: "2", etiqueta: "Opción 2", peso: 2 }
          ]
        };
      const updatedPreguntas = [...preguntas, newQuestion];
      setPreguntas(updatedPreguntas);
      onQuestionsChange(updatedPreguntas);
    };

    const eliminarPregunta = (idToDelete: number) => {
      const questionToRemove = preguntas.find(p => p.id === idToDelete || p.tempClientId === idToDelete);
      if (!questionToRemove) return;

      if (questionToRemove.id !== 0) {
        setQuestionsToDelete(prev => [...prev, questionToRemove.id]);
      }

      const updatedPreguntas = preguntas.filter((p) => p.id !== idToDelete && p.tempClientId !== idToDelete);
      setPreguntas(updatedPreguntas);
      onQuestionsChange(updatedPreguntas);
    };

    const handleQuestionChange = (updatedQuestion: Question) => {
      const updatedPreguntas = preguntas.map(q => {
        if (updatedQuestion.id === 0 && updatedQuestion.tempClientId && q.tempClientId === updatedQuestion.tempClientId) {
          return updatedQuestion;
        }
        if (updatedQuestion.id !== 0 && q.id === updatedQuestion.id) {
          return updatedQuestion;
        }
        return q;
      });
      setPreguntas(updatedPreguntas);
      onQuestionsChange(updatedPreguntas);
    };

    return (
      <div style={{ background: "#fafbfc", minHeight: "100vh", padding: "0 0 80px 0" , backgroundColor:"#f0ebf8"}}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <InfoEncuesta surveyData={surveyData} setSurveyData={setSurveyData} />
          {preguntas.map((pregunta) => (
            <div
              key={pregunta.id || pregunta.tempClientId}
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
                onEliminarPregunta={() => eliminarPregunta(pregunta.id !== 0 ? pregunta.id : (pregunta.tempClientId || 0))}
                id={pregunta.id || 0}
                initialQuestion={pregunta}
                editable={true}
                surveyId={surveyData?.id || 0}
                onQuestionChange={handleQuestionChange}
                camposEducacionales={camposEducacionales}
              />
            </div>
          ))}
        </div>
        {/* Botón flotante para agregar pregunta */}
        <button
          onClick={agregarPregunta}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            background: "#fff",
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 2px 16px 0 #ece6f6",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1000
          }}
          title="Agregar pregunta"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="14" stroke="#222" strokeWidth="2.5" fill="none" />
            <line x1="18" y1="12" x2="18" y2="24" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="18" x2="24" y2="18" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  };
  
export default CreacionDeEncuesta;
  
