import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";

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
  const [tituloError, setTituloError] = useState(false);
  const descripcionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (surveyData) {
      setTitulo(surveyData.titulo);
      setDescripcion(surveyData.descripcion);
    }
  }, [surveyData]);

  useEffect(() => {
    if (descripcionRef.current) {
      descripcionRef.current.style.height = 'auto';
      descripcionRef.current.style.height = `${descripcionRef.current.scrollHeight}px`;
    }
  }, [descripcion]);

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitulo(newTitle);
    
    // Validar título vacío
    const isEmpty = !newTitle || newTitle.trim() === '';
    setTituloError(isEmpty);
    
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

      {/* Título y descripción: modo solo lectura o editable */}
      {editable ? (
        <div>
          <input 
            type="text"
            value={titulo}
            onChange={handleTituloChange}
            style={{
              width: "100%",
              fontSize: "28px",
              fontWeight: "bold",
              padding:"20px",
              border: tituloError ? "2px solid #dc3545" : "none",
              outline: "none",
              backgroundColor: "transparent",
              paddingBottom:"15px",
              paddingTop:"5px",
              maxWidth:"600px",
              borderRadius: tituloError ? "4px" : "0"
            }}
          />
                      {tituloError && (
              <div style={{
                color: "#dc3545",
                fontSize: "14px",
                marginLeft: "20px",
                marginTop: "4px"
              }}>
                El título de la encuesta es obligatorio
              </div>
            )}
        </div>
      ) : (
        <div style={{
          width: "100%",
          fontSize: "28px",
          fontWeight: "bold",
          padding:"20px",
          paddingBottom:"15px",
          paddingTop:"5px",
          maxWidth:"600px",
          color: '#333',
          wordBreak: 'break-word',
        }}>{titulo}</div>
      )}

      {editable ? (
        <textarea 
          ref={descripcionRef}
          value={descripcion}
          onChange={handleDescripcionChange}
          onInput={() => {
            if (descripcionRef.current) {
              descripcionRef.current.style.height = 'auto';
              descripcionRef.current.style.height = `${descripcionRef.current.scrollHeight}px`;
            }
          }}
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
            boxSizing: 'border-box',
            wordBreak: 'break-word',
          }}
          readOnly={false}
          rows={2}
        />
      ) : (
        <div style={{
          width: "90%",
          fontSize: "16px",
          color: "#70757a",
          padding:"20px",
          paddingTop:"0px",
          marginTop: "5px",
          minHeight: "50px",
          fontFamily: "Arial, sans-serif",
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
        }}>{descripcion}</div>
      )}
    </div>
  );
};

export default InfoEncuesta;
