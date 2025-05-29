import { useState } from "react";

type PreguntaProps = {
  onEliminarPregunta?: () => void;
};

const Pregunta: React.FC<PreguntaProps> = ({ onEliminarPregunta }) => {
  const [titulo, setTitulo] = useState("Pregunta sin título");
  const [tipoPregunta, setTipoPregunta] = useState("Opción Múltiple");
  const [opciones, setOpciones] = useState(["Opción 1"]);
  const [esObligatoria, setEsObligatoria] = useState(false);
  const [numEstrellas, setNumEstrellas] = useState(5);

  const agregarOpcion = () => {
    setOpciones([...opciones, `Opción ${opciones.length + 1}`]);
  };

  // Función para eliminar una opción, pero nunca dejar menos de una
  const eliminarOpcion = (index: number) => {
    if (opciones.length > 1) {
      setOpciones(opciones.filter((_, i) => i !== index));
    }
  };

  // Función para editar el nombre de una opción
  const editarOpcion = (index: number, nuevoValor: string) => {
    setOpciones(opciones.map((op, i) => i === index ? nuevoValor : op));
  };

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    }}>
      
      {/* Título de la pregunta y selector de tipo en la misma línea */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
        <input 
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            flex: 2,
            fontSize: "16px",
            border: "none",
            borderBottom: "2px solid #cfd8dc",
            outline: "none",
            backgroundColor: "#fafafa",
            padding: "18px 16px 10px 16px",
            borderRadius: "4px 4px 0 0"
          }}
        />
        <select 
          value={tipoPregunta}
          onChange={(e) => setTipoPregunta(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            height:"50px",
          }}
        >
          <option value="Opción Múltiple">Opción Múltiple</option>
          <option value="Escala Likert">Escala Likert</option>
          <option value="Pregunta Abierta">Pregunta Abierta</option>
        </select>
      </div>

      {/* Renderizar dependiendo del tipo de pregunta */}
      <div style={{ marginTop: "25px" }}>
        {tipoPregunta === "Opción Múltiple" && (
          <div>
            {opciones.map((opcion, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "8px" }}>
                <input type="radio" disabled style={{ accentColor: "#bdbdbd" , height:"16px", width:"14px"}} />
                <input
                  type="text"
                  value={opcion}
                  onChange={e => editarOpcion(index, e.target.value)}
                  style={{
                    margin: 0,
                    border: "none",
                    background: "transparent",
                    fontSize: "16px",
                    color: "#222",
                    outline: "none",
                    padding:"4px",
                    paddingTop:"10px"
                  }}
                />
                {opciones.length > 1 && index !== 0 && (
                  <button
                    onClick={() => eliminarOpcion(index)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      marginLeft: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Eliminar opción"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#70757a" viewBox="0 0 24 24">
                      <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {/* Línea divisoria debajo de las opciones */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "24px 0 0 0" }} />
            <button 
              onClick={agregarOpcion}
              style={{
                backgroundColor: "transparent",
                color: "#70757a",
                borderRadius: "6px",
                border: "none",
                cursor: opciones.length >= 4 ? "not-allowed" : "pointer",
                marginTop: "10px",
                opacity: opciones.length >= 4 ? 0.5 : 1
              }}
              disabled={opciones.length >= 4}
            >
              Agregar opción
            </button>
          </div>
        )}
        
        {tipoPregunta === "Escala Likert" && (
          <div style={{ marginTop: "24px" }}>
            {/* Selector de número de estrellas */}
            <select
              value={numEstrellas}
              onChange={e => setNumEstrellas(Number(e.target.value))}
              style={{
                width: "70px",
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#fff",
                marginBottom: "32px",
                marginTop: "8px",
                display: "block"
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
            {/* Números debajo de las estrellas */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginBottom: "8px" }}>
              {Array.from({ length: numEstrellas }, (_, i) => (
                <span key={i} style={{ fontSize: "18px", color: "#222", width: "32px", textAlign: "center" }}>{i + 1}</span>
              ))}
            </div>
            {/* Estrellas */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px" }}>
              {Array.from({ length: numEstrellas }, (_, i) => (
                <svg key={i} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            {/* Línea divisoria debajo de las estrellas */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "24px 0 0 0" }} />
          </div>
        )}

        {tipoPregunta === "Pregunta Abierta" && (
          <div style={{ marginTop: "32px" }}>
            
            <div>
              <input
                type="text"
                disabled
                placeholder="Respuesta"
                style={{
                  display: "block",
                  marginTop: "8px",
                  border: "none",
                  borderBottom: "2px solid #b0bec5",
                  background: "transparent",
                  fontSize: "14px",
                  color: "#222",
                  width: "240px",
                }}
              />
            </div>
            {/* Línea divisoria debajo de la respuesta */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "32px 0 0 0" }} />
          </div>
        )}
      </div>

      {/* Controles adicionales */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "24px", borderTop: "none" }}>
        {/* Botón de eliminar pregunta */}
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            padding: 0,
            marginRight: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Eliminar pregunta"
          onClick={onEliminarPregunta}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#222" viewBox="0 0 24 24">
            <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
          </svg>
        </button>
        {/* Switch de obligatoria */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid #e0e0e0", paddingLeft: "24px" }}>
          <span style={{ color: "#222", fontSize: "16px" }}>Obligatoria</span>
          <label style={{ position: "relative", display: "inline-block", width: "40px", height: "22px" }}>
            <input
              type="checkbox"
              checked={esObligatoria}
              onChange={(e) => setEsObligatoria(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: esObligatoria ? "#4285f4" : "#ccc",
              borderRadius: "34px",
              transition: "background-color 0.2s"
            }}></span>
            <span style={{
              position: "absolute",
              left: esObligatoria ? "20px" : "2px",
              top: "2px",
              width: "18px",
              height: "18px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              transition: "left 0.2s"
            }}></span>
          </label>
        </div>
      </div>

    </div>
  );
};

export default Pregunta;
