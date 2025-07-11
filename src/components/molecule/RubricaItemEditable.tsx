import React, { useState } from 'react';

interface RubricaItemEditableProps {
  item: { // Define la estructura del item de la rúbrica
    id: number;
    titulo: string;
    descripcion: string;
  };
  onRemove: (id: number) => void; // Añade prop para eliminar
  canRemove: boolean; // Añade prop para indicar si se puede eliminar
}

const RubricaItemEditable: React.FC<RubricaItemEditableProps> = ({ item, onRemove, canRemove }) => { // Acepta nuevas props
  const [desplegado, setDesplegado] = useState(false);
  const [titulo, setTitulo] = useState(item.titulo);
  const [descripcion, setDescripcion] = useState(item.descripcion);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios, probablemente llamando a una API
    console.log('Guardar cambios:', { id: item.id, titulo, descripcion });
    setIsEditing(false);
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
        {isEditing ? (
          <input 
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ fontSize: "1em", fontWeight: "bold" }}
          />
        ) : (
          <span>{titulo}</span>
        )}
        <i className={`fas fa-chevron-${desplegado ? "up" : "down"}`} style={{ color: "black", transition: "transform 0.3s ease-in-out" }}></i>
      </div>

      {/* Contenido desplegable con animación y campos editables */}
      <div style={{
        maxHeight: desplegado ? "400px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease-in-out",
      }}>
        {isEditing ? (
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{
              marginTop: "10px",
              width: "100%",
              minHeight: "100px",
              padding: "8px",
              fontSize: "1em",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        ) : (
          <p style={{
            marginTop: "10px",
            textAlign: "left",
            color: "#555",
            opacity: desplegado ? 1 : 0,
            transition: "opacity 0.3s ease-in-out"
          }}>
            {descripcion}
          </p>
        )}

        {desplegado && ( // Muestra los botones solo cuando está desplegado
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            {isEditing ? (
              <button 
                onClick={handleSave}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginLeft: "10px"
                }}
              >
                Guardar
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px" // Añade margen a la derecha
                  }}
                >
                  Editar
                </button>
                {canRemove && ( // Muestra el botón de eliminar condicionalmente
                  <button 
                    onClick={() => onRemove(item.id)}
                    style={{
                      backgroundColor: "#f44336", // Rojo para eliminar
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RubricaItemEditable; 