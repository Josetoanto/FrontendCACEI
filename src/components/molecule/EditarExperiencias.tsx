import React, { useState } from 'react';

interface Experiencia {
  titulo: string;
  ubicacion: string;
  tiempo: string;
}

interface EditarExperienciasProps {
  experiencias: Experiencia[];
  setExperiencias: React.Dispatch<React.SetStateAction<Experiencia[]>>; // Function to update the experiences state
}

const EditarExperiencias: React.FC<EditarExperienciasProps> = ({ experiencias, setExperiencias }) => {
  const [newExperiencia, setNewExperiencia] = useState<Experiencia>({ titulo: '', ubicacion: '', tiempo: '' });

  const handleAddExperiencia = () => {
    if (newExperiencia.titulo && newExperiencia.ubicacion && newExperiencia.tiempo) {
      setExperiencias(prevExperiencias => [...prevExperiencias, newExperiencia]);
      setNewExperiencia({ titulo: '', ubicacion: '', tiempo: '' }); // Clear the input fields
    }
  };

  const handleRemoveExperiencia = (index: number) => {
    setExperiencias(prevExperiencias => prevExperiencias.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperiencia(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Experiencias</h3>
      
      {/* Lista de experiencias existentes con opción de eliminar */}
      {experiencias.map((exp, index) => (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <div>
            <p style={{ margin: "0", fontWeight: "bold" }}>{exp.titulo}</p>
            <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>{exp.ubicacion}, {exp.tiempo}</p>
          </div>
          <button onClick={() => handleRemoveExperiencia(index)} style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer"
          }}>Eliminar</button>
        </div>
      ))}

      {/* Formulario para agregar nueva experiencia */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <h4 style={{ marginBottom: "10px" }}>Agregar Nueva Experiencia</h4>
        <input
          type="text"
          name="titulo"
          placeholder="Título del puesto"
          value={newExperiencia.titulo}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={newExperiencia.ubicacion}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input
          type="text"
          name="tiempo"
          placeholder="Tiempo (ej: 3 años)"
          value={newExperiencia.tiempo}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <button onClick={handleAddExperiencia} style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer"
        }}>Agregar Experiencia</button>
      </div>

    </div>
  );
};

export default EditarExperiencias; 