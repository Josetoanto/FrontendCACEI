import InfoEncuesta from "../molecule/InfoEncuesta";
import Pregunta from "../molecule/Pregunta";

const ResponderEncuesta: React.FC = () => {
  // Simulación de preguntas de diferentes tipos
  const preguntasSimuladas = [
    { id: 1, tipo: "Opción Múltiple", opciones: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"] },
    { id: 2, tipo: "Escala Likert" },
    { id: 3, tipo: "Pregunta Abierta" },
    { id: 4, tipo: "Opción Múltiple", opciones: ["Sí", "No", "Quizás"] }
  ];

  return (
    <div style={{ background: "#fafbfc", minHeight: "100vh", padding: "0 0 80px 0", backgroundColor: "#f0ebf8" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <InfoEncuesta editable={false} />
        {preguntasSimuladas.map((pregunta) => (
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
            {/* Pasar el tipo de pregunta simulado al componente Pregunta */}
            <Pregunta 
              editable={false} 
              initialTipoPregunta={pregunta.tipo} 
              initialOpciones={pregunta.opciones}
              id={pregunta.id}
            />
          </div>
        ))}
      </div>
      {/* Botón de enviar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", width: "100%", maxWidth: "650px", marginLeft: "auto", marginRight: "auto" }}>
        <button style={{
          background: "#6c3fc2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 32px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ResponderEncuesta;
