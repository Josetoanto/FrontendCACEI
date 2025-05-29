import InfoEncuesta from "../molecule/InfoEncuesta";
import Pregunta from "../molecule/Pregunta";
import { useState, useRef } from "react";

const CreacionDeEncuesta: React.FC = () => {
    const [preguntas, setPreguntas] = useState([{ id: 0 }]);
    const nextId = useRef(1);

    const agregarPregunta = () => {
      setPreguntas([...preguntas, { id: nextId.current }]);
      nextId.current += 1;
    };

    const eliminarPregunta = (id: number) => {
      if (preguntas.length > 1) {
        setPreguntas(preguntas.filter((p) => p.id !== id));
      }
    };

    return (
      <div style={{ background: "#fafbfc", minHeight: "100vh", padding: "0 0 80px 0" , backgroundColor:"#f0ebf8"}}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <InfoEncuesta />
          {preguntas.map((pregunta) => (
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
              <Pregunta onEliminarPregunta={() => eliminarPregunta(pregunta.id)} id={pregunta.id} />
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
  