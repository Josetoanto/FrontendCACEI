import { useState } from "react";

interface RubricaItemProps {
  titulo: string;
  descripcion: string;
}

const RubricaItem: React.FC<RubricaItemProps> = ({ titulo, descripcion }) => {
  const [desplegado, setDesplegado] = useState(false);

  return (
    <div style={{
      backgroundColor: "#f0f2f5",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      transition: "all 0.3s ease-in-out"
    }}>
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }} 
        onClick={() => setDesplegado(!desplegado)}
      >
        <span>{titulo}</span>
        <i className={`fas fa-chevron-${desplegado ? "up" : "down"}`} style={{ color: "black", transition: "transform 0.3s ease-in-out" }}></i>
      </div>

      {/* Contenido desplegable con animación */}
      <div style={{
        maxHeight: desplegado ? "200px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease-in-out",
      }}>
        <p style={{
          marginTop: "10px",
          textAlign: "left",
          color: "#555",
          opacity: desplegado ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}>
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default RubricaItem;
