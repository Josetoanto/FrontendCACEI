import React, { useState } from 'react';

interface EditarHabilidadesProps {
  habilidades: string[];
  setHabilidades: React.Dispatch<React.SetStateAction<string[]>>; // Function to update the skills state
}

const EditarHabilidades: React.FC<EditarHabilidadesProps> = ({ habilidades, setHabilidades }) => {
  const [newHabilidad, setNewHabilidad] = useState('');

  const handleAddHabilidad = () => {
    if (newHabilidad.trim() !== '') {
      setHabilidades(prevHabilidades => [...prevHabilidades, newHabilidad.trim()]);
      setNewHabilidad(''); // Clear the input field
    }
  };

  const handleRemoveHabilidad = (index: number) => {
    setHabilidades(prevHabilidades => prevHabilidades.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHabilidad(e.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Habilidades</h3>
      
      {/* Lista de habilidades existentes con opción de eliminar */}
      <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          paddingLeft: "15px"
      }}>
          {habilidades.map((habilidad, index) => (
              <div key={index} style={{
                  backgroundColor: "#f0f2f5",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
              }}>
                  {habilidad}
                  <button onClick={() => handleRemoveHabilidad(index)} style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      padding: "0"
                  }}>x</button>
              </div>
          ))}
      </div>

      {/* Formulario para agregar nueva habilidad */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <h4 style={{ marginBottom: "10px" }}>Agregar Nueva Habilidad</h4>
        <input
          type="text"
          placeholder="Nueva habilidad"
          value={newHabilidad}
          onChange={handleInputChange}
          style={{ display: "block", width: "calc(100% - 20px)", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd", marginLeft: "15px" }}
        />
        <button onClick={handleAddHabilidad} style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            marginLeft: "15px"
        }}>Agregar Habilidad</button>
      </div>

    </div>
  );
};

export default EditarHabilidades; 
