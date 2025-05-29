import { useState } from "react";

interface InfoEncuestaProps {
  editable?: boolean;
}

const InfoEncuesta: React.FC<InfoEncuestaProps> = ({ editable = true }) => {
  const [titulo, setTitulo] = useState("Encuesta sin título");
  const [descripcion, setDescripcion] = useState("Descripción de la encuesta...");

  return (
    <div style={{
      maxWidth: "800px",
      margin: "auto",
      paddingTop:"0px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      marginTop:"24px"
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
        onChange={(e) => editable && setTitulo(e.target.value)}
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
      <input 
        type="text"
        value={descripcion}
        onChange={(e) => editable && setDescripcion(e.target.value)}
        style={{
          width: "100%",
          fontSize: "16px",
          color: "#70757a",
          padding:"20px",
          paddingTop:"0px",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          marginTop: "5px",
        }}
        readOnly={!editable}
      />
    </div>
  );
};

export default InfoEncuesta;
