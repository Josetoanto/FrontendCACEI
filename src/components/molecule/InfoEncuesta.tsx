import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface Survey {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'egresado' | 'empleador' | 'autoevaluacion';
  anonima: 0 | 1;
  inicio: string;
  fin: string;
}

interface InfoEncuestaProps {
  editable?: boolean;
  surveyData?: Survey | null;
  setSurveyData?: Dispatch<SetStateAction<Survey | null>>;
}

const InfoEncuesta: React.FC<InfoEncuestaProps> = ({ editable = true, surveyData, setSurveyData }) => {
  const [titulo, setTitulo] = useState(surveyData?.titulo || "Encuesta sin título");
  const [descripcion, setDescripcion] = useState(surveyData?.descripcion || "Descripción de la encuesta...");

  useEffect(() => {
    if (surveyData) {
      setTitulo(surveyData.titulo);
      setDescripcion(surveyData.descripcion);
      console.log('InfoEncuesta recibió surveyData:', surveyData);
    }
  }, [surveyData]);

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitulo(newTitle);
    if (setSurveyData) {
      setSurveyData(prev => prev ? { ...prev, titulo: newTitle } : null);
    }
  };

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescripcion(newDescription);
    if (setSurveyData) {
      setSurveyData(prev => prev ? { ...prev, descripcion: newDescription } : null);
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "auto",
      paddingTop:"0px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      marginTop:"24px",
      minWidth:"650px"
    }}>
      {/* Línea superior */}
      <div style={{
        width: "100%",
        height: "10px",
        backgroundColor: "#3c4043",
        marginBottom: "15px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius:"10px"
      }}></div>

      {/* Título (Editable o solo lectura) */}
      <input 
        type="text"
        value={titulo}
        onChange={handleTituloChange}
        style={{
          width: "100%",
          fontSize: "28px",
          fontWeight: "bold",
          padding:"20px",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          paddingBottom:"15px",
          paddingTop:"5px",
        }}
        readOnly={!editable}
      />

      {/* Descripción (Editable o solo lectura) */}
      <textarea 
        value={descripcion}
        onChange={handleDescripcionChange}
        style={{
          width: "90%",
          fontSize: "16px",
          color: "#70757a",
          padding:"20px",
          paddingTop:"0px",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          marginTop: "5px",
          resize: "none",
          minHeight: "50px",
          overflowY: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
        readOnly={!editable}
        rows={2}
      />
    </div>
  );
};

export default InfoEncuesta;
