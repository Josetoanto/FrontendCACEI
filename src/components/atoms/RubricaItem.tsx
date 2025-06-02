import { useState } from "react";

interface RubricaItemProps {
  titulo: string;
  descripcion: string;
  criterioId: number;
  onPuntuacionChange: (criterioId: number, puntuacion: number | null) => void;
}

const RubricaItem: React.FC<RubricaItemProps> = ({ titulo, descripcion, criterioId, onPuntuacionChange }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);

  const handlePuntuacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      setPuntuacion(value);
      onPuntuacionChange(criterioId, value);
    } else if (e.target.value === '') {
      setPuntuacion(null);
      onPuntuacionChange(criterioId, null);
    }
  };

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
        <div style={{
          marginTop: "10px",
          textAlign: "right",
          opacity: desplegado ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}>
          <label htmlFor={`puntuacion-${titulo}`} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '0.9em' }}>Puntuación (1-100):</label>
          <input
            type="number"
            id={`puntuacion-${titulo}`}
            min="1"
            max="100"
            value={puntuacion !== null ? puntuacion : ''}
            onChange={handlePuntuacionChange}
            style={{
              width: '130px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              display: 'inline-block',
              marginLeft: 'auto',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RubricaItem;
